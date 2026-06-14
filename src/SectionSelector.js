import React from "react";
import { useNavigate } from "react-router-dom";
import { Music2, Image, BookOpen, Wallet, Lightbulb } from "lucide-react";
import "./SectionSelector.css";
import { useData } from "./context/DataContext";

const sections = [
  { name: "Music", path: "/music", icon: Music2 },
  { name: "Photos", path: "/photos", icon: Image },
  { name: "Notes", path: "/notes", icon: BookOpen },
  { name: "Finance", path: "/finance", icon: Wallet },
  { name: "Ideas", path: "/ideas", icon: Lightbulb },
];

const SectionSelector = () => {
  const { clearAll } = useData();
  const navigate = useNavigate();

const handleLogout = () => {
  clearAll(); // 👈 wipes cached data on logout
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
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              className="selector-tile"
              onClick={() => navigate(s.path)}
            >
              <Icon size={28} strokeWidth={1.6} color="white" />
              <span className="tile-name">{s.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionSelector;