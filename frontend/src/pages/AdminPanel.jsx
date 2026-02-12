import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, Instagram } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import ConfessionCard from "../components/ConfessionCard.jsx";
import ConfessionModal from "../components/ConfessionModal.jsx";
import api from "../api/axios.js";

export default function AdminPanel() {

  const navigate = useNavigate();
  const token = localStorage.getItem("cw2026_admin_token");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);


  const renderName = (name) => {

    const trimmed = name?.trim() || "Anonymous";

    if (trimmed.startsWith("@")) {

      const handle = trimmed.substring(1);

      return (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

          <span style={{ opacity: 0.6 }}>to</span>

          <a
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-link"
            onClick={(e) => e.stopPropagation()}
          >
            <Instagram size={14} />
            {trimmed}
          </a>

        </div>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ opacity: 0.6 }}>to</span>
        <span>{trimmed}</span>
      </div>
    );
  };


  const load = useCallback(async () => {

    setLoading(true);

    try {

      const res = await api.get("/api/confessions");

      setData(res.data || []);

    } catch (err) {

      console.error("Failed to load confessions", err);

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    if (!token) {

      navigate("/admin");

    } else {

      load();

    }

  }, [token, navigate, load]);


  const handleLogout = () => {

    if (window.confirm("Log out of Admin Panel?")) {

      localStorage.removeItem("cw2026_admin_token");

      navigate("/admin");

    }

  };


  const openComments = (item) => {

    setSelected(item);

    setOpen(true);

  };


  const del = async (e, id) => {

    e.stopPropagation();

    if (!window.confirm("⚠️ Permanently delete this confession?")) return;

    try {

      await api.delete(`/api/admin/confessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(prev => prev.filter(item => item._id !== id));

      if (selected?._id === id) setOpen(false);

    } catch {

      alert("Delete failed.");

    }

  };


  return (

    <div className="admin-wrapper">

      <style>{`

        .admin-wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at top, #4a0e1c 0%, #1a050a 100%);
          color: #fff0f3;
          font-family: 'Inter', sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 20px 40px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 40px;
        }

        .admin-grid {
          display: grid;
          gap: 25px;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 77, 109, 0.1);
          color: #ff8fa3;
          border: 1px solid rgba(255, 77, 109, 0.2);
          padding: 12px 24px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
        }

        .admin-card-wrapper {
          position: relative;
        }

        .admin-delete-overlay {
          position: absolute;
          bottom: 20px;
          right: 80px;
          z-index: 10;
        }

        .delete-icon-btn {
          background: #c9184a;
          color: white;
          border: none;
          padding: 8px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .delete-icon-btn:hover {
          background: #ff4d6d;
          transform: scale(1.1);
        }

        .ig-link {
          color: #ff8fa3;
          text-decoration: none;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: 0.2s;
        }

        .ig-link:hover {
          color: #ff4d6d;
          text-decoration: underline;
        }

        .admin-handle-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 5;
          background: rgba(0,0,0,0.6);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(4px);
        }

      `}</style>


      <Navbar admin />


      <div className="container">


        <header className="admin-header">

          <div>

            <h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>
              Admin Dashboard
            </h1>

            <p style={{ opacity: 0.6 }}>
              Moderating {data.length} confessions
            </p>

          </div>

          <button onClick={handleLogout} className="btn-logout">

            <LogOut size={18} />

            Logout

          </button>

        </header>


        {loading ? (

          <div style={{ textAlign: "center", padding: "50px" }}>
            Refreshing Wall...
          </div>

        ) : (

          <div className="admin-grid">

            {data.map((item) => (

              <div key={item._id} className="admin-card-wrapper">

                <div className="admin-handle-badge">
                  {renderName(item.name)}
                </div>

                <ConfessionCard
                  item={item}
                  onOpen={openComments}
                  onLike={() => {}}
                  isLiked={false}
                />

                <div className="admin-delete-overlay">

                  <button
                    className="delete-icon-btn"
                    onClick={(e) => del(e, item._id)}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      <ConfessionModal
        open={open}
        confession={selected}
        onClose={() => setOpen(false)}
      />

    </div>

  );

}
