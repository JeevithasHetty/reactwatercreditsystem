import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createListing } from "../api/listings";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    location: "",
    quantity: "",
    price: "",
    deliveryType: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createListing(form, user.token);
      setMessage("✅ Listing added successfully!");
      setForm({ location: "", quantity: "", price: "", deliveryType: "" });
    } catch (err) {
      setMessage("❌ Failed to add listing");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px" }}>
      <h2>📊 Seller Dashboard</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="quantity"
          placeholder="Water Quantity (liters)"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          name="deliveryType"
          placeholder="Truck / Pipeline"
          value={form.deliveryType}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Listing</button>
      </form>

      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
