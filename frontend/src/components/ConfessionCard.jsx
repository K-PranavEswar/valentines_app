export default function ConfessionCard({ item, onLike, onOpen, isLiked }) {
  const mood = item.mood || "Secret";

  const date = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "14 Feb";

  const getMoodColor = (m) => {
    switch (m) {
      case "Love":
        return "#ff4d6d";
      case "Crush":
        return "#ff9e00";
      case "Regret":
        return "#3a86ff";
      case "Funny":
        return "#00b4d8";
      default:
        return "#8338ec";
    }
  };

  const moodColor = getMoodColor(mood);

  const rawMessage = item.message || "";
  let messageContent = rawMessage;
  let messageSignature = "";

  if (rawMessage.includes("~")) {
    const parts = rawMessage.split("~");
    messageContent = parts[0].trim();
    messageSignature = `~ ${parts.slice(1).join("~").trim()}`;
  }

  const toName = item?.name?.trim() ? item.name : "";
  const fromDept = item?.department?.trim() ? item.department : "";

  return (
    <div
      onClick={() => onOpen(item)}
      style={{
        background: "#3e0e1b",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: 24,
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.2s",
        minHeight: 200
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: "2rem",
          fontFamily: "serif",
          color: "rgba(255,255,255,0.1)",
          lineHeight: 1
        }}
      >
        “
      </div>

      <div
        style={{
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
        }}
      >
        {mood}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          marginTop: 45,
          marginBottom: 20,
          gap: 12
        }}
      >
        {(toName || fromDept) && (
          <div
            style={{
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.6)",
              background: "rgba(255, 255, 255, 0.03)",
              padding: "6px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            {toName && (
              <>
                To: <span style={{ color: "#ffccd5", fontWeight: 700 }}>{toName}</span>
              </>
            )}

            {toName && fromDept && <span style={{ margin: "0 6px" }}>dept: </span>}

            {fromDept && <span style={{ color: "#ffccd5", fontWeight: 700 }}>{fromDept}</span>}
          </div>
        )}

        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#fff",
            fontStyle: "italic",
            lineHeight: 1.4,
            wordBreak: "break-word"
          }}
        >
          {messageContent}
        </div>

        {messageSignature && (
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#ff8fa3",
              fontStyle: "italic",
              marginTop: 4,
              opacity: 0.9
            }}
          >
            {messageSignature}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0.8
        }}
      >
        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
          {date}
        </span>
      </div>
    </div>
  );
}
