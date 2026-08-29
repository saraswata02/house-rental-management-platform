import "../styles/propertyFilter.css";

function PropertyFilter({ onFilter }) {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onFilter(name, type === "checkbox" ? checked : value);
    };

    return (
        <section className="property-filter">
            <h2>🔎 Filters</h2>

            <input
                type="text"
                name="location"
                placeholder="Search location..."
                onChange={handleChange}
            />

            <select name="bhk" onChange={handleChange}>
                <option value="">BHK (All)</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
            </select>

            <select name="budget" onChange={handleChange}>
                <option value="">Budget (All)</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-20000">₹10,000 - ₹20,000</option>
                <option value="20000-40000">₹20,000 - ₹40,000</option>
                <option value="40000-999999">₹40,000+</option>
            </select>

            <select name="availabilityStatus" onChange={handleChange}>
                <option value="">Availability (All)</option>
                <option value="available">Available Now</option>
                <option value="occupied">Occupied</option>
            </select>

        </section>
    );
}

export default PropertyFilter;