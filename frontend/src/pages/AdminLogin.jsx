import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  // Default credentials left in for easier testing
  const [email, setEmail] = useState("admin@confession2026.com");
  const [password, setPassword] = useState("Admin@2026");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api.post("/api/admin/login", { email, password });
      localStorage.setItem("cw2026_admin_token", res.data.token);
      navigate("/admin/panel");
    } catch {
      setErr("Invalid credentials. Access Denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #2a0a18 0%, #590d22 100%)", 
      color: "#fff0f3",
      display: "flex",
      flexDirection: "column"
    }}>
      <Navbar />

      <div style={{ 
        flex: 1, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "20px" 
      }}>
        
        <div style={{ 
          width: "100%", 
          maxWidth: 420, 
          padding: "40px 30px", 
          borderRadius: 24, 
          background: "rgba(255, 255, 255, 0.05)", 
          backdropFilter: "blur(12px)", 
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
        }}>
          
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 800, 
              background: "linear-gradient(to right, #ff8fa3, #fff0f3)", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent",
              margin: 0
            }}>
              Admin Access
            </h2>
            <p style={{ opacity: 0.6, fontSize: "0.9rem", marginTop: 8 }}>
              Please verify your identity
            </p>
          </div>

          <form onSubmit={login} style={{ display: "grid", gap: 16 }}>
            <div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                style={{ 
                  width: "100%",
                  padding: "14px 20px", 
                  borderRadius: 50, 
                  border: "1px solid rgba(255,255,255,0.15)", 
                  background: "rgba(0,0,0,0.2)", 
                  color: "#fff",
                  fontSize: "1rem",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#ff4d6d"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
              />
            </div>

            <div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secret Password"
                type="password"
                style={{ 
                  width: "100%",
                  padding: "14px 20px", 
                  borderRadius: 50, 
                  border: "1px solid rgba(255,255,255,0.15)", 
                  background: "rgba(0,0,0,0.2)", 
                  color: "#fff",
                  fontSize: "1rem",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#ff4d6d"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
              />
            </div>

            {err && (
              <div style={{ 
                padding: "10px", 
                borderRadius: 12, 
                background: "rgba(255, 77, 109, 0.15)", 
                border: "1px solid rgba(255, 77, 109, 0.3)",
                color: "#ffccd5", 
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: 600
              }}>
                ⚠️ {err}
              </div>
            )}

            <button
              disabled={loading}
              style={{ 
                marginTop: 10,
                border: 0, 
                padding: "14px", 
                borderRadius: 50, 
                background: "linear-gradient(90deg, #ff4d6d 0%, #c9184a 100%)", 
                color: "white", 
                fontWeight: 800, 
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(255, 77, 109, 0.4)",
                transition: "transform 0.1s",
                opacity: loading ? 0.7 : 1
              }}
              onMouseDown={(e) => !loading && (e.target.style.transform = "scale(0.98)")}
              onMouseUp={(e) => !loading && (e.target.style.transform = "scale(1)")}
            >
              {loading ? "Verifying..." : "Unlock Panel 🔓"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}