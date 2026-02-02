import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketplace from "./pages/Marketplace";
import BuyerOrders from "./pages/BuyerOrders";
import SellerOrders from "./pages/SellerOrders";
import AdminDashboard from "./pages/AdminDashboard";
import TransporterDashboard from "./pages/TransporterDashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/buyer/orders" element={<BuyerOrders />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/transporter" element={<TransporterDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
