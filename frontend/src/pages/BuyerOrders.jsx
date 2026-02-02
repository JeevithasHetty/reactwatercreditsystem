import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BuyerOrders() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || !token) return navigate("/login");
    loadOrders();
    // eslint-disable-next-line
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/buyer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to load orders");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((o) => (
        <div key={o._id} style={{ border: "1px solid #ccc", padding: 12, marginTop: 10 }}>
          <p><b>Status:</b> {o.status}</p>
          <p><b>Total:</b> ₹{o.totalAmount}</p>

          <div style={{ marginTop: 8 }}>
            <b>Items:</b>
            {o.items.map((it, idx) => (
              <div key={idx}>
                {it.listing?.location || "Listing"} — Qty: {it.quantity}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
