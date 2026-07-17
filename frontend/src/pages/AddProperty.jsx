import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useState } from "react";
import "../styles/addProperty.css";

function AddProperty() {
    const [previewImages,setPreviewImages]=useState([]);

const handleImageUpload=(e)=>{

    const files=Array.from(e.target.files);

    const imageUrls=files.map(file=>

        URL.createObjectURL(file)

    );

    setPreviewImages(imageUrls);

};
    return (

        <div className="add-property-page">

            <OwnerNavbar />

            <div className="add-property-container">

                <h1>Add New Property</h1>

                <form className="property-form">

                    <div className="form-group">
                        <label>Property Title</label>
                        <input
                            type="text"
                            placeholder="Luxury Apartment"
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            placeholder="Bhubaneswar"
                        />
                    </div>

                    <div className="form-group">
                        <label>Monthly Rent</label>
                        <input
                            type="number"
                            placeholder="18000"
                        />
                    </div>

                    <div className="form-group">
                        <label>BHK</label>

                        <select>

                            <option>1 BHK</option>
                            <option>2 BHK</option>
                            <option>3 BHK</option>
                            <option>4 BHK</option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            rows="5"
                            placeholder="Describe your property..."
                        />

                    </div>

                    <div className="form-group">

                        <label>Upload Images</label>

                        <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleImageUpload}
/>

<div className="preview-container">

    {previewImages.map((image,index)=>(

        <img
            key={index}
            src={image}
            alt="Preview"
            className="preview-image"
        />

    ))}

</div>

                    </div>

                   <div className="form-buttons">

    <button
        type="button"
        className="cancel-btn"
        onClick={() => window.history.back()}
    >
        Cancel
    </button>

    <button
        type="submit"
        className="submit-btn"
    >
        Publish Property
    </button>

</div>

                </form>

            </div>

            <Footer />

        </div>

    );

}

export default AddProperty;