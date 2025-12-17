import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const api = axios.create({
    baseURL: "http://localhost:8080", // đổi cho đúng base URL backend
});

// Gắn accessToken vào header
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Tự refresh token khi 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((p) => {
        if (error) {
            p.reject(error);
        } else {
            p.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalConfig = error.config;
        const { refreshToken, setAuth, logout, user } = useAuthStore.getState();

        if (
            error.response?.status === 401 &&
            !originalConfig._retry &&
            refreshToken
        ) {
            originalConfig._retry = true;

            if (isRefreshing) {
                // đợi refresh xong rồi dùng token mới
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalConfig.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalConfig));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post(
                    "http://localhost:8080/api/auth/refresh-token",
                    { refreshToken }
                );

                const {
                    accessToken: newAccess,
                    refreshToken: newRefresh,
                    userResponse: newUser,
                } = res.data.data;

                setAuth({
                    user: newUser || user,
                    accessToken: newAccess,
                    refreshToken: newRefresh,
                });

                processQueue(null, newAccess);

                originalConfig.headers.Authorization = `Bearer ${newAccess}`;
                return api(originalConfig);
            } catch (err) {
                processQueue(err, null);
                logout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
