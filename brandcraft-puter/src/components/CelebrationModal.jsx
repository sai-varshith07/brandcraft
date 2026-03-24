import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export function CelebrationModal({ isOpen, onClose }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const motivationMessages = [
    "🌟 Your brand is now ready to shine! Go conquer the world!",
    "🚀 Amazing work! Your brand identity is complete—let's make it legendary!",
    "✨ Congratulations! You've created something truly special!",
    "🎯 Perfect! Your brand is ready to make an impact!",
    "💎 Fantastic! Your unique brand voice is now set in stone!",
  ];

  const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];

  return (
    <>
      {showConfetti && <Confetti recycle={true} numberOfPieces={100} />}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <div
          className="card"
          style={{
            maxWidth: 500,
            width: "90%",
            padding: 48,
            borderRadius: 24,
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(78,205,196,0.3)",
            border: "2px solid var(--teal)",
            background: "linear-gradient(135deg, rgba(78,205,196,0.1) 0%, rgba(124,77,255,0.1) 100%)",
            animation: "slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Celebration Icon */}
          <div style={{ fontSize: 80, marginBottom: 20, animation: "bounce 1s ease-in-out infinite" }}>
            🎉
          </div>

          {/* Main Message */}
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              background: "linear-gradient(135deg, var(--teal) 0%, var(--purple) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 12,
            }}
          >
            Congratulations!
          </h1>

          {/* Motivation Message */}
          <p
            style={{
              fontSize: 18,
              color: "var(--text)",
              lineHeight: 1.8,
              marginBottom: 32,
              fontWeight: 500,
            }}
          >
            {randomMessage}
          </p>

          {/* Achievement Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 32,
              background: "rgba(255,255,255,0.4)",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--teal)" }}>7</div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>Assets Selected</div>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--teal)" }}>✓</div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>Complete</div>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--teal)" }}>📥</div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>PDF Ready</div>
            </div>
          </div>

          {/* Additional Motivational Text */}
          <div
            style={{
              padding: 16,
              background: "rgba(78,205,196,0.1)",
              borderRadius: 12,
              marginBottom: 24,
              borderLeft: "4px solid var(--teal)",
            }}
          >
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
              Your brand PDF is ready to download. Share your unique brand identity with the world and watch your business grow! 🚀
            </p>
          </div>

          {/* Close Button */}
          <button
            className="btn-primary"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
            }}
          >
            <span>🎊 Awesome! Let's Go!</span>
          </button>
        </div>

        <style>{`
          @keyframes slideUp {
            from {
              transform: translateY(30px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    </>
  );
}
