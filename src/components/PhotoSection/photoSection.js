import React, { useState, useEffect } from "react";
import "./photoSection.css";
import PhotoUpload from "./PhotoUpload";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

  // const initialImages = [
  //   "https://ik.imagekit.io/aryans/photos/pump-check?updatedAt=1761156311549",
  //   "https://ik.imagekit.io/aryans/photos/Mommyyy.PNG?updatedAt=1761157348412",
  //   "https://ik.imagekit.io/aryans/photos/Vihaan-Mac.jpg?updatedAt=1761157348308",
  //   "https://ik.imagekit.io/aryans/photos/Mac.JPG?updatedAt=1761157347847",
  //   "https://ik.imagekit.io/aryans/photos/P-M.jpg?updatedAt=1761157347815",
  //   "https://ik.imagekit.io/aryans/photos/Vihaan.JPG?updatedAt=1761157347776"
  // ];
  
  // const shuffledImages = [...initialImages].sort(() => 0.5 - Math.random());

  const breakpointColumnsObj = {
    default: 6, // Desktop - 6 columns
    1600: 5,    // Large laptops
    1200: 4,    // Normal laptops
    992: 3,     // Tablets
    768: 2,     // Small tablets
    500: 2      // Mobiles
  };

const Photo = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/list");
        const data = await res.json();
        const urls = data.map((file) => file.url);
        setImages(urls); // show latest first
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);
  
  const handleNewUpload = (url) => {
    setImages(prev => [url, ...prev]); // add new image to the top
  };

    return (
      <div>
      {/* Upload Section */}
      <PhotoUpload onUpload={handleNewUpload} />

      {/* Gallery */}
        <Masonry
      breakpointCols={breakpointColumnsObj}
      className="gallery-masonry"
      columnClassName="gallery-column"
    >
      {images.map((src, idx) => {

        const match = src.match(/media\/(.*?)\./);
        const fileName = src.split("/").pop().split(".")[0];
        /* const fileName = match ? `${match[1]}` : "Image"; */

        return (
        <div key={idx} className="gallery-item">
          <img
            src={src}
            alt={`gallery-img-${idx}`}
            loading="lazy"
            className="gallery-image"
            onClick={() => {
                setPhotoIndex(idx);
                setOpen(true);
              }}
          />
          <div className='fileName'>{fileName}</div>
        </div>
        );
      })}
    </Masonry>
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={photoIndex}
          slides={images.map((img) => ({ src: img.url || img }))}
          carousel={{ finite: false }}
        />
      )}
    </div>
    )
}

export default Photo;