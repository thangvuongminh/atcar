import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
});


axiosClient.interceptors.request.use(
    (config) => {
      
        let token = useAuthStore.getState().accessToken;

        
        if (!token) {
            token = localStorage.getItem("accessToken");
        }

        
        if (!token) {
            try {
                const persistedState = localStorage.getItem("auth_v1"); 
                if (persistedState) {
                    const parsed = JSON.parse(persistedState);
                    
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


axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) return Promise.reject(error);

        const status = error.response.status;

       
        if (status === 401 && !originalRequest._retry) {
            console.log(
                "🔥 Token hết hạn hoặc không hợp lệ, đang thử Refresh..."
            );
            originalRequest._retry = true;

            try {
               
                let refreshToken =
                    useAuthStore.getState().refreshToken ||
                    localStorage.getItem("refreshToken");

                if (!refreshToken) {
                
                    const persistedState = localStorage.getItem("auth_v1");
                    if (persistedState) {
                        const parsed = JSON.parse(persistedState);
                        refreshToken = parsed?.state?.refreshToken;
                    }
                }

                if (!refreshToken) {
                    throw new Error("Không tìm thấy refreshToken");
                }

                
                const res = await axios.post("http://localhost:8080/refresh", {
                    refreshToken,
                });

                if (res.status === 200 && res.data.data) {
                    const {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        userResponse,
                    } = res.data.data;

             
                    useAuthStore.getState().setAuth({
                        user: userResponse,
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    });

                   
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
