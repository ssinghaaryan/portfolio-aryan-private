import { useNavigate, useLocation } from "react-router-dom";
import { Music2, Image, BookOpen, Wallet2, Lightbulb, Vault, Clapperboard } from "lucide-react";
import "./BottomNavbar.css";

const HIDDEN_ROUTES = ["/login", "/", "/vault"];

const NAV_ITEMS = [
  { label: "Music", path: "/music", icon: Music2 },
  { label: "Photos", path: "/photos", icon: Image },
  { label: "Notes", path: "/notes", icon: BookOpen },
  { label: "Finance", path: "/finance", icon: Wallet2 },
  { label: "Ideas", path: "/ideas", icon: Lightbulb },
  { label: "Movies", path: "/movies", icon: Clapperboard },
  { label: "Vault", path: "/vault", icon: Vault },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  if (HIDDEN_ROUTES.includes(location.pathname)) return null;

  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            className={`nav-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="nav-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}