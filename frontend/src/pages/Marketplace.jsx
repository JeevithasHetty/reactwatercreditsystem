import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Marketplace() {
  const navigate = useNavigate();

  // ✅ Your Login.jsx stores these separately
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // State
  const [listings, setListings] = useState([]);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    location: "",
    pricePerLitre: "",
    quantityLitres: "",
  });

  // Check login + fetch listings
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all listings
  const fetchListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/listings");
      setListings(res.data);
    } catch (err) {
      console.error("Fetch listings error:", err);
    }
  };

  // Seller: submit new listing
  const submitListing = async (e) => {
    e.preventDefault();
    if (!user || !token) return alert("Login required");

    try {
      await axios.post(
        "http://localhost:5000/api/listings",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setForm({ location: "", pricePerLitre: "", quantityLitres: "" });
      fetchListings();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating listing");
      console.error("Create listing error:", err);
    }
  };

  // Buyer: add item to cart
  const addToCart = (listing) => {
    const existing = cart.find((c) => c.listing === listing._id);

    if (existing) {
      setCart(
        cart.map((c) =>
          c.listing === listing._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { listing: listing._id, quantity: 1 }]);
    }
  };

  // Buyer: remove item from cart
  const removeFromCart = (listingId) => {
    setCart(cart.filter((c) => c.listing !== listingId));
  };

  // Buyer: decrease quantity (removes if goes to 0)
  const decreaseQty = (listingId) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.listing === listingId ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  // Buyer: checkout
  const checkout = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    if (!user || !token) return alert("Login required");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders/",
        { items: cart },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order placed! Total: ₹" + (res.data.totalAmount ?? res.data.total ?? ""));
      setCart([]);
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
      console.error("Checkout error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Marketplace</h1>

      {/* SELLER CREATE LISTING */}
      {user?.role === "seller" && (
        <form onSubmit={submitListing} style={{ marginBottom: "30px" }}>
          <h3>Create Listing</h3>

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Price per litre"
            value={form.pricePerLitre}
            onChange={(e) => setForm({ ...form, pricePerLitre: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Quantity (L)"
            value={form.quantityLitres}
            onChange={(e) => setForm({ ...form, quantityLitres: e.target.value })}
            required
          />

          <button type="submit">Create Listing</button>
        </form>
      )}

      {/* LISTINGS */}
      <h3>All Listings</h3>
      {listings.map((l) => (
        <div
          key={l._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h4>{l.location}</h4>
          <p>Seller: {l.seller?.name || "Unknown"}</p>
          <p>Price: ₹{l.pricePerLitre}</p>
          <p>Available: {l.quantityLitres} L</p>

          {user?.role === "buyer" && (
            <button onClick={() => addToCart(l)}>Add to Cart</button>
          )}
        </div>
      ))}

      {/* CART */}
      {user?.role === "buyer" && (
        <div style={{ marginTop: "30px" }}>
          <h3>Cart</h3>

          {cart.length === 0 && <p>No items in cart</p>}

          {cart.length > 0 &&
            cart.map((c) => {
              const listing = listings.find((l) => l._id === c.listing);
              if (!listing) return null;

              return (
                <div key={c.listing} style={{ marginBottom: "10px" }}>
                  <b>{listing.location}</b> | Qty: {c.quantity} | ₹
                  {c.quantity * listing.pricePerLitre}{" "}
                  <button onClick={() => addToCart(listing)}>+</button>{" "}
                  <button onClick={() => decreaseQty(listing._id)}>-</button>{" "}
                  <button onClick={() => removeFromCart(listing._id)}>
                    Remove
                  </button>
                </div>
              );
            })}

          {cart.length > 0 && (
            <button onClick={checkout} style={{ marginTop: "10px" }}>
              Checkout
            </button>
          )}
        </div>
      )}
    </div>
  );
}
