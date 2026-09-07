import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/home.css";


function Home() {
  return (
    <div className="home">
      

      <div className="overlay">

        <div className="auth-navbar">
          <h2>SMARTRENT-AI</h2>
        </div>

        <div className="hero">

          <h1>
            Find Your Next
            <br />
            Rental Home
          </h1>

          <p>
            A smart rental platform for tenants and owners
          </p>

          <div className="buttons">

            <Link to="/login">
              <button className="btn">Login</button>
            </Link>

            <Link to="/signup">
              <button className="btn">Signup</button>
            </Link>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}

export default Home;