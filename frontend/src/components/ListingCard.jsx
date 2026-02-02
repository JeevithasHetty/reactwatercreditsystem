import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ListingCard({ listing }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card">
      <h3>{listing.location}</h3>
      <p>Seller: {listing.seller.name}</p>
      <p>Price: ₹{listing.pricePerLitre}/litre</p>
      <p>Available: {listing.quantityLitres} L</p>
      <button onClick={() => addToCart(listing)}>Add to Cart</button>
    </div>
  );
}
