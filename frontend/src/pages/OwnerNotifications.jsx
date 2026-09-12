import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import "../styles/ownerNotifications.css";
import api from "../utils/api";

function OwnerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/notifications");
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const markAllRead = async () => {
    await api.patch("/notifications/read-all");
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const clearRead = async () => {
    await api.delete("/notifications/clear-read");
    setNotifications(notifications.filter((n) => !n.isRead));
  };

  const markRead = async (notificationId) => {
    await api.patch(`/notifications/${notificationId}/read`);
    setNotifications(notifications.map((notification) => (
      notification._id === notificationId ? { ...notification, isRead: true } : notification
    )));
  };

  return (
    <div className="owner-notifications-page">
      <OwnerNavbar />
      <div className="notifications-container">
        <h1>Notifications</h1>
        {notifications.length > 0 && (
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <button onClick={markAllRead} style={{ cursor: "pointer" }}>
              Mark all as read
            </button>
            <button onClick={clearRead} style={{ cursor: "pointer", background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "6px 12px", borderRadius: "6px" }}>
              Clear Read
            </button>
          </div>
        )}
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((item) => {
            const isAppointment = /appointment|visit|booked|rescheduled/i.test(item.title + " " + item.message);
            return (
              <div
                key={item._id}
                className="notification-card"
                style={{
                  opacity: item.isRead ? 0.6 : 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div className="notification-icon">{item.icon}</div>
                  <div className="notification-content">
                    <h3>{item.title}</h3>
                    <p>{item.message}</p>
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => markRead(item._id)}
                    style={{
                      background: "transparent",
                      border: "1px solid #2563eb",
                      color: "#2563eb",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      marginLeft: "12px",
                    }}
                  >
                    Mark as read
                  </button>
                )}

                {isAppointment && (
                  <button
                    type="button"
                    onClick={() => navigate("/owner-appointments")}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      marginLeft: "12px",
                    }}
                  >
                    Manage Requests →
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </div>
  );
}

export default OwnerNotifications;