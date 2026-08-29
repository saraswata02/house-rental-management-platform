import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function getImageSrc(img) {
  if (!img) return null;
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

// ImageGallery — shows a main image with thumbnail strip below it
function ImageGallery({ images = [], title = "Property" }) {
  const [selected, setSelected] = useState(0);

  if (!images.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <img
        src={getImageSrc(images[selected]) || "/houses/default.jpeg"}
        alt={title}
        style={{ width: "100%", height: "320px", objectFit: "cover", borderRadius: "12px" }}
      />
      {images.length > 1 && (
        <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
          {images.map((img, i) => (
            <img
              key={i}
              src={getImageSrc(img) || "/houses/default.jpeg"}
              alt={`${title} ${i + 1}`}
              onClick={() => setSelected(i)}
              style={{
                width: "80px", height: "60px", objectFit: "cover",
                borderRadius: "6px", cursor: "pointer",
                border: i === selected ? "2px solid #2563eb" : "2px solid transparent",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
