import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import AuthNavbar from "../components/AuthNavbar";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import api from "../utils/api";
import { FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/social-login", {
        provider: 'google',
        accessToken: tokenResponse.access_token
      });
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/role-selection"); // Or directly to dashboard if already onboarded
    } catch (err) {
      setError(err.response?.data?.message || "Google Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google Login Failed")
  });

  useEffect(() => {
    if (!error) return undefined;

    const timeoutId = window.setTimeout(() => {
      setError("");
    }, 12000);

    return () => window.clearTimeout(timeoutId);
  }, [error]);

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
      navigate("/role-selection");
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

        <div className="login-divider">
          <span>OR</span>
        </div>

        <div className="social-auth-buttons">
          <button className="social-btn google-btn" onClick={() => loginGoogle()}>
            <FaGoogle /> Google
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;