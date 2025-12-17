import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
});

// =================== REQUEST INTERCEPTOR ===================
axiosClient.interceptors.request.use(
    (config) => {
        // 1. Lấy từ Store (Ưu tiên số 1)
        let token = useAuthStore.getState().accessToken;

        // 2. Nếu Store chưa kịp load, thử lấy trực tiếp từ LocalStorage (key trần)
        if (!token) {
            token = localStorage.getItem("accessToken");
        }

        // 3. (FIX LỖI 401) Nếu dùng Zustand Persist, token nằm trong cục JSON 'auth_v1'
        if (!token) {
            try {
                const persistedState = localStorage.getItem("auth_v1"); // Kiểm tra lại key này trong trình duyệt (F12 -> Application -> Local Storage)
                if (persistedState) {
                    const parsed = JSON.parse(persistedState);
                    // Lấy token từ cấu trúc state đã lưu
                    token =
                        parsed?.state?.accessToken ||
                        parsed?.state?.user?.token;
                }
            } catch (e) {
                console.error("Lỗi parse token từ storage:", e);
            }
        }

        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        } else {
            console.warn("⚠️ Không tìm thấy Token! Request này có thể bị 401.");
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// =================== RESPONSE INTERCEPTOR (Giữ nguyên logic Refresh) ===================
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) return Promise.reject(error);

        const status = error.response.status;

        // Nếu lỗi 401 và chưa retry
        if (status === 401 && !originalRequest._retry) {
            console.log(
                "🔥 Token hết hạn hoặc không hợp lệ, đang thử Refresh..."
            );
            originalRequest._retry = true;

            try {
                // Lấy refresh token tương tự như logic trên
                let refreshToken =
                    useAuthStore.getState().refreshToken ||
                    localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    // Thử lấy từ persist storage nếu ko thấy
                    const persistedState = localStorage.getItem("auth_v1");
                    if (persistedState) {
                        const parsed = JSON.parse(persistedState);
                        refreshToken = parsed?.state?.refreshToken;
                    }
                }

                if (!refreshToken) {
                    throw new Error("Không tìm thấy refreshToken");
                }

                // Gọi API refresh
                const res = await axios.post("http://localhost:8080/refresh", {
                    refreshToken,
                });

                if (res.status === 200 && res.data.data) {
                    const {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        userResponse,
                    } = res.data.data;

                    // Lưu lại token mới
                    useAuthStore.getState().setAuth({
                        user: userResponse,
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    });

                    // Cập nhật localStorage nếu cần (tùy logic app bạn)
                    // localStorage.setItem("accessToken", newAccessToken);

                    // Gắn token mới và gọi lại request cũ
                    axiosClient.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${newAccessToken}`;
                    originalRequest.headers[
                        "Authorization"
                    ] = `Bearer ${newAccessToken}`;

                    return axiosClient(originalRequest);
                }
            } catch (refreshError) {
                console.error("❌ Refresh thất bại, đăng xuất:", refreshError);
                useAuthStore.getState().logout?.();
                localStorage.clear(); // Xóa sạch storage
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
