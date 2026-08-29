import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/tenantProfile.css";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";

function TenantProfile() {
  const [editing, setEditing] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [profilePic, setProfilePic] = useState("/default-profile.png");
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "", userId: "", email: "", phone: "",
    dob: "", gender: "",
    street: "", area: "", district: "", city: "", state: "", pincode: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setProfile({
          name: `${data.firstName} ${data.lastName}`,
          userId: data.userId,
          email: data.email,
          phone: data.phone || "",
          dob: data.dob || "",
          gender: data.gender || "",
          street: data.address?.street || "",
          area: data.address?.area || "",
          district: data.address?.district || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          pincode: data.address?.pincode || "",
        });
        if (data.profilePicture) {
          setProfilePic(
            data.profilePicture.startsWith("/uploads")
              ? BACKEND_URL + data.profilePicture
              : data.profilePicture
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      setSaving(true);
      const [firstName, ...rest] = profile.name.split(" ");
      await api.put("/users/profile", {
        firstName,
        lastName: rest.join(" "),
        phone: profile.phone,
        dob: profile.dob,
        gender: profile.gender,
        address: {
          street: profile.street,
          area: profile.area,
          district: profile.district,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
        },
      });
      setEditing(false);
    } catch (err) {
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingPic(true);
      const formData = new FormData();
      formData.append("profilePicture", file);
      const { data } = await api.post("/users/profile/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePic(BACKEND_URL + data.profilePicture);
    } catch (err) {
      alert("Failed to upload profile picture.");
    } finally {
      setUploadingPic(false);
    }
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading profile...</div>;

  return (
    <div className="tenant-profile-page">
      <Navbar />
      <div className="profile-container">
        <h1>My Profile</h1>
        <div className="profile-card">
          <div className="profile-image-wrapper">
            <img src={profilePic} alt="Tenant" className="profile-image" />
            <button
              className="camera-btn"
              title={uploadingPic ? "Uploading..." : "Change profile picture"}
              onClick={() => fileInputRef.current.click()}
              disabled={uploadingPic}
            >
              {uploadingPic ? "⏳" : "📷"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfilePicture}
            />
          </div>
          <h2>{profile.name}</h2>
          <p className="verified">✔ Verified Tenant</p>
        </div>

        <div className="info-card">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div><label>Full Name</label><input name="name" value={profile.name} disabled={!editing} onChange={handleChange} /></div>
            <div><label>User ID</label><input value={profile.userId} disabled /></div>
            <div><label>Email</label><input value={profile.email} disabled /></div>
            <div><label>Phone</label><input name="phone" value={profile.phone} disabled={!editing} onChange={handleChange} /></div>
            <div><label>Date of Birth</label><input type="date" name="dob" value={profile.dob} disabled={!editing} onChange={handleChange} /></div>
            <div>
              <label>Gender</label>
              <select name="gender" value={profile.gender} disabled={!editing} onChange={handleChange}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h2>Address</h2>
          {!showAddress ? (
            <button className="edit-btn" onClick={() => { setShowAddress(true); setEditing(true); }}>
              {profile.street === "" ? "+ Add Address" : "Edit Address"}
            </button>
          ) : (
            <>
              <div className="form-grid">
                {["street", "area", "district", "city", "state", "pincode"].map((field) => (
                  <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} name={field} value={profile[field]} disabled={!editing} onChange={handleChange} />
                ))}
              </div>
              <div className="profile-buttons">
                <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Address"}</button>
              </div>
            </>
          )}
        </div>

        <div className="profile-buttons">
          {editing ? (
            <>
              <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TenantProfile;