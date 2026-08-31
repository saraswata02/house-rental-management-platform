import PropertyCard from "./PropertyCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function getImageSrc(img) {
  if (!img) return "/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg";
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

// SimilarProperties — shows a row of similar listings based on BHK/location
function SimilarProperties({ properties = [], currentId }) {

  const similar = properties
    .filter((p) => p._id !== currentId)
    .slice(0, 3);

  if (!similar.length) return null;

  return (
    <section style={{ marginTop: "32px" }}>
      <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: 700 }}>Similar Properties</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {similar.map((p) => (
          <PropertyCard
            key={p._id}
            id={p._id}
            image={getImageSrc(p.images?.[0])}
            title={p.title}
            location={p.location}
            rent={p.rent?.toLocaleString("en-IN")}
            bhk={p.bhk}
            rating={p.rating}
          />
        ))}
      </div>
    </section>
  );
}

export default SimilarProperties;
