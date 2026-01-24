export default function ConfessionCard({ item, onLike, onOpen, isLiked }) {
  const mood = item.mood || "Secret";
  
  // Format date (e.g., "25 Jan") matches image style
  const date = item.createdAt 
    ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) 
    : "14 Feb";

  // Dynamic Colors
  const getMoodColor = (m) => {
    switch(m) {
      case "Love": return "#ff4d6d";
      case "Crush": return "#ff9e00"; // Matches 'CRUSH' tag color in image
      case "Regret": return "#3a86ff";
      case "Funny": return "#00b4d8";
      default: return "#8338ec"; 
    }
  };

  const moodColor = getMoodColor(mood);

  // --- LOGIC: Handle the "~" splitter for new line / signature ---
  const rawMessage = item.message || "";
  let messageContent = rawMessage;
  let messageSignature = "";

  if (rawMessage.includes("~")) {
    const parts = rawMessage.split("~");
    messageContent = parts[0].trim();
    // Add the ~ back for the signature line
    messageSignature = `~ ${parts.slice(1).join("~").trim()}`; 
  }

  return (
    <div
      onClick={() => onOpen(item)}
      style={{
        background: "#3e0e1b", // Dark maroon background from image
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: 24,
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.2s",
        minHeight: 180
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      {/* --- Quote Mark (Top Left) --- */}
      <div style={{
        position: "absolute",
        top: 20,
        left: 20,
        fontSize: "2rem",
        fontFamily: "serif",
        color: "rgba(255,255,255,0.1)",
        lineHeight: 1
      }}>
        “
      </div>

      {/* --- Mood Tag (Top Right) --- */}
      <div style={{
        position: "absolute",
        top: 20,
        right: 20,
        fontSize: "0.75rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: moodColor,
        border: `1px solid ${moodColor}40`,
        padding: "4px 12px",
        borderRadius: 50,
        background: "rgba(0,0,0,0.2)"
      }}>
        {mood}
      </div>

      {/* --- Content Area --- */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", // Center text horizontally
        textAlign: "center",
        marginTop: 30,
        marginBottom: 20,
        gap: 8
      }}>
        {/* Main Message */}
        <div style={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "#fff",
          fontStyle: "italic",
          lineHeight: 1.4
        }}>
          {messageContent}
        </div>

        {/* Signature Line (New Line) */}
        {messageSignature && (
          <div style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#ffccd5", // Slightly softer pink/white for signature
            fontStyle: "italic",
            marginTop: 4
          }}>
            {messageSignature}
          </div>
        )}
      </div>

      {/* --- Footer --- */}
      <div style={{
        marginTop: "auto",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: 15,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: 0.8
      }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
          {date}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(item._id);
          }}
          disabled={isLiked}
          style={{
            border: 0,
            background: "rgba(255,255,255,0.1)",
            color: isLiked ? "#ff4d6d" : "#fff",
            padding: "6px 14px",
            borderRadius: 50,
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: isLiked ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          {isLiked ? "❤️" : "🤍"} {item.likes || 0}
        </button>
      </div>
    </div>
  );
}