import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

export const getTransporters = async (token) => {
  const res = await axios.get(`${API_URL}/transporters`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Verify transporter — uses the backend endpoint POST /api/admin/transporters/:id/decision
// body should include at least { status: 'Verified' } (or 'Rejected') and optional aadhaarNumber/licenseNumber
export const verifyTransporter = async (id, token, data = {}) => {
  const res = await axios.post(`${API_URL}/transporters/${id}/decision`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
