import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

const FloatingHearts = () => {
  const hearts = useMemo(() => Array.from({ length: 12 }), []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: -1, pointerEvents: "none" }}>
      {hearts.map((_, i) => (
        <div
          key={i}
          className="heart-bg"
          style={{
            left: `${Math.random() * 100}vw`,
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
            animationDuration: `${Math.random() * 10 + 15}s`,
            animationDelay: `${Math.random() * 5}s`,
            background: i % 2 === 0 ? "#ff4d6d" : "#c9184a",
            opacity: 0.2
          }}
        />
      ))}
    </div>
  );
};

const moods = ["Secret", "Love", "Crush", "Regret", "Funny"];

export default function PostConfession() {
  const navigate = useNavigate();
  // Removed fromName and toName states
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("Secret");
  const [loading, setLoading] = useState(false);

  // Logic to close submissions after Valentine's
  const closed = new Date() >= new Date("2026-02-15T00:00:00.000Z");

  const submit = async (e) => {
    e.preventDefault();
    if (closed) return;
    if (!message.trim()) return;

    setLoading(true);

    try {
      await api.post("/api/confessions", {
        // No From/To names sent anymore
        message: message.trim(),
        mood
      });
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Posting closed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2a0a18 0%, #590d22 100%)",
        color: "#fff0f3",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden"
      }}
    >
      <FloatingHearts />
      <Navbar />

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "clamp(20px, 5vw, 40px)" 
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 600,
            height: "fit-content",
            padding: "30px",
            borderRadius: 24,
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
          }}
        >
          {/* --- NEW BACK BUTTON SECTION --- */}
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255, 255, 255, 0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.9rem",
              padding: 0,
              marginBottom: "10px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff4d6d";
              e.currentTarget.style.transform = "translateX(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </button>
          {/* ------------------------------- */}

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 5vw, 1.8rem)",
                fontWeight: 800,
                background: "linear-gradient(to right, #ff8fa3, #fff0f3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0
              }}
            >
              Post a Confession
            </h2>
            <div style={{ marginTop: 8, opacity: 0.7, fontSize: "0.9rem" }}>
              Dated: <b>14/02/2026</b> • Anonymous Confessions 🤫
            </div>

            {closed && (
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 14px",
                  borderRadius: 18,
                  background: "rgba(255, 60, 60, 0.16)",
                  border: "1px solid rgba(255, 120, 120, 0.25)",
                  fontWeight: 900,
                  color: "#ffe0e0",
                  fontSize: "0.9rem"
                }}
              >
                Confessions are closed after 14/02/2026 🔒
              </div>
            )}
          </div>

          <form onSubmit={submit} style={{ display: "grid", gap: 16, opacity: closed ? 0.55 : 1 }}>
            
            {/* VIBE Select */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700, marginLeft: 10, opacity: 0.9 }}>VIBE</label>
              <select
                value={mood}
                disabled={closed || loading}
                onChange={(e) => setMood(e.target.value)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 50,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.2)",
                  color: "white",
                  outline: "none",
                  cursor: closed ? "not-allowed" : "pointer"
                }}
              >
                {moods.map((m) => (
                  <option key={m} value={m} style={{ background: "#2a0a18" }}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* MESSAGE Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700, marginLeft: 10, opacity: 0.9 }}>CONFESSION</label>
              <div style={{ position: "relative" }}>
                <textarea
                  value={message}
                  disabled={closed || loading}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I've always wanted to tell you... (Use '~' for signature)"
                  rows={6}
                  maxLength={500}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(0,0,0,0.2)",
                    color: "white",
                    resize: "none",
                    outline: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                    fontSize: "1rem"
                  }}
                  onFocus={(e) => !closed && (e.target.style.borderColor = "#ff4d6d")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 16,
                    fontSize: "0.75rem",
                    opacity: 0.5
                  }}
                >
                  {message.length}/500
                </div>
              </div>
            </div>

            <button
              disabled={loading || closed || !message.trim()}
              style={{
                marginTop: 10,
                border: 0,
                padding: "14px",
                borderRadius: 50,
                background: closed
                  ? "rgba(255, 255, 255, 0.1)"
                  : message.trim()
                  ? "linear-gradient(90deg, #ff4d6d 0%, #c9184a 100%)"
                  : "rgba(255, 255, 255, 0.1)",
                color: closed ? "rgba(255,255,255,0.4)" : message.trim() ? "white" : "rgba(255,255,255,0.3)",
                fontWeight: 800,
                fontSize: "1rem",
                boxShadow: closed ? "none" : message.trim() ? "0 4px 15px rgba(255, 77, 109, 0.4)" : "none",
                cursor: closed ? "not-allowed" : message.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s"
              }}
              onMouseDown={(e) => !loading && !closed && message.trim() && (e.target.style.transform = "scale(0.98)")}
              onMouseUp={(e) => !loading && !closed && message.trim() && (e.target.style.transform = "scale(1)")}
            >
              {closed ? "Posting Closed 🔒" : loading ? "Sending love... 💌" : "Post Confession 💘"}
            </button>
          </form>
        </div>
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "30px 20px",
          opacity: 0.5,
          fontSize: "0.85rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          marginTop: "20px"
        }}
      >
        © Confession Site 2026
      </footer>
    </div>
  );
}