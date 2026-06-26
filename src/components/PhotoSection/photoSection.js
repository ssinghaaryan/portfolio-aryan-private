import React, { useState, useEffect, useCallback } from "react";
import "./photoSection.css";
import PhotoUpload from "./PhotoUpload";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import BottomNavbar from "../BottomNavbar/BottomNavbar";
import { HardDrive, Images, ExternalLink } from "lucide-react";
import { useData } from "../../context/DataContext";

const breakpointColumnsObj = {
  default: 6,
  1600: 5,
  1200: 4,
  992: 3,
  768: 2,
  500: 2
};

const Photo = () => {
  const { photosData, setPhotosData } = useData();
  const [images, setImages] = useState(photosData?.images || []);
  const [skip, setSkip] = useState(photosData?.skip || 0);
  const limit = 5; // Using this to limit the number of images that load up at once.
  const [hasMore, setHasMore] = useState(photosData?.hasMore ?? true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  

  const loadImages = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      // const res = await fetch(`/api/list?skip=${skip}&limit=${limit}`);
      // const res = await fetch(`https://iaryan.vercel.app/api/list?skip=${skip}&limit=${limit}`);
      const res = await fetch(`https://iaryan.vercel.app/api/photos?skip=${skip}&limit=${limit}`);
      // const res = await fetch("https://iaryan.vercel.app/api/list?skip=0&limit=5");
      const data = await res.json();
      if (!data.length) {
        setHasMore(false);
        setPhotosData(prev => ({ ...prev, hasMore: false }));
        setLoading(false);
        return;
      }
    const urls = data.map((file) =>
  file.url.replace("/aryans/", "/aryans/tr:w-600,q-70/")
);
      const newImages = [...images, ...urls];
      const newSkip = skip + limit;
      setImages(newImages);
      setSkip(newSkip);
      setPhotosData({ images: newImages, skip: newSkip, hasMore: true });
      setLoading(false);;
    } catch (err) {
      console.error("Error fetching images", err);
      setLoading(false);
    }
  };

    const loadStats = async () => {
    try {
      // const res = await fetch("https://iaryan.vercel.app/api/photos-stats");
      const res = await fetch("/api/photos?action=stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setStatsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
  if (!photosData) {
    loadImages();
    loadStats();
  }
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
    loadStats(); // refresh stats after upload
  };

  return (
    <div>
      <PhotoUpload onUpload={handleNewUpload} />

      {/* Stats Card */}
<div className="photos-stats-card">
  <div className="stats-row">
    <div className="stat-item">
      <Images size={16} strokeWidth={1.6} />
      <span className="stat-value">
        {statsLoading ? "—" : stats?.totalCount}
      </span>
      <span className="stat-label">Photos</span>
    </div>
    <div className="stat-divider" />
    <div className="stat-item">
      <HardDrive size={16} strokeWidth={1.6} />
      <span className="stat-value">
        {statsLoading ? "—" : `${stats?.totalMB} MB`}
      </span>
      <span className="stat-label">Storage used</span>
    </div>
    <div className="stat-divider" />
    <div className="stat-item">
      <span className="stat-value">20 GB</span>
      <span className="stat-label">Free limit</span>
    </div>
  </div>
  <a
    className="stats-dashboard-link"
    href="https://imagekit.io/dashboard"
    target="_blank"
    rel="noreferrer"
  >
    ImageKit Dashboard <ExternalLink size={12} />
  </a>
</div>

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
