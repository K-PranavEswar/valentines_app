import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ admin }) {
  const navigate = useNavigate();

  const logout = () => {
    if (window.confirm("Log out of Admin Panel?")) {
      localStorage.removeItem("cw2026_admin_token");
      navigate("/"); // Redirect to home after logout
    }
  };

  return (
    <nav style={{ 
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(42, 10, 24, 0.7)", // Semi-transparent dark bg
      backdropFilter: "blur(12px)",        // Glass effect
      WebkitBackdropFilter: "blur(12px)"
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "16px 20px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between" 
      }}>
        
        {/* --- Logo --- */}
        <Link to="/" style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8,
          textDecoration: "none"
        }}>
          <span style={{ fontSize: "1.5rem" }}>💌</span>
          <div style={{ 
            fontWeight: 800, 
            fontSize: "1.2rem", 
            letterSpacing: -0.5,
            color: "#fff" 
          }}>
            BROCODES CONFESSION WALL
          </div>
        </Link>
         
      </div>
    </nav>
  );
}