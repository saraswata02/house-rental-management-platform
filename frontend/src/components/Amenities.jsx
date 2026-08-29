// Amenities component — displays a grid of property amenities with icons
function Amenities({ amenities = [] }) {
  const iconMap = {
    "Parking": "🚗",
    "Lift": "🛗",
    "Wi-Fi": "📶",
    "Air Conditioning": "❄️",
    "Power Backup": "⚡",
    "Security": "🔒",
    "Garden": "🌿",
    "Gym": "🏋️",
  };

  if (!amenities.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
      {amenities.map((a, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#f0f9ff", border: "1px solid #bae6fd",
            borderRadius: "20px", padding: "4px 12px", fontSize: "13px", color: "#0369a1"
          }}
        >
          {iconMap[a] || "✔"} {a}
        </span>
      ))}
    </div>
  );
}

export default Amenities;
