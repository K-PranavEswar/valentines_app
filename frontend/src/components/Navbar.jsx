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
            Confession Wall <span style={{ color: "#ff4d6d" }}>2026</span>
          </div>
        </Link>

        {/* --- Right Actions --- */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          
          {/* Post Button - Visible to everyone */}
          {!admin && (
            <Link 
              to="/post" 
              style={{ 
                padding: "10px 20px", 
                borderRadius: 50, 
                background: "linear-gradient(90deg, #ff4d6d 0%, #c9184a 100%)", 
                color: "white", 
                fontWeight: 700,
                fontSize: "0.9rem",
                boxShadow: "0 4px 12px rgba(255, 77, 109, 0.4)",
                transition: "transform 0.1s"
              }}
              onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
              onMouseUp={(e) => e.target.style.transform = "scale(1)"}
            >
              + Post Secret
            </Link>
          )}

          {/* Logout Button - ONLY visible if 'admin' prop is passed (inside Admin Panel) */}
          {admin && (
            <button 
              onClick={logout} 
              style={{ 
                padding: "10px 18px", 
                borderRadius: 50, 
                border: "1px solid rgba(255, 60, 60, 0.3)", 
                background: "rgba(255, 60, 60, 0.15)", 
                color: "#ffccd5", 
                fontWeight: 700,
                fontSize: "0.9rem"
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}