import { useState } from "react";
import Footer from "../components/Footer";
import AuthNavbar from "../components/AuthNavbar";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import api from "../utils/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data));
      if (data.role === "landlord") {
        navigate("/owner-dashboard");
      } else {
        navigate("/tenant-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <AuthNavbar />

      <div className="login-card">
        <h4>WELCOME BACK</h4>
        <h1>Login</h1>
        <p>Enter your account details to continue.</p>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="divider">Or login with</div>

        <div className="social-buttons">
          <button className="google">Google</button>
          <button className="facebook">Facebook</button>
          <button className="phone">Phone</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;