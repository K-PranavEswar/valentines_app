import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Trash2, Instagram, CheckCircle2, 
  Circle, MousePointerClick, X, Search, 
  Filter, AlertCircle 
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import ConfessionCard from "../components/ConfessionCard.jsx";
import ConfessionModal from "../components/ConfessionModal.jsx";
import api from "../api/axios.js";

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("cw2026_admin_token");

  // Data States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // UI States
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // --- Logic: Load Data ---
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/confessions");
      // Sort newest first
      const sorted = (res.data || []).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setData(sorted);
    } catch (err) {
      console.error("Failed to load confessions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) navigate("/admin"); else load();
  }, [token, navigate, load]);

  // --- Logic: Search Filtering ---
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // --- Logic: Selection ---
  const toggleCard = (id) => {
    if (!isSelectMode) {
      const item = data.find(i => i._id === id);
      setSelected(item);
      setOpen(true);
      return;
    }
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(item => item._id));
    }
  };

  // --- Logic: Delete ---
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const confirmMsg = `⚠️ Delete ${selectedIds.length} confession(s) permanently? This cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => 
        api.delete(`/api/admin/confessions/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
      ));
      setData(prev => prev.filter(item => !selectedIds.includes(item._id)));
      setSelectedIds([]);
      setIsSelectMode(false);
    } catch (err) {
      alert("Error deleting some items. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Log out of Admin Panel?")) {
      localStorage.removeItem("cw2026_admin_token");
      navigate("/admin");
    }
  };

  // --- Helper: Render Name/IG ---
  const renderName = (name) => {
    const trimmed = name?.trim() || "Anonymous";
    if (trimmed.startsWith("@")) {
      const handle = trimmed.substring(1);
      return (
        <a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer" className="ig-link" onClick={(e) => e.stopPropagation()}>
          <Instagram size={14} style={{ marginRight: 4 }} /> {trimmed}
        </a>
      );
    }
    return <span>To: {trimmed}</span>;
  };

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper { 
          min-height: 100vh; 
          background: #0d0205; 
          color: #fff0f3; 
          font-family: 'Inter', sans-serif;
          background-image: radial-gradient(circle at 50% -20%, #4a0e1c 0%, #0d0205 80%);
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 120px 20px 60px; }
        
        .admin-header {
          position: sticky; top: 20px; z-index: 100;
          background: rgba(20, 5, 10, 0.7); backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 30px; padding: 20px 30px;
          display: flex; flex-direction: column; gap: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .header-top { display: flex; justify-content: space-between; align-items: center; }
        .header-bottom { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

        .search-container {
          position: relative; flex: 1; min-width: 250px;
        }
        .search-input {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px; padding: 12px 20px 12px 45px; color: white; outline: none; transition: 0.3s;
        }
        .search-input:focus { border-color: #ff4d6d; background: rgba(255,255,255,0.08); }

        .action-btn {
          display: flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 50px;
          font-weight: 700; cursor: pointer; transition: 0.2s; border: 1px solid transparent; font-size: 0.9rem;
        }
        .btn-mode { background: ${isSelectMode ? '#ff4d6d' : 'rgba(255,255,255,0.1)'}; color: white; }
        .btn-delete { background: #c9184a; color: white; opacity: ${selectedIds.length > 0 ? 1 : 0.4}; pointer-events: ${selectedIds.length > 0 ? 'auto' : 'none'}; border-color: #ff4d6d; }
        
        .admin-grid { display: grid; gap: 25px; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); }
        
        .card-wrapper { position: relative; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; }
        .card-wrapper:hover { transform: translateY(-5px); }
        .card-selected { transform: scale(0.95); }
        .card-selected-border { position: absolute; inset: -4px; border: 3px solid #ff4d6d; border-radius: 28px; z-index: 1; pointer-events: none; }

        .ig-link { color: #ff8fa3; text-decoration: none; font-weight: 800; display: inline-flex; align-items: center; transition: 0.2s; }
        .ig-link:hover { color: #ff4d6d; text-decoration: underline; }

        .badge-to { 
          position: absolute; top: 18px; left: 18px; z-index: 10; 
          background: rgba(0,0,0,0.8); padding: 6px 14px; border-radius: 50px; 
          font-size: 0.75rem; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(5px);
        }
        .select-icon { position: absolute; top: 18px; right: 18px; z-index: 10; }
        
        .empty-state { text-align: center; padding: 100px 20px; opacity: 0.4; }
      `}</style>

      <Navbar admin />

      <div className="container">
        <header className="admin-header">
          <div className="header-top">
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, margin: 0 }}>
                {isSelectMode ? `Selected ${selectedIds.length} items` : "Admin Control"}
              </h1>
              <p style={{ margin: 0, opacity: 0.5, fontSize: '0.85rem' }}>
                {filteredData.length} of {data.length} confessions showing
              </p>
            </div>
            <button onClick={handleLogout} className="action-btn" style={{ background: 'rgba(255, 77, 109, 0.1)', color: '#ff8fa3' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>

          <div className="header-bottom">
            <div className="search-container">
              <Search size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
              <input 
                type="text" 
                placeholder="Search by name, message, or dept..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="action-btn btn-mode" onClick={() => { setIsSelectMode(!isSelectMode); setSelectedIds([]); }}>
              {isSelectMode ? <X size={18} /> : <MousePointerClick size={18} />}
              {isSelectMode ? "Cancel Mode" : "Select Cards"}
            </button>

            {isSelectMode && (
              <>
                <button className="action-btn" onClick={handleSelectAll} style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                  {selectedIds.length === filteredData.length ? "Deselect All" : "Select All"}
                </button>
                <button className="action-btn btn-delete" onClick={deleteSelected}>
                  <Trash2 size={18} /> Delete Selected
                </button>
              </>
            )}
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px", fontSize: "1.2rem", opacity: 0.6 }}>
            Syncing Database...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} style={{ marginBottom: 15 }} />
            <h3>No results matching your search</h3>
          </div>
        ) : (
          <div className="admin-grid">
            {filteredData.map((item) => {
              const isSelected = selectedIds.includes(item._id);
              return (
                <div 
                  key={item._id} 
                  className={`card-wrapper ${isSelected ? 'card-selected' : ''}`} 
                  onClick={() => toggleCard(item._id)}
                >
                  {isSelected && <div className="card-selected-border" />}
                  
                  {isSelectMode && (
                    <div className="select-icon">
                      {isSelected 
                        ? <CheckCircle2 size={26} color="#ff4d6d" fill="white" /> 
                        : <Circle size={26} color="rgba(255,255,255,0.2)" />
                      }
                    </div>
                  )}

                  <div className="badge-to">{renderName(item.name)}</div>
                  
                  <ConfessionCard 
                    item={item} 
                    onOpen={() => {}} 
                    onLike={() => {}} 
                    isLiked={false} 
                  />
                </div>
              );
            })}
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