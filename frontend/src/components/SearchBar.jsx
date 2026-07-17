import { useNavigate } from "react-router-dom";
import "../styles/searchBar.css";

function SearchBar() {
    const navigate = useNavigate();

    return (

        <section className="search-container">

            <div className="search-box">

                <select className="state-select">
                    <option>State</option>
                </select>

                <select className="district-select">
                    <option>District</option>
                </select>

                <select className="city-select">
                    <option>City</option>
                </select>

                <input
                    type="text"
                    placeholder="🔍 Area / Locality"
                    className="area-input"
                />

                <button className="search-btn"
                onClick={() => navigate("/properties")}> 
                    🔍 Search
                </button>

            </div>

        </section>

    );

}

export default SearchBar;