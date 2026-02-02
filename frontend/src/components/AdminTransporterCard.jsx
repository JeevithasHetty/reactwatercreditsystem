const AdminTransporterCard = ({ transporter, verifyTransporter }) => (
  <div className="border p-4 rounded shadow flex justify-between items-center">
    <div>
      <p>Name: {transporter.name}</p>
      <p>Status: {transporter.verified ? "Verified" : "Pending"}</p>
    </div>
    {!transporter.verified && (
      <button
        onClick={() => verifyTransporter(transporter._id)}
        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
      >
        Verify
      </button>
    )}
  </div>
);

export default AdminTransporterCard;
