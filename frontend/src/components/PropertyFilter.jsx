import "../styles/propertyFilter.css";

function PropertyFilter(){

    return(

        <section className="property-filter">

            <h2>🔎 Filters</h2>

            <select>
                <option>State</option>
            </select>

            <select>
                <option>District</option>
            </select>

            <select>
                <option>City</option>
            </select>

            <input
                type="text"
                placeholder="Area"
            />

            <select>
                <option>Property Type</option>

                <option>Apartment</option>

                <option>Villa</option>

                <option>Independent House</option>

                <option>Studio</option>

            </select>

            <select>

                <option>BHK</option>

                <option>1 BHK</option>

                <option>2 BHK</option>

                <option>3 BHK</option>

                <option>4 BHK</option>

            </select>

            <select>

                <option>Budget</option>

                <option>₹5,000 - ₹10,000</option>

                <option>₹10,000 - ₹20,000</option>

                <option>₹20,000 - ₹40,000</option>

                <option>₹40,000+</option>

            </select>
            <select>
                <option>Availability</option>
                <option>Available Now</option>
                <option>Within 7 Days</option>
                <option>Within 30 Days</option>
           </select>

           <select>
                <option>Preferred Lifestyle</option>
                <option>👨‍👩‍👧 Family</option>
                <option>🎓 Student</option>
                <option>💼 Working Professional</option>
                <option>🧑 Bachelor</option>
            </select>

<label className="checkbox-option">
    <input type="checkbox"/>
    Furnished
</label>

<label className="checkbox-option">
    <input type="checkbox"/>
    Parking
</label>

<label className="checkbox-option">
    <input type="checkbox"/>
    Verified Owner
</label>

            <label className="checkbox-option">
                <input type="checkbox" />
                Pet Friendly
            </label>


<button className="filter-btn">
    Apply Filters
</button>

        </section>

    );

}

export default PropertyFilter;