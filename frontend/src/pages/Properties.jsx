import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyFilter from "../components/PropertyFilter";
import PropertyCard from "../components/PropertyCard";
import "../styles/properties.css";

function Properties(){

    return(

        <div className="properties-page">

            <Navbar/>

            <section className="properties-header">

                <h1>Find Your Perfect Rental</h1>

                <p>
                    Browse thousands of verified rental properties.
                </p>

            </section>

             <div className="properties-layout">

            <PropertyFilter/>
              <div className="properties-content">

            <section className="result-header">

    <div>
<h2>Explore Rental Properties</h2>

<p>
    Browse verified rental homes across Odisha.
</p>

    </div>

    <select className="sort-select">

        <option>Sort By</option>

        <option>Newest First</option>

        <option>Price: Low to High</option>

        <option>Price: High to Low</option>

        <option>Highest AI Match</option>

        <option>Highest Rating</option>

    </select>

</section>

            <section className="property-list">

                 <PropertyCard
            id={1}
            image="/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg"
            title="Luxury Apartment"
            location="Bhubaneswar"
            rent="18,000"
            bhk="2 BHK"
            rating="4.8"
           
        />

        <PropertyCard
            id={2}
            image="/houses/WhatsApp Image 2026-06-30 at 10.55.15 AM.jpeg"
            title="Modern Villa"
            location="Talcher"
            rent="25,000"
            bhk="3 BHK"
            rating="4.9"
            
        />

        <PropertyCard
            id={3}
            image="/houses/WhatsApp Image 2026-06-30 at 10.54.56 AM.jpeg"
            title="Studio Apartment"
            location="Cuttack"
            rent="12,000"
            bhk="1 BHK"
            rating="4.6"
           
        />

        <PropertyCard
            id={4}
            image="/houses/WhatsApp Image 2026-06-30 at 10.54.53 AM.jpeg"
            title="Family Home"
            location="Angul"
            rent="15,000"
            bhk="2 BHK"
            rating="4.7"
            
        />

        <PropertyCard
            id={5}
            image="/houses/WhatsApp Image 2026-06-30 at 10.54.50 AM.jpeg"
            title="Luxury Duplex"
            location="Puri"
            rent="32,000"
            bhk="4 BHK"
            rating="5.0"
            
        />

        <PropertyCard
            id={6}
            image="/houses/house 6.webp"
            title="Budget Flat"
            location="Sambalpur"
            rent="9,000"
            bhk="1 BHK"
            rating="4.4"
            
        />

            </section>

            </div>

            </div>

            <Footer/>

        </div>

    );

}

export default Properties;