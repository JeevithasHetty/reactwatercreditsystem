import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";

export default function Cart({
  user,
  cart,
  listings,
  addToCart,
  decreaseQty,
  removeFromCart,
  checkout
}) {
  if (user?.role !== "buyer" || cart.length === 0) return null;

  return (
    <div className="cart-page">
      <h3>Cart</h3>

      {cart.map(item => {
        const listing = listings.find(l => l._id === item.listing);
        if (!listing) return null;

        return (
          <div
            key={item.listing}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0"
            }}
          >
            <b>{listing.location}</b>

            <p>
              Qty: {item.quantity} L | ₹
              {item.quantity * listing.pricePerLitre}
            </p>

            <button onClick={() => decreaseQty(item.listing)}>
              <Minus size={14} />
            </button>

            <button onClick={() => addToCart(listing)}>
              <Plus size={14} />
            </button>

            <button onClick={() => removeFromCart(item.listing)}>
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}

      <button onClick={checkout}>Checkout</button>
    </div>
  );
}
