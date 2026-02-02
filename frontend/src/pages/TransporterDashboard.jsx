import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TransporterDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || !token) return navigate("/login");
    if (user.role !== "transporter") return navigate("/marketplace");
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5000/api/transporter/orders", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(res.data);
  };

  const updateStatus = async (orderId, deliveryStatus) => {
    await axios.put(
      `http://localhost:5000/api/transporter/orders/${orderId}/status`,
      { deliveryStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Transporter Dashboard</h2>

      {orders.length === 0 && <p>No assigned orders yet.</p>}

      {orders.map((o) => (
        <div key={o._id} style={{ border: "1px solid #ccc", padding: 12, marginTop: 10 }}>
          <p><b>Order:</b> {o._id}</p>
          <p><b>Buyer:</b> {o.buyer?.name} ({o.buyer?.email})</p>
          <p><b>Total:</b> ₹{o.totalAmount}</p>
          <p><b>Status:</b> {o.deliveryStatus}</p>

          {o.deliveryStatus === "Assigned" && (
            <button onClick={() => updateStatus(o._id, "Accepted")}>Accept</button>
          )}

          {o.deliveryStatus === "Accepted" && (
            <button onClick={() => updateStatus(o._id, "InTransit")}>Start Trip</button>
          )}

          {o.deliveryStatus === "InTransit" && (
            <button onClick={() => updateStatus(o._id, "Delivered")}>Mark Delivered</button>
          )}
        </div>
      ))}
    </div>
  );
}
