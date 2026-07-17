import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AuthNavbar from "../components/AuthNavbar";
import "../styles/roleSelection.css";


function RoleSelection() {
  const navigate = useNavigate();

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

          <button className="role-btn" onClick={() => navigate("/tenant-dashboard")}>
            TENANT
          </button>

          <button className="role-btn" onClick={() => navigate("/owner-dashboard")}>
            OWNER
          </button>

        </div>

      </div>
         <Footer />
    </div>
  );
}

export default RoleSelection;