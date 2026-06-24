import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SellerOrders() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || !token) return navigate("/login");
    if (user.role !== "seller") return navigate("/marketplace");
    loadOrders();
    // eslint-disable-next-line
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/seller", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to load seller orders");
    }
  };

  // Sellers in this project don't have a backend endpoint to change delivery status directly.
  // Transporters update delivery status at /api/transporter/orders/:orderId/status and
  // admins assign transporters at /api/admin/orders/:orderId/assign. To avoid 404/production
  // errors, we remove the update buttons from the seller UI.

  return (
    <div style={{ padding: 20 }}>
      <h2>Orders for My Listings</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((o) => (
        <div key={o._id} style={{ border: "1px solid #ccc", padding: 12, marginTop: 10 }}>
          <p><b>Buyer:</b> {o.buyer?.name || "Buyer"}</p>
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

          {o.transporter && (
            <div style={{ marginTop: 10 }}>
              <b>Transporter:</b> {o.transporter?.name || o.transporter}
            </div>
          )}

        </div>
      ))}
    </div>
  );
}
