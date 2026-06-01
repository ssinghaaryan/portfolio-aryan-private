import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNavbar.css";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav">
      {/* <div
        className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        <span>Photos</span>
      </div>
|
      <div
        className={`nav-item ${location.pathname === "/music" ? "active" : ""}`}
        onClick={() => navigate("/music")}
      >
        <span>Music</span>
      </div> */}
      <div style={{
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: "80px",
  background: "red",
  zIndex: 999999999,
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px"
}}>
  NAV TEST
</div>
    </div>
  );
}