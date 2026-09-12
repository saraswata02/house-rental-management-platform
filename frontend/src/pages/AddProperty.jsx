import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import "../styles/addProperty.css";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import SubscriptionModal from "../components/SubscriptionModal";

function AddProperty() {
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    state: "",
    district: "",
    city: "",
    location: "",
    preferredLifestyle: "Family",
    rent: "",
    bhk: "1 BHK",
    propertyType: "Apartment",
    bathrooms: "1",
    amenities: "",
    description: "",
  });

  // Available Visit Dates management
  const [availableDates, setAvailableDates] = useState([]);
  const [dateInput, setDateInput] = useState("");
  const [showSubModal, setShowSubModal] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // MOCK FOR TESTING: Always start as 'free' so Pro mode resets on refresh
    setIsPro(false);
    
    // const user = JSON.parse(localStorage.getItem("user") || "{}");
    // setIsPro(user.subscriptionPlan === "pro");
  }, []);

  const AMENITY_OPTIONS = ["Parking", "Lift", "Wi-Fi", "Air Conditioning", "Power Backup", "Security", "Garden", "Gym"];
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddDate = () => {
    if (!dateInput) return;
    if (availableDates.includes(dateInput)) {
      setError("This visit date has already been added.");
      return;
    }
    // Subscription limit check: 3 dates free
    if (!isPro && availableDates.length >= 3) {
      setShowSubModal(true);
      return;
    }

    setAvailableDates([...availableDates, dateInput]);
    setDateInput("");
    setError("");
  };

  const handleRemoveDate = (dateToRemove) => {
    setAvailableDates(availableDates.filter((d) => d !== dateToRemove));
  };

  const handleImageUpload = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviewImages(selected.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.state || !form.district || !form.city || !form.location || !form.preferredLifestyle || !form.rent || !form.description) {
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
      // Append availableDates JSON
      formData.append("availableDates", JSON.stringify(availableDates));
      files.forEach((file) => formData.append("images", file));

      await api.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/owner-properties");
    } catch (err) {
      if (err.response?.data?.requiresSubscription) {
        setShowSubModal(true);
      }
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
            <input type="text" name="title" placeholder="Luxury Apartment" onChange={handleChange} required />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>State</label>
              <input type="text" name="state" placeholder="Odisha" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>District</label>
              <input type="text" name="district" placeholder="Khordha" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" placeholder="Bhubaneswar" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Location / Area</label>
              <input type="text" name="location" placeholder="Patia, Khandagiri" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Preferred Lifestyle</label>
            <select name="preferredLifestyle" value={form.preferredLifestyle} onChange={handleChange}>
              <option value="Family">Family</option>
              <option value="Student">Student</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Working Professional">Working Professional</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monthly Rent (₹)</label>
            <input type="number" name="rent" placeholder="18000" onChange={handleChange} required />
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

          {/* Available Visit Dates with 3-Date Free Tier Limit & Subscription */}
          <div className="form-group" style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontWeight: "700", margin: 0 }}>📅 Available Visit Dates for Tenants</label>
              <div style={{ fontSize: "12px" }}>
                {isPro ? (
                  <span style={{ background: "#fef3c7", color: "#b45309", padding: "3px 8px", borderRadius: "6px", fontWeight: "700" }}>
                    ⭐ Pro (Unlimited Dates)
                  </span>
                ) : (
                  <span style={{ color: availableDates.length >= 3 ? "#b45309" : "#64748b", fontWeight: "600" }}>
                    Free Limit: {availableDates.length}/3 dates used
                    {availableDates.length >= 3 && (
                      <button
                        type="button"
                        onClick={() => setShowSubModal(true)}
                        style={{ marginLeft: "8px", background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: "700", textDecoration: "underline" }}
                      >
                        Upgrade to Pro
                      </button>
                    )}
                  </span>
                )}
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px 0" }}>
              Select specific dates when you are available for tenants to schedule a house visit. Tenants will choose from these dates.
            </p>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={{ maxWidth: "220px" }}
              />
              <button
                type="button"
                onClick={handleAddDate}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                + Add Date
              </button>
            </div>

            {availableDates.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {availableDates.map((date) => (
                  <span
                    key={date}
                    style={{
                      background: "#eff6ff",
                      color: "#1e40af",
                      border: "1px solid #bfdbfe",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    📅 {date}
                    <button
                      type="button"
                      onClick={() => handleRemoveDate(date)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "14px",
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
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
            <textarea name="description" rows="5" placeholder="Describe your property..." onChange={handleChange} required />
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

      <SubscriptionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onUpgraded={() => {
          setIsPro(true);
          if (dateInput && !availableDates.includes(dateInput)) {
            setAvailableDates([...availableDates, dateInput]);
            setDateInput("");
          }
        }}
      />
      <Footer />
    </div>
  );
}

export default AddProperty;