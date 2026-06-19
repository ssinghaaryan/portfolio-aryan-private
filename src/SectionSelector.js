import React from "react";
import { useNavigate } from "react-router-dom";
import { Music2, Image, BookOpen, Wallet, Lightbulb, ArrowUpRight } from "lucide-react";
import { useData } from "./context/DataContext";
import "./SectionSelector.css";
import selectorImage from "./assets/selector_image_1.jpeg";

const sections = [
  { name: "Music", path: "/music", icon: Music2 },
  { name: "Photos", path: "/photos", icon: Image },
  { name: "Notes", path: "/notes", icon: BookOpen },
  { name: "Finance", path: "/finance", icon: Wallet },
  { name: "Ideas", path: "/ideas", icon: Lightbulb },
];

const SectionSelector = () => {
  const navigate = useNavigate();
  const { clearAll } = useData();

  const handleLogout = () => {
    clearAll();
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div className="selector-container">

      {/* Header — just sign out */}
      <div className="selector-header">
        <button className="logout-btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>

      {/* Image slot — drop your image here later */}
      <div className="selector-image-slot">
        <img src={selectorImage} alt="" className="selector-image" />
        {/* <div className="selector-image-placeholder" /> */}
      </div>

      {/* Section list */}
      <div className="selector-list">
        {sections.map((s, index) => {
          const Icon = s.icon;
          return (
            <div key={s.name}>
              <div
                className="selector-row"
                onClick={() => navigate(s.path)}
              >
                <span className="selector-row-name">{s.name}</span>
                <div className="selector-row-right">
                  <Icon size={18} strokeWidth={1.4} />
                  <ArrowUpRight size={16} strokeWidth={1.4} className="selector-arrow" />
                </div>
              </div>
              {index < sections.length - 1 && (
                <div className="selector-divider" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SectionSelector;