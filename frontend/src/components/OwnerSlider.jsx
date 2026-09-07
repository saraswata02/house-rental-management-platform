import { useEffect, useState } from "react";
import "../styles/ownerSlider.css";

const slides = [

    {
        image: "/owner-slide1.jpg",
        title: "Grow Your Rental Business",
        subtitle: "List your property and connect with verified tenants."
    },

    {
        image: "/owner-slide2.jpg",
        title: "Manage Property Easily",
        subtitle: "Approve visits, manage listings and track bookings."
    },

    {
        image: "/owner-slide3.jpg",
        title: "Track Property Analytics",
        subtitle: "Monitor views, appointments and rental performance."
    }

];

function OwnerSlider() {

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrent((prev) => (prev + 1) % slides.length);

        }, 4000);

        return () => clearInterval(timer);

    }, []);

    return (

        <div className="owner-slider">

            <img
                src={slides[current].image}
                alt=""
                className="owner-slide-image"
            />

            <div className="owner-slide-overlay">

                <h1>{slides[current].title}</h1>

                <p>{slides[current].subtitle}</p>

            </div>

            <div className="slider-dots">

                {

                    slides.map((_, index) => (

                        <span

                            key={index}

                            className={current === index ? "dot active" : "dot"}

                            onClick={() => setCurrent(index)}

                        />

                    ))

                }

            </div>

        </div>

    );

}

export default OwnerSlider;