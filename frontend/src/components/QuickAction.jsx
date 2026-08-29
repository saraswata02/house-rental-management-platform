// QuickAction — a clickable card used for dashboard navigation
function QuickAction({ icon, title, description, onClick }) {
  return (
    <div
      className="action-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="action-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default QuickAction;
