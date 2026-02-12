import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Instagram, Heart, Lock, Send } from "lucide-react"; 
import Navbar from "../components/Navbar.jsx";

const FloatingHearts = () => {
  // Increased count slightly for better coverage
  const hearts = useMemo(() => Array.from({ length: 20 }), []);
  return (
    <div className="hearts-layer">
      {hearts.map((_, i) => (
        <div
          key={i}
          className="heart-particle"
          style={{
            left: `${Math.random() * 100}vw`,
            // Random sizes and blur for a depth-of-field effect
            width: `${Math.random() * 15 + 10}px`,
            height: `${Math.random() * 15 + 10}px`,
            animationDuration: `${Math.random() * 8 + 12}s`,
            animationDelay: `${Math.random() * 10}s`,
            background: i % 2 === 0 ? "#ff4d6d" : "#c9184a",
            filter: `blur(${Math.random() * 2}px)`,
          }}
        >
          <Heart fill="currentColor" size="100%" />
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const admin = localStorage.getItem("role") === "admin";
  const closingDate = new Date("2026-02-15T00:00:00.000Z");
  const [isClosed, setIsClosed] = useState(new Date() >= closingDate);

  useEffect(() => {
    const timer = setInterval(() => {
      if (new Date() >= closingDate) setIsClosed(true);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container">
      <style>{`
        .app-container {
          min-height: 100vh;
          background: radial-gradient(circle at top, #2d060e 0%, #0a0103 100%);
          color: #fff0f3;
          font-family: 'Inter', system-ui, sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .hearts-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .heart-particle { 
          position: absolute; 
          bottom: -100px; 
          opacity: 0.2; 
          animation: floatUp linear infinite; 
        }
        @keyframes floatUp { 
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; } 
        }

        .main-content {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto; padding: 120px 20px 60px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 90vh;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 77, 109, 0.2);
          border-radius: 40px;
          padding: 60px 40px;
          text-align: center;
          box-shadow: 0 0 40px rgba(255, 77, 109, 0.1);
          width: 100%; max-width: 650px;
          transition: transform 0.3s ease;
        }

        .hero-title {
          font-size: clamp(2.8rem, 10vw, 4.5rem);
          font-weight: 900; line-height: 1.1; margin-bottom: 20px;
          background: linear-gradient(to bottom, #fff 30%, #ff8fa3 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .insta-box {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 20px; border-radius: 100px;
          margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.1);
          transition: 0.3s; text-decoration: none; color: #ff8fa3;
        }
        .insta-box:hover { background: rgba(255, 77, 109, 0.1); transform: translateY(-2px); }

        .btn-post {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: linear-gradient(135deg, #ff4d6d 0%, #c9184a 100%);
          color: white; padding: 20px 50px; border-radius: 100px;
          font-weight: 800; font-size: 1.2rem; text-decoration: none;
          box-shadow: 0 15px 30px rgba(201, 24, 74, 0.4);
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          margin: 30px auto 20px; width: fit-content;
        }
        .btn-post:hover { transform: scale(1.05) translateY(-5px); }

        .announcement-tag {
          font-size: 0.75rem; font-weight: 600; letter-spacing: 1px;
          color: #ff8fa3; text-transform: uppercase; margin-top: 25px;
          opacity: 0.8; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px;
        }

        @media (max-width: 600px) {
          .glass-panel { padding: 40px 24px; }
          .hero-title { font-size: 2.5rem; }
        }
      `}</style>

      <FloatingHearts />
      <Navbar />

      <main className="main-content">
        <section className="glass-panel">
          <h1 className="hero-title">Confession Wall 2026</h1>
          
       <div
  className="insta-box"
  onClick={() => {
    const username = "bro__codes._";
    const appLink = `instagram://user?username=${username}`;
    const webLink = `https://www.instagram.com/${username}/`;

    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid || isIOS) {
      const timeout = setTimeout(() => {
        window.open(webLink, "_blank");
      }, 600);

      window.location.href = appLink;

      window.addEventListener("blur", () => clearTimeout(timeout));
    } else {
      window.open(webLink, "_blank");
    }
  }}
  style={{ cursor: "pointer" }}
>
  <Instagram size={20} strokeWidth={2} />
  <span style={{ fontWeight: 600 }}>@bro__codes._</span>
</div>



          <p style={{ opacity: 0.9, fontSize: "1.15rem", lineHeight: "1.6", maxWidth: "450px", margin: "0 auto" }}>
            The vault is open. Speak your heart out anonymously. Your secrets are safe with us.
            <br />
            <span style={{ color: "#ff8fa3", fontWeight: 700, display: "block", marginTop: "10px" }}>
              Valentine's Edition 2026 🌹
            </span>
          </p>

          <div className="actions">
            {!admin && (
              isClosed ? (
                <div className="btn-post" style={{ background: "rgba(255,255,255,0.05)", color: "#777", cursor: "not-allowed", boxShadow: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Lock size={20} /> Posting Closed
                </div>
              ) : (
                <Link to="/post" className="btn-post">
                  <Send size={20} /> Write a Secret
                </Link>
              )
            )}
          </div>

          <p className="announcement-tag">
            Results will be featured on <br/><strong>BroCodes Instagram Stories</strong>
          </p>
        </section>
      </main>

      <footer style={{
  textAlign: "center",
  padding: "25px",
  background: "#0a0a0a",
  color: "#ffffff",
  fontSize: "0.85rem",
  letterSpacing: "1px"
}}>
  © 2026 All Rights Reserved <br></br>Developed by <strong>K PRANAV ESWAR</strong><br></br>Presented by <strong>BROCODES 2025-27</strong>
</footer>
    </div>
  );
}