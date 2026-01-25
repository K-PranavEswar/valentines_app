import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

const FloatingHearts = () => {
  const hearts = useMemo(() => Array.from({ length: 12 }), []);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: -1,
        pointerEvents: "none"
      }}
    >
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

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("Secret");
  const [loading, setLoading] = useState(false);

  const closed = new Date() >= new Date("2026-02-15T00:00:00.000Z");

  const submit = async (e) => {
    e.preventDefault();
    if (closed) return;
    if (!message.trim()) return;

    setLoading(true);

    try {
      await api.post("/api/confessions", {
        name: name.trim(),
        department: department.trim(),
        message: message.trim(),
        mood
      });
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/");
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 50,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(0,0,0,0.25)",
    color: "white",
    outline: "none",
    fontFamily: "inherit",
    fontSize: "0.95rem"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(10,0,8,0.75), rgba(40,0,20,0.85)), url("/background.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
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
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 18
            }}
          >
            <button
              onClick={goBack}
              style={{
                border: 0,
                padding: "10px 14px",
                borderRadius: 50,
                background: "rgba(255,255,255,0.10)",
                color: "#fff0f3",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
            >
              ← Back
            </button>

            <div style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 700 }}>
              Home
            </div>
          </div>

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

          <form
            onSubmit={submit}
            style={{ display: "grid", gap: 16, opacity: closed ? 0.55 : 1 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginLeft: 10,
                  opacity: 0.9
                }}
              >
                NAME (TO)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={closed || loading}
                placeholder="Who is this for?"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginLeft: 10,
                  opacity: 0.9
                }}
              >
                DEPARTMENT
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={closed || loading}
                placeholder="e.g. CSE, Arts, MBA"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginLeft: 10,
                  opacity: 0.9
                }}
              >
                VIBE
              </label>
              <select
                value={mood}
                disabled={closed || loading}
                onChange={(e) => setMood(e.target.value)}
                style={{
                  ...inputStyle,
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

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginLeft: 10,
                  opacity: 0.9
                }}
              >
                CONFESSION
              </label>
              <div style={{ position: "relative" }}>
                <textarea
                  value={message}
                  disabled={closed || loading}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I've always wanted to tell you... (Use '~' for signature)"
                  rows={6}
                  maxLength={500}
                  style={{
                    ...inputStyle,
                    borderRadius: 20,
                    resize: "none",
                    lineHeight: 1.5,
                    fontSize: "1rem"
                  }}
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
                color: closed
                  ? "rgba(255,255,255,0.4)"
                  : message.trim()
                  ? "white"
                  : "rgba(255,255,255,0.3)",
                fontWeight: 800,
                fontSize: "1rem",
                boxShadow: closed
                  ? "none"
                  : message.trim()
                  ? "0 4px 15px rgba(255, 77, 109, 0.4)"
                  : "none",
                cursor: closed
                  ? "not-allowed"
                  : message.trim()
                  ? "pointer"
                  : "not-allowed",
                transition: "all 0.2s"
              }}
            >
              {closed
                ? "Posting Closed 🔒"
                : loading
                ? "Sending love... 💌"
                : "Post Confession 💘"}
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
