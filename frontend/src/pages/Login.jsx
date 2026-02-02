import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/marketplace");
    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
