import axios from "axios";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "/api";

const ROLE_STORAGE_KEYS = {
    user: "token",
    vendor: "vendorToken",
    admin: "adminToken",
};

const ROLE_REDIRECTS = {
    user: "/login",
    vendor: "/vendor-login",
    admin: "/admin-login",
};

function clearRoleData(role) {
    const storageKey = ROLE_STORAGE_KEYS[role];

    if (storageKey) {
        localStorage.removeItem(storageKey);
    }

    if (role === "user") {
        localStorage.removeItem("user");
    }
}

function redirectForRole(role) {
    const redirectUrl = ROLE_REDIRECTS[role] || "/login";

    if (typeof window !== "undefined") {
        window.location.href = redirectUrl;
    }
}

export function buildApiClient(role = "admin") {
    const instance = axios.create({
        baseURL: API_BASE,
    });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem(ROLE_STORAGE_KEYS[role]);

            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error?.response?.status === 401) {
                clearRoleData(role);
                redirectForRole(role);
            }

            return Promise.reject(error);
        }
    );

    return instance;
}

export const userApi = buildApiClient("user");
export const vendorApi = buildApiClient("vendor");
export const adminApi = buildApiClient("admin");

const api = adminApi;

export default api;

export async function apiFetch(
    url,
    options = {},
    role = "user"
) {
    const token = localStorage.getItem(ROLE_STORAGE_KEYS[role]);

    const headers = {
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const finalUrl = url.startsWith("http")
        ? url
        : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url.replace(/^\/+/, "")}`;

    const response = await fetch(finalUrl, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        clearRoleData(role);

        const text = await response
            .clone()
            .text()
            .catch(() => "");

        const parsed = text ? JSON.parse(text) : {};

        redirectForRole(role);

        throw new Error(
            parsed.error || "Session expired"
        );
    }

    return response;
}

export const userApiFetch = (url, options = {}) =>
    apiFetch(url, options, "user");

export const vendorApiFetch = (url, options = {}) =>
    apiFetch(url, options, "vendor");

export const adminApiFetch = (url, options = {}) =>
    apiFetch(url, options, "admin");
