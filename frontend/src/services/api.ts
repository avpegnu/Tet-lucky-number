import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Allow setting a navigate function from React Router (called from App.tsx)
let navigateFn: ((path: string) => void) | null = null;
export const setNavigate = (fn: (path: string) => void) => {
  navigateFn = fn;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors - auto logout on invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if already on login page or if this is a login request
      const currentPath = window.location.pathname;
      const isLoginRequest = error.config?.url?.includes("/auth/");

      if (isLoginRequest || currentPath.includes("/login")) {
        // Just return the error for login pages to handle
        return Promise.reject(error);
      }

      // Get user role before clearing
      const storedUser = localStorage.getItem("user");
      let isAdmin = false;
      try {
        const user = storedUser ? JSON.parse(storedUser) : null;
        isAdmin = user?.role === "admin";
      } catch (e) {
        // Invalid JSON, default to user login
      }

      // Clear invalid token
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      // Redirect to login (use React Router navigate to avoid full page reload)
      const loginPath = isAdmin ? "/admin/login" : "/user/login";
      if (navigateFn) {
        navigateFn(loginPath);
      } else {
        window.location.href = loginPath;
      }
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  adminLogin: (credentials: { username: string; password: string }) =>
    api.post("/auth/admin/login", credentials),
  adminRegister: (data: {
    username: string;
    password: string;
    name?: string;
  }) => api.post("/auth/admin/register", data),
  userLogin: (credentials: { username: string; password: string }) =>
    api.post("/auth/user/login", credentials),
};

// Admin APIs
export const adminAPI = {
  createUser: (data: {
    username: string;
    password: string;
    role: string;
    availableAmounts: number[];
    name?: string;
    customGreeting?: string;
  }) => api.post("/admin/users", data),
  updateUser: (
    id: string,
    data: {
      password?: string;
      role?: string;
      availableAmounts?: number[];
      name?: string;
      customGreeting?: string;
    },
  ) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getUsers: (options?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) => {
    const params: Record<string, string> = {};
    if (options?.page) params.page = String(options.page);
    if (options?.limit) params.limit = String(options.limit);
    if (options?.search) params.search = options.search;
    if (options?.role) params.role = options.role;
    if (options?.status) params.status = options.status;
    return api.get("/admin/users", { params });
  },
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  resetUser: (id: string) => api.post(`/admin/users/${id}/reset`),
  toggleTransferred: (id: string) =>
    api.post(`/admin/users/${id}/toggle-transferred`),
};

// Lucky Money APIs
export const luckyMoneyAPI = {
  getConfig: () => api.get("/lucky/config"),
  draw: () => api.post("/lucky/draw"),
  submitBankInfo: (data: {
    bankName: string;
    accountNumber: string;
    accountName?: string;
  }) => api.post("/lucky/bank-info", data),
  getStatus: () => api.get("/lucky/status"),
};

export default api;
