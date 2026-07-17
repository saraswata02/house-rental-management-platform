import Footer from "../components/Footer";
import AuthNavbar from "../components/AuthNavbar";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <AuthNavbar />

      <div className="login-card">

       <h4>WELCOME BACK</h4>
       
        <h1>Login</h1>
         
        <p>Enter your account details to continue.</p>

        <input type="email" placeholder="Email ID"/>

        <input type="text" placeholder="User ID"/>

        <input type="password" placeholder="Password"/>

        <button className="login-btn" onClick={() => navigate("/role")}>
          Login
        </button>

        <div className="divider">Or login with</div>

        <div className="social-buttons">

          <button className="google">
            Google
          </button>

          <button className="facebook">
            Facebook
          </button>

          <button className="phone">
            Phone
          </button>

        </div>

      </div>
        <Footer />
    </div>
  );
}

export default Login;