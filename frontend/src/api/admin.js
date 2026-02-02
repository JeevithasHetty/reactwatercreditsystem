import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export const getTransporters = async (token) => {
  const res = await axios.get(`${API_URL}/transporters`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const verifyTransporter = async (id, token) => {
  const res = await axios.put(`${API_URL}/verify/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
