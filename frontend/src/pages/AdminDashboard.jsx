import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // transporter verification
  const [transporters, setTransporters] = useState([]);
  const [history, setHistory] = useState([]);
  const [forms, setForms] = useState({});

  // order assignment
  const [pendingOrders, setPendingOrders] = useState([]);
  const [verifiedTransporters, setVerifiedTransporters] = useState([]);
  const [assignMap, setAssignMap] = useState({});

  useEffect(() => {
    if (!user || !token) return navigate("/login");
    if (user.role !== "admin") return navigate("/marketplace");
    loadAll();
    // eslint-disable-next-line
  }, []);

  const loadAll = async () => {
    await Promise.all([
      fetchTransporters(),
      fetchHistory(),
      fetchPendingOrders(),
      fetchVerifiedTransporters(),
    ]);
  };

  // -------------------- TRANSPORTER VERIFICATION --------------------

  const fetchTransporters = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/transporters", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransporters(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/verifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHistory(res.data);
  };

  const setFormField = (id, field, value) => {
    setForms((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {
          aadhaarNumber: "",
          licenseNumber: "",
          remarks: "",
          status: "Verified",
        }),
        [field]: value,
      },
    }));
  };

  const submitVerification = async (transporterId) => {
    const f = forms[transporterId];
    if (!f?.aadhaarNumber || !f?.licenseNumber) {
      alert("Aadhaar and License are required");
      return;
    }

    await axios.post(
      `http://localhost:5000/api/admin/transporters/${transporterId}/decision`,
      {
        aadhaarNumber: f.aadhaarNumber,
        licenseNumber: f.licenseNumber,
        remarks: f.remarks || "",
        status: f.status,
        rejectionReason: f.status === "Rejected" ? f.remarks : "",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Saved ✅");
    setForms((prev) => ({
      ...prev,
      [transporterId]: {
        aadhaarNumber: "",
        licenseNumber: "",
        remarks: "",
        status: "Verified",
      },
    }));
    loadAll();
  };

  // -------------------- ORDER ASSIGNMENT --------------------

  const fetchPendingOrders = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/orders/pending",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPendingOrders(res.data);
  };

  const fetchVerifiedTransporters = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/transporters/verified",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setVerifiedTransporters(res.data);
  };

  const assignTransporter = async (orderId) => {
    const transporterId = assignMap[orderId];
    if (!transporterId) return alert("Select a transporter first");

    await axios.put(
      `http://localhost:5000/api/admin/orders/${orderId}/assign`,
      { transporterId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Assigned ✅");
    fetchPendingOrders();
  };

  // -------------------- UI --------------------

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {/* ---------------- TRANSPORTER VERIFICATION ---------------- */}
      <h3 style={{ marginTop: 20 }}>Transporter Verification</h3>

      {transporters.length === 0 && <p>No transporters found.</p>}

      {transporters.map((t) => {
        const f =
          forms[t._id] || {
            aadhaarNumber: "",
            licenseNumber: "",
            remarks: "",
            status: "Verified",
          };

        return (
          <div
            key={t._id}
            style={{ border: "1px solid #ccc", padding: 12, marginTop: 10 }}
          >
            <p>
              <b>{t.name}</b> — {t.email}
            </p>
            <p>Status: {t.verified ? "✅ Verified" : "⏳ Pending"}</p>

            {!t.verified && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  placeholder="Aadhaar Number"
                  value={f.aadhaarNumber}
                  onChange={(e) =>
                    setFormField(t._id, "aadhaarNumber", e.target.value)
                  }
                />
                <input
                  placeholder="License Number"
                  value={f.licenseNumber}
                  onChange={(e) =>
                    setFormField(t._id, "licenseNumber", e.target.value)
                  }
                />
                <select
                  value={f.status}
                  onChange={(e) =>
                    setFormField(t._id, "status", e.target.value)
                  }
                >
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <input
                  placeholder="Remarks"
                  value={f.remarks}
                  onChange={(e) =>
                    setFormField(t._id, "remarks", e.target.value)
                  }
                  style={{ flex: 1, minWidth: 250 }}
                />
                <button onClick={() => submitVerification(t._id)}>
                  Save Entry
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* ---------------- VERIFICATION HISTORY ---------------- */}
      <h3 style={{ marginTop: 30 }}>Verification History</h3>

      {history.length === 0 && <p>No verification entries yet.</p>}

      {history.map((h) => (
        <div
          key={h._id}
          style={{ border: "1px solid #ddd", padding: 10, marginTop: 8 }}
        >
          <p>
            <b>Transporter:</b> {h.transporter?.name} (
            {h.transporter?.email})
          </p>
          <p>
            <b>Status:</b> {h.status} | <b>Aadhaar:</b> {h.aadhaarNumber} |{" "}
            <b>License:</b> {h.licenseNumber}
          </p>
          <p>
            <b>Remarks:</b> {h.remarks || "-"}
          </p>
        </div>
      ))}

      {/* ---------------- ORDER ASSIGNMENT ---------------- */}
      <h3 style={{ marginTop: 30 }}>Pending Orders (Assign Transporter)</h3>

      {pendingOrders.length === 0 && <p>No pending orders.</p>}

      {pendingOrders.map((o) => (
        <div
          key={o._id}
          style={{ border: "1px solid #ccc", padding: 12, marginTop: 10 }}
        >
          <p>
            <b>Order:</b> {o._id}
          </p>
          <p>
            <b>Buyer:</b> {o.buyer?.name} ({o.buyer?.email})
          </p>
          <p>
            <b>Total:</b> ₹{o.totalAmount}
          </p>

          <select
            value={assignMap[o._id] || ""}
            onChange={(e) =>
              setAssignMap((prev) => ({
                ...prev,
                [o._id]: e.target.value,
              }))
            }
            style={{ marginRight: 10 }}
          >
            <option value="" disabled>
              Select verified transporter
            </option>
            {verifiedTransporters.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.email})
              </option>
            ))}
          </select>

          <button onClick={() => assignTransporter(o._id)}>Assign</button>
        </div>
      ))}
    </div>
  );
}
