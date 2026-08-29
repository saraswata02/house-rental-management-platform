import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import "../styles/properties.css";
import PropertyFilter from "../components/PropertyFilter";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";
function getImageSrc(img) {
  if (!img) return "/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg";
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");

  // Filter state — each key matches a backend query param
  const [filters, setFilters] = useState({
    location: "",
    bhk: "",
    budget: "",
    availabilityStatus: "",
  });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (sort) params.sort = sort;
      if (filters.location) params.location = filters.location;
      if (filters.bhk) params.bhk = filters.bhk;
      if (filters.availabilityStatus) params.availabilityStatus = filters.availabilityStatus;
      if (filters.budget) {
        const [min, max] = filters.budget.split("-");
        params.minRent = min;
        params.maxRent = max;
      }
      const { data } = await api.get("/properties", { params });
      setProperties(data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  }, [sort, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 400); // debounce — wait 400ms after last filter change
    return () => clearTimeout(timer);
  }, [fetchProperties]);

  const handleSortChange = (e) => {
    const map = {
      "Newest First": "newest",
      "Price: Low to High": "price_asc",
      "Price: High to Low": "price_desc",
      "Highest Rating": "rating",
    };
    setSort(map[e.target.value] || "");
  };

  const handleFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="properties-page">
      <Navbar />

      <section className="properties-header">
        <h1>Find Your Perfect Rental</h1>
        <p>Browse thousands of verified rental properties.</p>
      </section>

      <div className="properties-layout">
        <PropertyFilter onFilter={handleFilter} />
        <div className="properties-content">
          <section className="result-header">
            <div>
              <h2>Explore Rental Properties</h2>
              <p>Browse verified rental homes across Odisha.</p>
            </div>
            <select className="sort-select" onChange={handleSortChange}>
              <option>Sort By</option>
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rating</option>
            </select>
          </section>

          <section className="property-list">
            {loading ? (
              <p style={{ padding: "20px" }}>Loading properties...</p>
            ) : properties.length === 0 ? (
              <p style={{ padding: "20px" }}>No properties found for the selected filters.</p>
            ) : (
              properties.map((p) => (
                <PropertyCard
                  key={p._id}
                  id={p._id}
                  image={getImageSrc(p.images?.[0])}
                  title={p.title}
                  location={p.location}
                  rent={p.rent.toLocaleString("en-IN")}
                  bhk={p.bhk}
                  rating={p.rating}
                />
              ))
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Properties;