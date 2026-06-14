import React from "react";
import { useNavigate } from "react-router-dom";
import "./SectionSelector.css";

const sections = [
  { name: "Music", path: "/music", emoji: "🎵" },
  { name: "Photos", path: "/photos", emoji: "📷" },
  { name: "Notes", path: "/notes", emoji: "📝" },
  { name: "Finance", path: "/finance", emoji: "💰" },
  { name: "Ideas", path: "/ideas", emoji: "💡" },
];

const SectionSelector = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div className="selector-container">
      <div className="selector-header">
        <h1 className="selector-title">Good to see you 👋</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="selector-grid">
        {sections.map((s) => (
          <div
            key={s.name}
            className="selector-tile"
            onClick={() => navigate(s.path)}
          >
            <span className="tile-emoji">{s.emoji}</span>
            <span className="tile-name">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionSelector;