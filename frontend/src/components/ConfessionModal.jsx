export default function ConfessionModal({ open, confession, onClose }) {
  if (!open || !confession) return null;

  // --- LOGIC: Handle the "~" splitter inside Modal ---
  const rawMessage = confession.message || "";
  let messageContent = rawMessage;
  let messageSignature = "";

  if (rawMessage.includes("~")) {
    const parts = rawMessage.split("~");
    messageContent = parts[0].trim();
    messageSignature = `~ ${parts.slice(1).join("~").trim()}`;
  }

  // Mood color for modal accent
  const getMoodColor = (m) => {
    switch(m) {
      case "Love": return "#ff4d6d";
      case "Crush": return "#ff9e00";
      case "Regret": return "#3a86ff";
      case "Funny": return "#00b4d8";
      default: return "#8338ec"; 
    }
  };
  const accentColor = getMoodColor(confession.mood);

  return (
    <div 
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(5px)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 500,
          background: "#1a050b", // Matches popup dark theme
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 20,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          animation: "popIn 0.3s ease-out"
        }}
      >
        <style>{`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* --- Header --- */}
        <div style={{ 
          padding: "16px 20px", 
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "rgba(255,255,255,0.02)"
        }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>
            Anonymous <span style={{ opacity: 0.6, fontWeight: 400 }}>is feeling</span> <span style={{ color: accentColor }}>{confession.mood}</span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "none", border: 0, color: "white", fontSize: 24, cursor: "pointer", opacity: 0.7 }}
          >
            &times;
          </button>
        </div>

        {/* --- Body --- */}
        <div style={{ padding: "30px 24px", textAlign: "center" }}>
          <div style={{ 
            fontSize: "1.3rem", 
            fontWeight: 600, 
            lineHeight: 1.5, 
            color: "#fff0f3",
            marginBottom: 10
          }}>
            {messageContent}
          </div>
          
          {messageSignature && (
            <div style={{ 
              fontSize: "1.1rem", 
              fontWeight: 700, 
              color: accentColor,
              marginTop: 10
            }}>
              {messageSignature}
            </div>
          )}
        </div>

        {/* --- Footer (No Comments / No Input) --- */}
        <div style={{ 
          padding: "16px", 
          textAlign: "center", 
          opacity: 0.4, 
          fontSize: "0.8rem", 
          borderTop: "1px solid rgba(255,255,255,0.05)" 
        }}>
          Secret Confession • 14/02/2026
        </div>
      </div>
    </div>
  );
}