import { useEffect, useState } from "react";
import "../styles/heroSlider.css";

const slides = [
  {
    image: "/slider/UxHusp.webp",
    title: "Find Your Dream Home",
    subtitle: "AI recommends the best rentals just for you."
  },
  {
    image: "/slider/architecture-beautiful-exterior-family-house.jpg",
    title: "Luxury Villas",
    subtitle: "Premium homes with verified owners."
  },
  {
    image: "/slider/743533-2560x1600-desktop-hd-house-background-photo.jpg",
    title: "Affordable Apartments",
    subtitle: "Starting from ₹8,000/month."
  },
  {
    image: "/slider/1920_1200-3d-house-wallpaper-architecture-other.jpg",
    title: "Student Friendly Rentals",
    subtitle: "Near colleges and universities."
  }
];

function HeroSlider() {

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrent((prev) => (prev + 1) % slides.length);

        }, 4000);

        return () => clearInterval(interval);

    }, []);

    return (

        <section className="hero-slider">

            <img
                src={slides[current].image}
                alt=""
                className="slider-image"
            />

            <div className="slider-overlay">

                <h1>{slides[current].title}</h1>

                <p>{slides[current].subtitle}</p>

                <button>Explore Now</button>

            </div>

            <div className="slider-dots">

                {slides.map((_, index) => (

                    <span

                        key={index}

                        className={
                            current === index
                                ? "dot active"
                                : "dot"
                        }

                    />

                ))}

            </div>

        </section>

    );

}

export default HeroSlider;