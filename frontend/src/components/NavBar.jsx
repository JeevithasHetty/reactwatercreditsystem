import { Link, useNavigate } from "react-router-dom";


const user = JSON.parse(localStorage.getItem("user"));

{user?.role === "admin" && (
  <Link to="/admin"><button>Admin</button></Link>
)}

{user?.role === "transporter" && (
  <Link to="/transporter"><button>Transporter</button></Link>
)}


export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user || !token) return null;

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      alignItems: "center",
      padding: "12px 16px",
      borderBottom: "1px solid #ddd",
      marginBottom: "16px"
    }}>
      <b style={{ marginRight: "10px" }}>Water Platform</b>

      <Link to="/marketplace"><button>Marketplace</button></Link>

      {user.role === "buyer" && (
        <Link to="/buyer/orders"><button>My Orders</button></Link>
      )}

      {user.role === "seller" && (
        <Link to="/seller/orders"><button>Seller Orders</button></Link>
      )}

      {user.role === "admin" && (
        <Link to="/admin"><button>Admin Dashboard</button></Link>
      )}

      <span style={{ marginLeft: "auto" }}>
        Logged in: <b>{user.role}</b>
      </span>

      <button onClick={logout}>Logout</button>
      {user?.role === "transporter" && <Link to="/transporter">Transporter</Link>}

    </div>
  );
}
