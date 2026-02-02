import { useState } from "react";
import axios from "axios";

export default function CreateListing() {
  const [form, setForm] = useState({
    waterType: "",
    quantity: "",
    pricePerLiter: "",
    location: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/listings/create",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Listing created successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={submit}>
      <input name="waterType" placeholder="Water Type" onChange={handleChange} />
      <input name="quantity" placeholder="Quantity (liters)" onChange={handleChange} />
      <input name="pricePerLiter" placeholder="Price per liter" onChange={handleChange} />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <button type="submit">Create Listing</button>
    </form>
  );
}
