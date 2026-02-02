import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer"); // ✅ default buyer

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/signup", { name, email, password, role });

      // store token + user (your current standard)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/marketplace");
    } catch (err) {
      alert(err.response?.data?.message || "Signup error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Signup</h2>

      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ✅ Role selector */}
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="transporter">Transporter</option>
        </select>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
