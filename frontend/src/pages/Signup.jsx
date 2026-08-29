import { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";
import AuthNavbar from "../components/AuthNavbar";
import api from "../utils/api";

function Signup() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    dob: "",
    userId: "",
    password: "",
    confirmPassword: "",
    role: "tenant",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/register", {
        firstName: form.firstName,
        lastName: [form.middleName, form.lastName].filter(Boolean).join(' ') || form.firstName,
        phone: form.phone,
        email: form.email,
        gender: form.gender,
        dob: form.dob,
        password: form.password,
        role: form.role,
      });
      localStorage.setItem("user", JSON.stringify(data));
      // Navigate to correct dashboard based on role
      if (data.role === "landlord") {
        navigate("/owner-dashboard");
      } else {
        navigate("/tenant-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <AuthNavbar />
      <div className="signup-card">
        {step === 1 ? (
          <>
            <h4>WELCOME</h4>
            <h1>Signup</h1>
            <p>Create your account to continue.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="name-row">
              <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
              <input type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} />
            </div>

            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email ID" onChange={handleChange} />

            <select name="gender" onChange={handleChange}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input type="date" name="dob" onChange={handleChange} />

            <button className="next-btn" onClick={() => setStep(2)}>
              Next
            </button>
          </>
        ) : (
          <>
            <h4>CREATE YOUR PROFILE</h4>
            <h1>Signup</h1>
            <p>Now create your password and choose your role.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <select name="role" onChange={handleChange} defaultValue="tenant">
              <option value="tenant">I'm a Tenant (Looking for a house)</option>
              <option value="landlord">I'm a Landlord (I own property)</option>
            </select>

            <input type="password" name="password" placeholder="Create Password" onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

            <div className="button-row">
              <button className="back-btn" onClick={() => setStep(1)}>Back</button>
              <button className="create-btn" onClick={handleCreate} disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Signup;