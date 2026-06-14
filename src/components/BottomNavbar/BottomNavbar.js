import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNavbar.css";

const HIDDEN_ROUTES = ["/login", "/"];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  if (HIDDEN_ROUTES.includes(location.pathname)) return null;

  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${location.pathname === "/music" ? "active" : ""}`}
        onClick={() => navigate("/music")}
      >
        <span>Music</span>
      </div>
      <div className="nav-divider" />
      <div
        className={`nav-item ${location.pathname === "/photos" ? "active" : ""}`}
        onClick={() => navigate("/photos")}
      >
        <span>Photos</span>
      </div>
      <div className="nav-divider" />
      <div
        className={`nav-item ${location.pathname === "/notes" ? "active" : ""}`}
        onClick={() => navigate("/notes")}
      >
        <span>Notes</span>
      </div>
      <div className="nav-divider" />
      <div
        className={`nav-item ${location.pathname === "/finance" ? "active" : ""}`}
        onClick={() => navigate("/finance")}
      >
        <span>Finance</span>
      </div>
    </div>
  );
}