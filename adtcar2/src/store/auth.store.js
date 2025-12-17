import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            permissions: [],
            accessToken: null,
            refreshToken: null,
            loading: false,

       
            isAuthenticated: () => !!get().user && !!get().accessToken,

            hasPermission: (perm) => get().permissions.includes(perm),

            hasAnyPermission: (perms = []) =>
                perms.some((p) => get().permissions.includes(p)),

           
            setAuth: ({ user, accessToken, refreshToken }) =>
                set({
                    user,
                    permissions: user?.permissions ?? [],
                    accessToken,
                    refreshToken,
                }),

            setUser: (user) =>
                set({
                    user,
                    permissions: user?.permissions ?? get().permissions,
                }),

            setLoading: (loading) => set({ loading }),

            logout: () =>
                set({
                    user: null,
                    permissions: [],
                    accessToken: null,
                    refreshToken: null,
                }),
        }),
        {
            name: "auth_v1",
            storage: createJSONStorage(() => localStorage),
            // lưu cả token và permission
            partialize: (s) => ({
                user: s.user,
                permissions: s.permissions,
                accessToken: s.accessToken,
                refreshToken: s.refreshToken,
            }),
        }
    )
);
