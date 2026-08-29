const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// OwnerCard — compact card showing landlord info on a property listing
function OwnerCard({ landlord = {} }) {
  if (!landlord._id) return null;

  const pic = landlord.profilePicture?.startsWith("/uploads")
    ? BACKEND_URL + landlord.profilePicture
    : landlord.profilePicture || "/default-profile.png";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      background: "#f8fafc", border: "1px solid #e2e8f0",
      borderRadius: "10px", padding: "12px 16px"
    }}>
      <img
        src={pic}
        alt="Owner"
        style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }}
      />
      <div>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
          {landlord.firstName} {landlord.lastName}
        </h4>
        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>✔ Verified Owner</p>
        {landlord.phone && (
          <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>📞 {landlord.phone}</p>
        )}
      </div>
    </div>
  );
}

export default OwnerCard;
