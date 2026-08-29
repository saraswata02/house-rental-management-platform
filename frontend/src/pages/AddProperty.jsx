import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useState } from "react";
import "../styles/addProperty.css";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function AddProperty() {
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    location: "",
    rent: "",
    bhk: "1 BHK",
    propertyType: "Apartment",
    bathrooms: "1",
    amenities: "",
    description: "",
  });

  const AMENITY_OPTIONS = ["Parking", "Lift", "Wi-Fi", "Air Conditioning", "Power Backup", "Security", "Garden", "Gym"];
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleImageUpload = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviewImages(selected.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.rent || !form.description) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      // Append non-amenity fields
      Object.entries(form).forEach(([key, val]) => {
        if (key !== 'amenities') formData.append(key, val);
      });
      // Append amenities individually
      selectedAmenities.forEach((a) => formData.append("amenities", a));
      files.forEach((file) => formData.append("images", file));

      await api.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/owner-properties");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-page">
      <OwnerNavbar />
      <div className="add-property-container">
        <h1>Add New Property</h1>
        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

        <form className="property-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Property Title</label>
            <input type="text" name="title" placeholder="Luxury Apartment" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" placeholder="Bhubaneswar" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Monthly Rent (₹)</label>
            <input type="number" name="rent" placeholder="18000" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Property Type</label>
            <select name="propertyType" onChange={handleChange}>
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Studio</option>
            </select>
          </div>

          <div className="form-group">
            <label>BHK</label>
            <select name="bhk" onChange={handleChange}>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4 BHK</option>
            </select>
          </div>

          <div className="form-group">
            <label>Bathrooms</label>
            <input type="number" name="bathrooms" placeholder="1" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
              {AMENITY_OPTIONS.map((a) => (
                <label key={a} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={() => handleAmenityToggle(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="5" placeholder="Describe your property..." onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Upload Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            <div className="preview-container">
              {previewImages.map((image, index) => (
                <img key={index} src={image} alt="Preview" className="preview-image" />
              ))}
            </div>
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={() => window.history.back()}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Publishing..." : "Publish Property"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default AddProperty;