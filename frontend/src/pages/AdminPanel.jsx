import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("cw2026_admin_token");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/confessions");
      setData(res.data || []);
    } catch (err) {
      console.error("Failed to load confessions", err);
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
      navigate("/admin");
    }
  };

  const del = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to permanently delete this confession?")) {
      return;
    }

    try {
      await api.delete(`/api/admin/confessions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.response?.data?.message || "Failed to delete. Check console.");
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
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          padding: "20px 24px",
          borderRadius: 24,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>
              Admin Dashboard
            </h1>
            <p style={{ margin: "5px 0 0", opacity: 0.7 }}>
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
              fontWeight: 600
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {loading && <div style={{ textAlign: "center", opacity: 0.7 }}>Loading…</div>}

          {!loading && data.length === 0 && (
            <div style={{ textAlign: "center", opacity: 0.6 }}>
              No confessions found
            </div>
          )}

          {data.map((x) => (
            <div
              key={x._id}
              style={{
                padding: 20,
                borderRadius: 20,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <strong>{x.nickname || "Anonymous"}</strong>
                <span>{x.mood}</span>
                <span style={{ opacity: 0.6 }}>
                  {new Date(x.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{
                background: "rgba(0,0,0,0.2)",
                padding: 12,
                borderRadius: 12
              }}>
                {x.message}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>❤️ {x.likes || 0}</span>

                <button
                  onClick={() => del(x._id)}
                  style={{
                    background: "#c9184a",
                    color: "white",
                    border: 0,
                    padding: "8px 16px",
                    borderRadius: 12,
                    fontWeight: 700
                  }}
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
