import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNavbar.css";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        onClick={() => navigate("/")}
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