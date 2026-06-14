// import React, { useState, useEffect } from "react";
// import "./photoSection.css";
// import PhotoUpload from "./PhotoUpload";
// import Masonry from "react-masonry-css";
// import Lightbox from "yet-another-react-lightbox";
// import "yet-another-react-lightbox/styles.css";

//   // const initialImages = [
//   //   "https://ik.imagekit.io/aryans/photos/pump-check?updatedAt=1761156311549",
//   //   "https://ik.imagekit.io/aryans/photos/Mommyyy.PNG?updatedAt=1761157348412",
//   //   "https://ik.imagekit.io/aryans/photos/Vihaan-Mac.jpg?updatedAt=1761157348308",
//   //   "https://ik.imagekit.io/aryans/photos/Mac.JPG?updatedAt=1761157347847",
//   //   "https://ik.imagekit.io/aryans/photos/P-M.jpg?updatedAt=1761157347815",
//   //   "https://ik.imagekit.io/aryans/photos/Vihaan.JPG?updatedAt=1761157347776"
//   // ];
  
//   // const shuffledImages = [...initialImages].sort(() => 0.5 - Math.random());

//   const breakpointColumnsObj = {
//     default: 6, // Desktop - 6 columns
//     1600: 5,    // Large laptops
//     1200: 4,    // Normal laptops
//     992: 3,     // Tablets
//     768: 2,     // Small tablets
//     500: 2      // Mobiles
//   };

// const Photo = () => {
//   const [images, setImages] = useState([]);
//   const [skip, setSkip] = useState(0);
//   const limit = 10;
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [photoIndex, setPhotoIndex] = useState(0);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const res = await fetch("/api/list");
//         const data = await res.json();
//         const urls = data.map((file) => file.url);
//         setImages(urls); // show latest first
//       } catch (error) {
//         console.error("Error fetching images:", error);
//       }
//     };

//     fetchImages();
//   }, []);
  
//   const handleNewUpload = (url) => {
//     setImages(prev => [url, ...prev]); // add new image to the top
//   };

//     return (
//       <div>
//       {/* Upload Section */}
//       <PhotoUpload onUpload={handleNewUpload} />

//       {/* Gallery */}
//         <Masonry
//       breakpointCols={breakpointColumnsObj}
//       className="gallery-masonry"
//       columnClassName="gallery-column"
//     >
//       {images.map((src, idx) => {

//         const match = src.match(/media\/(.*?)\./);
//         {/* const fileName = src.split("/").pop().split(".")[0]; */}
//         /* const fileName = match ? `${match[1]}` : "Image"; */

//         return (
//         <div key={idx} className="gallery-item">
//           <img
//             src={src}
//             alt={`gallery-img-${idx}`}
//             loading="lazy"
//             className="gallery-image"
//             onClick={() => {
//                 setPhotoIndex(idx);
//                 setOpen(true);
//               }}
//           />
//           {/* <div className='fileName'>{fileName}</div> */}
//         </div>
//         );
//       })}
//     </Masonry>
//       {open && (
//         <Lightbox
//           open={open}
//           close={() => setOpen(false)}
//           index={photoIndex}
//           slides={images.map((img) => ({ src: img.url || img }))}
//           carousel={{ finite: false }}
//         />
//       )}
//     </div>
//     )
// }

// export default Photo;

// -----------------

import React, { useState, useEffect, useCallback } from "react";
import "./photoSection.css";
import PhotoUpload from "./PhotoUpload";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import BottomNavbar from "../BottomNavbar/BottomNavbar";

const breakpointColumnsObj = {
  default: 6,
  1600: 5,
  1200: 4,
  992: 3,
  768: 2,
  500: 2
};

const Photo = () => {
  const [images, setImages] = useState([]);
  const [skip, setSkip] = useState(0);
  const limit = 5; // Using this to limit the number of images that load up at once.
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const loadImages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      // const res = await fetch(`/api/list?skip=${skip}&limit=${limit}`);
      const res = await fetch(`https://iaryan.vercel.app/api/list?skip=${skip}&limit=${limit}`);
      // const res = await fetch("https://iaryan.vercel.app/api/list?skip=0&limit=5");
      const data = await res.json();

      if (!data.length) {
        setHasMore(false);
        setLoading(false);
        return;
      }

    const urls = data.map((file) =>
  file.url.replace("/aryans/", "/aryans/tr:w-600,q-70/")
);

      setImages((prev) => [...prev, ...urls]);
      setSkip((prev) => prev + limit);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching images", err);
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadImages();
  }, []);

//   useEffect(() => {
//   fetch("https://jsonplaceholder.typicode.com/posts/1")
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("TEST FETCH SUCCESS:", data);
//     })
//     .catch((err) => {
//       console.error("TEST FETCH FAILED:", err);
//     });
// }, []);

  const handleNewUpload = (url) => {
    setImages((prev) => [url, ...prev]);
  };

  return (
    <div>
      <PhotoUpload onUpload={handleNewUpload} />

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="gallery-masonry"
        columnClassName="gallery-column"
      >
        {images.map((src, idx) => (
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
          </div>
        ))}

        {/* Skeletons (match aspect ratio using random heights) */}
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="skeleton skeleton-matched"
              style={{
                height: `${200 + (i % 5) * 40}px` // mimic random aspect ratios
              }}
            ></div>
          ))}
      </Masonry>

      {/* Load More button with micro animation */}
      {hasMore && (
        <button
          className={`load-more-btn ${!loading ? "bounce" : ""}`}
          onClick={loadImages}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More ↓"}
        </button>
      )}

      {/* <BottomNavbar /> */}

      {!hasMore && (
        <p style={{ textAlign: "center", margin: "20px 0", color: "#777" }}>
          🍆 No more images to load 🍆
        </p>
      )}

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={photoIndex}
          slides={images.map((img) => ({ src: img }))}
        />
      )}
    </div>
  );
};

export default Photo;
