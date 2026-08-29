import { useEffect, useState } from "react";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/editProperty.css";
import api from "../utils/api";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "", location: "", rent: "", bhk: "1 BHK", description: "",
    availabilityStatus: "available", propertyType: "Apartment", bathrooms: 1, amenities: ""
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setForm({
          title: data.title, location: data.location, rent: data.rent, bhk: data.bhk,
          description: data.description, availabilityStatus: data.availabilityStatus || "available",
          propertyType: data.propertyType || "Apartment", bathrooms: data.bathrooms || 1,
          amenities: (data.amenities || []).join(", "),
        });
        setPreviewImages(data.images || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviewImages(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      const formData = new FormData();
      // Append all fields except amenities
      Object.entries(form).forEach(([key, val]) => {
        if (key !== 'amenities') formData.append(key, val);
      });
      // Amenities: split comma-string into individual entries for multer
      form.amenities.split(',').map(a => a.trim()).filter(Boolean).forEach(a => formData.append('amenities', a));
      files.forEach((file) => formData.append("images", file));
      await api.put(`/properties/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/owner-properties");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading property...</div>;

  return (
    <div className="add-property-page">
      <OwnerNavbar />
      <div className="add-property-container">
        <h1>Edit Property</h1>
        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

        <form className="property-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Property Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Monthly Rent (₹)</label>
            <input type="number" name="rent" value={form.rent} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>BHK</label>
            <select name="bhk" value={form.bhk} onChange={handleChange}>
              <option>1 BHK</option><option>2 BHK</option><option>3 BHK</option><option>4 BHK</option>
            </select>
          </div>
          <div className="form-group">
            <label>Property Type</label>
            <select name="propertyType" value={form.propertyType} onChange={handleChange}>
              <option>Apartment</option><option>House</option><option>Studio</option>
            </select>
          </div>
          <div className="form-group">
            <label>Bathrooms</label>
            <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Amenities (comma separated)</label>
            <input type="text" name="amenities" value={form.amenities} onChange={handleChange} placeholder="e.g. WiFi, Parking, Gym" />
          </div>
          <div className="form-group">
            <label>Availability Status</label>
            <select name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange}>
              <option value="available">✅ Available</option>
              <option value="occupied">🔴 Occupied</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="5" value={form.description} onChange={handleChange} />
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
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default EditProperty;