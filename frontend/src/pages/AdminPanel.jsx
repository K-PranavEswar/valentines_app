import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("cw2026_admin_token");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load confessions
  const load = async () => {
    setLoading(true);
    try {
      // In a real admin panel, you might want a specific admin endpoint 
      // that returns ALL confessions (including hidden ones)
      const res = await api.get("/api/confessions");
      setData(res.data || []);
    } catch (err) {
      console.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin");
    } else {
      load();
    }
  }, [token, navigate]);

  const handleLogout = () => {
    if (window.confirm("Log out of Admin Panel?")) {
      localStorage.removeItem("cw2026_admin_token");
      navigate("/");
    }
  };

  const del = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to permanently delete this confession?")) {
      return;
    }

    try {
      await api.delete(`/api/confessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistic update: remove from UI immediately
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Failed to delete. Check console.");
      console.error(err);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #2a0a18 0%, #590d22 100%)", 
      color: "#fff0f3",
      fontFamily: "'Inter', sans-serif"
    }}>
      <Navbar admin />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
        
        {/* --- Header Section --- */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: 24,
          padding: "20px 24px",
          borderRadius: 24,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>Admin Dashboard</h1>
            <p style={{ margin: "5px 0 0 0", opacity: 0.7, fontSize: "0.9rem" }}>
              Managing {data.length} confessions
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              background: "rgba(255, 60, 60, 0.2)",
              color: "#ff8fa3",
              border: "1px solid rgba(255, 60, 60, 0.3)",
              padding: "10px 20px",
              borderRadius: 50,
              fontWeight: 600,
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.target.style.background = "rgba(255, 60, 60, 0.3)"}
            onMouseOut={(e) => e.target.style.background = "rgba(255, 60, 60, 0.2)"}
          >
            Logout
          </button>
        </div>

        {/* --- Content List --- */}
        <div style={{ display: "grid", gap: 16 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: 40, opacity: 0.7 }}>
              <div className="spinner">Fetching data...</div>
            </div>
          )}

          {!loading && data.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, opacity: 0.6, background: "rgba(0,0,0,0.2)", borderRadius: 16 }}>
              <h3>All clean! ✨</h3>
              <p>No confessions found.</p>
            </div>
          )}

          {data.map((x) => (
            <div 
              key={x._id} 
              className="fade-in"
              style={{ 
                padding: 20, 
                borderRadius: 20, 
                background: "rgba(255, 255, 255, 0.03)", 
                border: "1px solid rgba(255, 255, 255, 0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              {/* Top Row: Meta Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ 
                    fontWeight: 800, 
                    color: "#ffc2d1", 
                    fontSize: "1.1rem" 
                  }}>
                    {x.nickname || "Anonymous"}
                  </span>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    padding: "4px 10px", 
                    borderRadius: 20, 
                    background: "rgba(255,255,255,0.1)",
                    opacity: 0.8 
                  }}>
                    {x.mood}
                  </span>
                  <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                    {new Date(x.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div style={{ 
                fontSize: "1rem", 
                lineHeight: 1.6, 
                opacity: 0.9, 
                background: "rgba(0,0,0,0.2)", 
                padding: 12, 
                borderRadius: 12 
              }}>
                {x.message}
              </div>

              {/* Action Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                  ❤️ {x.likes || 0} Likes
                </div>

                <button
                  onClick={() => del(x._id)}
                  style={{
                    border: 0,
                    borderRadius: 12,
                    padding: "8px 16px",
                    background: "#c9184a",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 12px rgba(201, 24, 74, 0.3)",
                    transition: "transform 0.1s"
                  }}
                  onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
                  onMouseUp={(e) => e.target.style.transform = "scale(1)"}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}