// src/api/orders.js
import axios from "axios";

const OrdersAPI = axios.create({
  baseURL: "http://localhost:5000/api/orders",
  withCredentials: true,
});

OrdersAPI.placeOrder = (data) => OrdersAPI.post("/", data);
OrdersAPI.getBuyerOrders = () => OrdersAPI.get("/buyer");
OrdersAPI.getSellerOrders = () => OrdersAPI.get("/seller");
OrdersAPI.getSellerAnalytics = () => OrdersAPI.get("/seller/analytics");
OrdersAPI.interceptors.request.use(config => {
  // Attach token consistently from localStorage (other parts of the app store token under 'token')
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default OrdersAPI;
