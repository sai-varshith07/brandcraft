import { useState, useEffect, useRef } from "react";

export function YetiCharacter() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState(0);
  const [distanceToMouse, setDistanceToMouse] = useState(1000);
  const yetiRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (yetiRef.current) {
        const rect = yetiRef.current.getBoundingClientRect();
        const yetiCenterX = rect.left + rect.width / 2;
        const yetiCenterY = rect.top + rect.height / 2;

        // Calculate distance
        const dx = e.clientX - yetiCenterX;
        const dy = e.clientY - yetiCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        setDistanceToMouse(distance);

        // Calculate tilt angle (body leans toward mouse)
        const angle = Math.atan2(dy, dx);
        const tiltAmount = Math.max(-15, Math.min(15, (angle * 180) / Math.PI - 90));
        setTilt(tiltAmount);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate eye gaze based on mouse position
  const getEyePosition = (eyeX, eyeY) => {
    if (!yetiRef.current) return { x: 0, y: 0 };

    const rect = yetiRef.current.getBoundingClientRect();
    const yetiCenterX = rect.left + rect.width / 2;
    const yetiCenterY = rect.top + rect.height / 2;

    const dx = mousePos.x - yetiCenterX;
    const dy = mousePos.y - yetiCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxGaze = 8;

    if (distance === 0) return { x: 0, y: 0 };

    return {
      x: (dx / distance) * maxGaze,
      y: (dy / distance) * maxGaze,
    };
  };

  const leftEye = getEyePosition(-30, -25);
  const rightEye = getEyePosition(30, -25);
  const isStartled = distanceToMouse < 250;
  const eyeScale = isStartled ? 1.2 : 1;

  return (
    <div
      ref={yetiRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1000px",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.05) translateY(-8px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .yeti-body {
          animation: breathe 3s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .yeti-head {
          animation: bounce 3s ease-in-out infinite;
        }
      `}</style>

      <svg
        width="280"
        height="320"
        viewBox="0 0 280 320"
        style={{
          filter: "drop-shadow(0 10px 30px rgba(0, 150, 255, 0.2))",
          transform: `rotateZ(${tilt}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Body */}
        <g className="yeti-body">
          {/* Fluffy torso */}
          <ellipse cx="140" cy="200" rx="80" ry="95" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="2" />
          <ellipse cx="140" cy="200" rx="75" ry="88" fill="#F0F8FB" opacity="0.7" />

          {/* Belly fluff */}
          <circle cx="130" cy="210" r="12" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="1" />
          <circle cx="150" cy="215" r="10" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="1" />
          <circle cx="140" cy="230" r="11" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="1" />

          {/* Arms */}
          <g>
            {/* Left arm */}
            <ellipse cx="75" cy="190" rx="25" ry="50" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="2" />
            <circle cx="65" cy="240" r="18" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="2" />

            {/* Right arm */}
            <ellipse cx="205" cy="190" rx="25" ry="50" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="2" />
            <circle cx="215" cy="240" r="18" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="2" />
          </g>

          {/* Legs */}
          <g>
            {/* Left leg */}
            <ellipse cx="110" cy="275" rx="22" ry="35" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="2" />
            <ellipse cx="110" cy="305" rx="28" ry="18" fill="#D0EBF5" stroke="#B8E5F5" strokeWidth="2" />

            {/* Right leg */}
            <ellipse cx="170" cy="275" rx="22" ry="35" fill="#E8F4F8" stroke="#B8E5F5" strokeWidth="2" />
            <ellipse cx="170" cy="305" rx="28" ry="18" fill="#D0EBF5" stroke="#B8E5F5" strokeWidth="2" />
          </g>
        </g>

        {/* Head */}
        <g className="yeti-head">
          {/* Head circle */}
          <circle cx="140" cy="90" r="65" fill="#F0F8FB" stroke="#B8E5F5" strokeWidth="2" />
          <circle cx="140" cy="85" r="62" fill="#E8F4F8" opacity="0.6" />

          {/* Top tuft */}
          <ellipse cx="140" cy="30" rx="35" ry="28" fill="#F0F8FB" stroke="#B8E5F5" strokeWidth="1.5" />
          <ellipse cx="120" cy="25" rx="16" ry="20" fill="#F0F8FB" stroke="#B8E5F5" strokeWidth="1" />
          <ellipse cx="160" cy="28" rx="16" ry="22" fill="#F0F8FB" stroke="#B8E5F5" strokeWidth="1" />

          {/* Eyes */}
          <g>
            {/* Left eye white */}
            <ellipse
              cx={110 + leftEye.x}
              cy={75 + leftEye.y}
              rx={isStartled ? 16 : 14}
              ry={isStartled ? 18 : 16}
              fill="white"
              stroke="#B8E5F5"
              strokeWidth="2"
              style={{ transition: "all 0.1s ease-out" }}
            />
            {/* Left pupil */}
            <circle
              cx={110 + leftEye.x}
              cy={78 + leftEye.y}
              r={isStartled ? 8 : 7}
              fill="#0066CC"
              style={{ transition: "all 0.1s ease-out" }}
            />
            {/* Left pupil shine */}
            <circle cx={112 + leftEye.x} cy={75 + leftEye.y} r="2.5" fill="white" />

            {/* Right eye white */}
            <ellipse
              cx={170 + rightEye.x}
              cy={75 + rightEye.y}
              rx={isStartled ? 16 : 14}
              ry={isStartled ? 18 : 16}
              fill="white"
              stroke="#B8E5F5"
              strokeWidth="2"
              style={{ transition: "all 0.1s ease-out" }}
            />
            {/* Right pupil */}
            <circle
              cx={170 + rightEye.x}
              cy={78 + rightEye.y}
              r={isStartled ? 8 : 7}
              fill="#0066CC"
              style={{ transition: "all 0.1s ease-out" }}
            />
            {/* Right pupil shine */}
            <circle cx={172 + rightEye.x} cy={75 + rightEye.y} r="2.5" fill="white" />
          </g>

          {/* Eyebrows */}
          <g style={{ opacity: isStartled ? 0.8 : 0.5, transition: "opacity 0.1s ease-out" }}>
            <path
              d="M 95 65 Q 110 58 125 62"
              stroke="#B8E5F5"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 155 62 Q 170 58 185 65"
              stroke="#B8E5F5"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Snout */}
          <ellipse cx="140" cy="115" rx="32" ry="28" fill="#F5FAFC" stroke="#B8E5F5" strokeWidth="2" />

          {/* Nose */}
          <ellipse cx="140" cy="108" rx="10" ry="8" fill="#87CEEB" stroke="#6BB4DB" strokeWidth="1.5" />

          {/* Mouth */}
          <path
            d="M 140 115 Q 135 122 128 120 M 140 115 Q 145 122 152 120"
            stroke="#6BB4DB"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Accent glow circle behind yeti */}
        <circle
          cx="140"
          cy="150"
          r="120"
          fill="none"
          stroke="rgba(135, 206, 235, 0.1)"
          strokeWidth="1"
          opacity={isStartled ? 1 : 0.3}
          style={{ transition: "opacity 0.2s ease-out" }}
        />
      </svg>
    </div>
  );
}
