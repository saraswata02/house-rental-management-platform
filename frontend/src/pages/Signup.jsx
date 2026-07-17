import { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";
import AuthNavbar from "../components/AuthNavbar";

function Signup() {

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (

    <div className="signup-page">
      <AuthNavbar />
      <div className="signup-card">

        {step === 1 ? (

          <>
            <h4>WELCOME</h4>

            <h1>Signup</h1>

            <p>Create your account to continue.</p>

            <div className="name-row">

              <input type="text" placeholder="First Name"/>

              <input type="text" placeholder="Middle Name"/>

          </div>

            <input
              type="text"
              placeholder="Last Name"
            />

            <input
              type="text"
              placeholder="Phone Number"
            />

            <input
              type="email"
              placeholder="Email ID"
            />

            <select>
              <option>Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              type="date"
            />

            <button
              className="next-btn"
              onClick={() => setStep(2)}
            >
              Next
            </button>

          </>

        ) : (

          <>
            <h4>CREATE YOUR PROFILE</h4>

            <h1>Signup</h1>

            <p>Now create your User ID and password.</p>

            <input
              type="text"
              placeholder="Create User ID"
            />

            <input
              type="password"
              placeholder="Create Password"
            />

            <input
              type="password"
              placeholder="Confirm Password"
            />

            <div className="button-row">

              <button
                className="back-btn"
                onClick={() => setStep(1)}
              >
                Back
              </button>

              <button
                className="create-btn"
                onClick={() => navigate("/role")}
              >
                Create Account
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