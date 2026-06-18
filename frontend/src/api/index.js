import axios from "axios";

// Base URL points to Railway backend + /api
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// -------------------- AUTH --------------------
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// -------------------- LISTINGS --------------------
export const listingsAPI = {
  getAll: (params) => api.get("/listings", { params }),
  getMy: () => api.get("/listings/my"),
  create: (data) => api.post("/listings", data),
  delete: (id) => api.delete(`/listings/${id}`),
};

// -------------------- ORDERS --------------------
export const ordersAPI = {
  checkout: (data) => api.post("/orders", data),
  getBuyer: () => api.get("/orders/buyer"),
  getSeller: () => api.get("/orders/seller"),
};

// -------------------- TRANSPORTER --------------------
export const transporterAPI = {
  setAvail: (availability) =>
    api.put("/transporter/availability", { availability }),

  getOrders: () =>
    api.get("/transporter/orders"),

  updateStatus: (id, status) =>
    api.put(`/transporter/orders/${id}/status`, { status }),

  updateLoc: (lat, lng) =>
    api.put("/transporter/location", { lat, lng }),
};

// -------------------- ADMIN --------------------
export const adminAPI = {
  getTransporters: () =>
    api.get("/admin/transporters"),

  getVerifications: () =>
    api.get("/admin/verifications"),

  makeDecision: (id, data) =>
    api.post(`/admin/transporters/${id}/decision`, data),

  getAllOrders: () =>
    api.get("/admin/orders"),

  getStats: () =>
    api.get("/admin/stats"),
};

export default api;