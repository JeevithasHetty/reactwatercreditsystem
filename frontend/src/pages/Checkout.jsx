import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import API from "../api/orders";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);

  const submitOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    const items = cart.map((c) => ({
      listing: c.listing._id,
      quantity: c.quantity,
      pricePerLitre: c.listing.pricePerLitre,
    }));

    try {
      await API.post("/", { items });
      alert("Order placed successfully!");
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || "Error placing order");
    }
  };

  const total = cart.reduce(
    (sum, c) => sum + c.listing.pricePerLitre * c.quantity,
    0
  );

  return (
    <div>
      <h2>Checkout</h2>
      {cart.map((c) => (
        <div key={c.listing._id}>
          {c.listing.location} x {c.quantity} = ₹
          {c.quantity * c.listing.pricePerLitre}
        </div>
      ))}
      <h3>Total: ₹{total}</h3>
      <button onClick={submitOrder}>Place Order</button>
    </div>
  );
}
