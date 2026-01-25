import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar.jsx";
import ConfessionCard from "../components/ConfessionCard.jsx";
import ConfessionModal from "../components/ConfessionModal.jsx";
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

const moods = [
  { label: "All Vibes", value: "All" },
  { label: "❤️ Love", value: "Love" },
  { label: "😍 Crush", value: "Crush" },
  { label: "💔 Regret", value: "Regret" },
  { label: "😂 Funny", value: "Funny" },
  { label: "🤫 Secret", value: "Secret" }
];

export default function Home() {
  const [data, setData] = useState([]);
  const [mood, setMood] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());

  const closed = new Date() >= new Date("2026-02-15T00:00:00.000Z");

  useEffect(() => {
    const storedLikes = localStorage.getItem("cw2026_liked_ids");
    if (storedLikes) {
      setLikedIds(new Set(JSON.parse(storedLikes)));
    }
  }, []);

  useEffect(() => {
    const fetchConfessions = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/confessions", {
          params: { mood, search }
        });
        setData(res.data || []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => fetchConfessions(), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [mood, search]);

  const like = async (id) => {
    if (likedIds.has(id)) return;

    setData((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, likes: (item.likes || 0) + 1 } : item
      )
    );

    const newLikedSet = new Set(likedIds);
    newLikedSet.add(id);
    setLikedIds(newLikedSet);
    localStorage.setItem("cw2026_liked_ids", JSON.stringify([...newLikedSet]));

    try {
      await api.put(`/api/confessions/${id}/like`);
    } catch {}
  };

  const openComments = (item) => {
    setSelected(item);
    setOpen(true);
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
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <FloatingHearts />
      <Navbar />

      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(16px, 5vw, 24px)"
        }}
      >
        <div
          style={{
            marginBottom: 30,
            textAlign: "center",
            padding: "clamp(24px, 5vw, 40px) 20px",
            borderRadius: 24,
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.8rem, 6vw, 3rem)",
              fontWeight: 800,
              background: "linear-gradient(to right, #ff8fa3, #fff0f3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 10px 0",
              lineHeight: 1.2
            }}
          >
            Confession Wall 2026
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 4vw, 1.1rem)",
              opacity: 0.8,
              maxWidth: 650,
              margin: "0 auto",
              lineHeight: 1.6
            }}
          >
            Speak your heart out anonymously. <br />
            Special Edition{" "}
            <span style={{ color: "#ff4d6d", fontWeight: "bold" }}>
              14/02/2026
            </span>{" "}
            🌹
          </p>

          {closed && (
            <div
              style={{
                marginTop: 18,
                padding: "12px 16px",
                borderRadius: 18,
                background: "rgba(255, 60, 60, 0.16)",
                border: "1px solid rgba(255, 120, 120, 0.25)",
                fontWeight: 900,
                color: "#ffe0e0",
                display: "inline-block"
              }}
            >
              Confession posting closed after 14/02/2026 🔒
            </div>
          )}

          <div
            style={{
              marginTop: 30,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              style={{
                padding: "14px 20px",
                borderRadius: 50,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.3)",
                color: "white",
                fontSize: 16,
                cursor: "pointer",
                outline: "none",
                flex: "1 1 140px",
                maxWidth: "100%"
              }}
            >
              {moods.map((m) => (
                <option
                  key={m.value}
                  value={m.value}
                  style={{ background: "#2a0a18" }}
                >
                  {m.label}
                </option>
              ))}
            </select>

            <div
              style={{
                position: "relative",
                flex: "999 1 300px",
                maxWidth: "100%"
              }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search keywords..."
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  borderRadius: 50,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: 16,
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.15)")
                }
                onBlur={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.1)")
                }
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 50, opacity: 0.7 }}>
            <div className="spinner">💌 Loading hearts...</div>
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, opacity: 0.6 }}>
            <h3>No confessions found.</h3>
            <p>Be the first to share a secret!</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "clamp(12px, 2vw, 20px)"
            }}
          >
            {data.map((item) => (
              <ConfessionCard
                key={item._id}
                item={item}
                onLike={like}
                onOpen={openComments}
                isLiked={likedIds.has(item._id)}
              />
            ))}
          </div>
        )}
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "18px 12px",
          opacity: 0.7,
          fontSize: "0.85rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          width: "100%",
          marginTop: "auto"
        }}
      >
        © Confession Site 2026
      </footer>

      <ConfessionModal
        open={open}
        confession={selected}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
