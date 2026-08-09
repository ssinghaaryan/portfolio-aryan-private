import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Music2, Image, BookOpen, Wallet, Lightbulb, Clapperboard, BookMarked, Library } from "lucide-react";
import { useData } from "./context/DataContext";
import "./SectionSelector.css";

import selectorImage1 from "./assets/selector_image_1.jpeg";
import selectorImage2 from "./assets/selector_image_2.jpeg";
import selectorImage3 from "./assets/selector_image_3.jpeg";
import selectorImage4 from "./assets/selector_image_4.jpeg";
import selectorImage5 from "./assets/selector_image_5.jpeg";

const IMAGES = [
  selectorImage1,
  selectorImage2,
  selectorImage3,
  selectorImage4,
  selectorImage5,
];

const sections = [
  { name: "Music", path: "/music", icon: Music2 },
  { name: "Photos", path: "/photos", icon: Image },
  { name: "Notes", path: "/notes", icon: BookOpen },
  { name: "Finance", path: "/finance", icon: Wallet },
  { name: "Ideas", path: "/ideas", icon: Lightbulb },
  { name: "Movies", path: "/movies", icon: Clapperboard },
  { name: "Vault", path: "/vault", icon: BookMarked },
  { name: "Books", path: "/books", icon: Library }
];

const SectionSelector = () => {
  const navigate = useNavigate();
  const { clearAll } = useData();
  const [bgImage] = useState(
    () => IMAGES[Math.floor(Math.random() * IMAGES.length)]
  );

  const handleLogout = () => {
    clearAll();
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
  <div className="selector-container">
    {/* Background image */}
    <div
      className="selector-bg"
      style={{ backgroundImage: `url(${bgImage})` }}
    />

    {/* Header */}
    <div className="selector-header">
      <button className="logout-btn" onClick={handleLogout}>
        Sign out
      </button>
    </div>

    {/* Grid */}
    <div className="selector-grid">
      {sections.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.name}
            className="selector-tile"
            onClick={() => navigate(s.path)}
          >
            <Icon size={22} strokeWidth={1.5} />
            <span className="tile-name">{s.name}</span>
          </div>
        );
      })}
    </div>
  </div>
);
};

export default SectionSelector;