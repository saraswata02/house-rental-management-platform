import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/tenantProfile.css";

function TenantProfile() {

    const [editing, setEditing] = useState(false);
    const [showAddress, setShowAddress] = useState(false);

    const [profile, setProfile] = useState({

        name: "Rahul Kumar",

        userId: "TEN0001",

        email: "rahul@gmail.com",

        phone: "9853532907",

        dob: "2002-08-12",

        gender: "Male",

        street: "",

        area: "",

        district: "",

        city: "",

        state: "",

        pincode: ""

    });

    const handleChange = (e) => {

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };

    return (

        <div className="tenant-profile-page">

            <Navbar />

            <div className="profile-container">

                <h1>My Profile</h1>

                {/* Profile Card */}

                <div className="profile-card">

                    <div className="profile-image-wrapper">

                        <img
                            src="/default-profile.png"
                            alt="Tenant"
                            className="profile-image"
                        />

                        <button className="camera-btn">

                            📷

                        </button>

                    </div>

                    <h2>{profile.name}</h2>

                    <p className="verified">

                        ✔ Verified Tenant

                    </p>

                </div>

                {/* Basic Information */}

                <div className="info-card">

                    <h2>Basic Information</h2>

                    <div className="form-grid">

                        <div>

                            <label>Full Name</label>

                            <input

                                name="name"

                                value={profile.name}

                                disabled={!editing}

                                onChange={handleChange}

                            />

                        </div>

                        <div>

                            <label>User ID</label>

                            <input

                                value={profile.userId}

                                disabled

                            />

                        </div>

                        <div>

                            <label>Email</label>

                            <input

                                value={profile.email}

                                disabled

                            />

                        </div>

                        <div>

                            <label>Phone</label>

                            <input

                                name="phone"

                                value={profile.phone}

                                disabled={!editing}

                                onChange={handleChange}

                            />

                        </div>

                        <div>

                            <label>Date of Birth</label>

                            <input

                                type="date"

                                name="dob"

                                value={profile.dob}

                                disabled={!editing}

                                onChange={handleChange}

                            />

                        </div>

                        <div>

                            <label>Gender</label>

                            <select

                                name="gender"

                                value={profile.gender}

                                disabled={!editing}

                                onChange={handleChange}

                            >

                                <option>Male</option>

                                <option>Female</option>

                                <option>Other</option>

                            </select>

                        </div>

                    </div>

                </div>

                {/* Address */}

                <div className="info-card">

                    <h2>Address</h2>

                    {!showAddress ? (

                        <button

                            className="edit-btn"

                            onClick={() => {

                                setShowAddress(true);

                                setEditing(true);

                            }}

                        >

                            {profile.street === "" ? "+ Add Address" : "Edit Address"}

                        </button>

                    ) : (

                        <>

                            <div className="form-grid">

                                <input

                                    placeholder="House No / Street"

                                    name="street"

                                    value={profile.street}

                                    disabled={!editing}

                                    onChange={handleChange}

                                />

                                <input

                                    placeholder="Area"

                                    name="area"

                                    value={profile.area}

                                    disabled={!editing}

                                    onChange={handleChange}

                                />

                                <input

                                    placeholder="District"

                                    name="district"

                                    value={profile.district}

                                    disabled={!editing}

                                    onChange={handleChange}

                                />

                                <input

                                    placeholder="City"

                                    name="city"

                                    value={profile.city}

                                    disabled={!editing}

                                    onChange={handleChange}

                                />

                                <input

                                    placeholder="State"

                                    name="state"

                                    value={profile.state}

                                    disabled={!editing}

                                    onChange={handleChange}

                                />

                                <input

                                    placeholder="PIN Code"

                                    name="pincode"

                                    value={profile.pincode}

                                    disabled={!editing}

                                    onChange={handleChange}

                                />

                            </div>

                            <div className="profile-buttons">

                                <button

                                    className="save-btn"

                                    onClick={() => {

                                        setEditing(false);

                                    }}

                                >

                                    Save Address

                                </button>

                            </div>

                        </>

                    )}

                </div>

                {/* Profile Buttons */}

                <div className="profile-buttons">

                    {

                        editing ?

                            <>

                                <button

                                    className="save-btn"

                                    onClick={() => setEditing(false)}

                                >

                                    Save Changes

                                </button>

                                <button

                                    className="cancel-btn"

                                    onClick={() => setEditing(false)}

                                >

                                    Cancel

                                </button>

                            </>

                            :

                            <button

                                className="edit-btn"

                                onClick={() => setEditing(true)}

                            >

                                Edit Profile

                            </button>

                    }

                </div>

            </div>

            <Footer />

        </div>

    );

}

export default TenantProfile;