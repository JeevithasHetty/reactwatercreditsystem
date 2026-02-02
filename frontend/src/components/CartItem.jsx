const CartItem = ({ item, removeItem }) => (
  <div className="flex justify-between items-center border-b py-2">
    <div>
      <p>{item.location} - {item.quantity}L</p>
      <p>₹{item.price}</p>
    </div>
    <button onClick={() => removeItem(item._id)} className="text-red-600">Remove</button>
  </div>
);

export default CartItem;
