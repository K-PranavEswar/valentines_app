import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Trash2, Instagram, CheckCircle2, Circle,
  MousePointerClick, X, Search, AlertCircle, Filter, Calendar
} from "lucide-react";

import Navbar from "../components/Navbar.jsx";
import ConfessionCard from "../components/ConfessionCard.jsx";
import ConfessionModal from "../components/ConfessionModal.jsx";
import api from "../api/axios.js";

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("cw2026_admin_token");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' | 'oldest'

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/confessions");
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) navigate("/admin");
    else load();
  }, [token, navigate, load]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [data, searchTerm, sortOrder]);

  const toggleCard = (id) => {
    if (!isSelectMode) {
      setSelected(data.find(i => i._id === id));
      setOpen(true);
      return;
    }
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedIds.length} confession(s)?`)) return;

    setLoading(true);
    try {
      await Promise.all(
        selectedIds.map(id =>
          api.delete(`/api/admin/confessions/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      setData(prev => prev.filter(item => !selectedIds.includes(item._id)));
      setSelectedIds([]);
      setIsSelectMode(false);
    } catch (err) {
      alert("Delete failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const renderNameBadge = (name) => {
    const trimmed = name?.trim() || "Anonymous";
    const isIG = trimmed.startsWith("@");
    
    return (
      <div className="badge-to">
        <span style={{ opacity: 0.6 }}>To:</span>
        {isIG ? (
          <a
            href={`https://instagram.com/${trimmed.slice(1)}`}
            target="_blank"
            rel="noreferrer"
            className="ig-link"
            onClick={(e) => e.stopPropagation()}
          >
            <Instagram size={12} /> {trimmed}
          </a>
        ) : (
          <span>{trimmed}</span>
        )}
      </div>
    );
  };

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper { min-height: 100vh; background: #0a0a0c; color: #fff; font-family: 'Inter', sans-serif; }
        .container { max-width: 1400px; margin: auto; padding: 100px 20px 50px; }
        
        /* Glass Header */
        .admin-header {
          position: sticky; top: 85px; z-index: 50;
          background: rgba(20, 20, 25, 0.8);
          backdrop-filter: blur(12px);
          padding: 24px; border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          margin-bottom: 40px;
        }

        .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .stats-h2 { font-size: 1.8rem; font-weight: 800; margin: 0; background: linear-gradient(to right, #ff4d6d, #ff8fa3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .controls-row { display: flex; gap: 15px; flex-wrap: wrap; align-items: center; }
        
        /* Search Input */
        .search-box {
          position: relative; flex: 1; min-width: 250px;
        }
        .search-box input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 12px 12px 40px; border-radius: 12px; color: white;
          outline: none; transition: 0.2s;
        }
        .search-box input:focus { border-color: #ff4d6d; background: rgba(255,255,255,0.08); }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.5; }

        /* Buttons */
        .btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 12px; font-weight: 600;
          cursor: pointer; border: none; transition: 0.2s;
        }
        .btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: white; }
        .btn-outline:hover { background: rgba(255,255,255,0.1); }
        .btn-danger { background: #ff4d6d; color: white; }
        .btn-danger:hover { background: #ff1a45; }
        .btn-select-active { background: #ff4d6d; border-color: #ff4d6d; }

        .admin-grid {
          display: grid; gap: 25px;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }

        .card-wrapper { position: relative; transition: transform 0.2s; }
        .card-wrapper:hover { transform: translateY(-5px); }
        .card-selected { border: 3px solid #ff4d6d; border-radius: 24px; }

        .badge-to {
          position: absolute; top: 12px; left: 12px; z-index: 10;
          background: rgba(0,0,0,0.8); padding: 5px 12px;
          border-radius: 20px; font-size: 0.7rem; display: flex; gap: 5px; border: 1px solid rgba(255,255,255,0.1);
        }
        .ig-link { color: #ff8fa3; text-decoration: none; display: flex; align-items: center; gap: 3px; }
      `}</style>

      <Navbar admin />

      <div className="container">
        <div className="admin-header">
          <div className="header-top">
            <div>
              <h2 className="stats-h2">
                {isSelectMode ? `Selected: ${selectedIds.length}` : "Admin Dashboard"}
              </h2>
              <p style={{ opacity: 0.5, fontSize: "0.9rem" }}>
                Showing {filteredAndSortedData.length} of {data.length} submissions
              </p>
            </div>
            <button className="btn btn-outline" onClick={() => {
               if(window.confirm("Logout?")) {
                 localStorage.removeItem("cw2026_admin_token");
                 navigate("/admin");
               }
            }}>
              <LogOut size={18} /> Logout
            </button>
          </div>

          <div className="controls-row">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                placeholder="Search by name, message or dept..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              className={`btn btn-outline ${isSelectMode ? 'btn-select-active' : ''}`}
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                setSelectedIds([]);
              }}
            >
              {isSelectMode ? <X size={18} /> : <MousePointerClick size={18} />}
              {isSelectMode ? "Cancel" : "Select Multiple"}
            </button>

            <select 
              className="btn btn-outline"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ background: '#1a1a1a' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {isSelectMode && (
              <>
                <button className="btn btn-outline" onClick={() => {
                  setSelectedIds(selectedIds.length === filteredAndSortedData.length ? [] : filteredAndSortedData.map(i => i._id));
                }}>
                  {selectedIds.length === filteredAndSortedData.length ? "Deselect All" : "Select All"}
                </button>
                <button className="btn btn-danger" onClick={deleteSelected} disabled={selectedIds.length === 0}>
                  <Trash2 size={18} /> Delete ({selectedIds.length})
                </button>
              </>
            )}
          </div>
        </div>

        {loading && data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div className="spinner">Loading Confessions...</div>
          </div>
        ) : filteredAndSortedData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>
            <AlertCircle size={48} style={{ marginBottom: '10px' }} />
            <p>No confessions found matching your criteria.</p>
          </div>
        ) : (
          <div className="admin-grid">
            {filteredAndSortedData.map(item => (
              <div
                key={item._id}
                className={`card-wrapper ${selectedIds.includes(item._id) ? 'card-selected' : ''}`}
                onClick={() => toggleCard(item._id)}
              >
                {renderNameBadge(item.name)}
                <ConfessionCard
                  item={item}
                  onOpen={() => {}} 
                  onLike={() => {}}
                  isLiked={false}
                />
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