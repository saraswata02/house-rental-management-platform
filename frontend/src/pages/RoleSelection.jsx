import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AuthNavbar from "../components/AuthNavbar";
import "../styles/roleSelection.css";
import api from "../utils/api";


function RoleSelection() {
  const navigate = useNavigate();

  const selectRole = async (role) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      const { data } = await api.put("/users/profile", { role });
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...data }));
      navigate(role === "landlord" ? "/owner-dashboard" : "/tenant-dashboard");
    } catch (err) {
      console.error("Unable to save role:", err);
    }
  };

  return (
    <div className="role-page">
      <AuthNavbar />

      <div className="role-card">

        <h4>WELCOME</h4>

        <h1>Choose Your Role</h1>

          <p>
          Continue as
        </p>

        <div className="role-buttons">

          <button className="role-btn" onClick={() => selectRole("tenant")}>
            TENANT
          </button>

          <button className="role-btn" onClick={() => selectRole("landlord")}>
            OWNER
          </button>

        </div>

      </div>
         <Footer />
    </div>
  );
}

export default RoleSelection;