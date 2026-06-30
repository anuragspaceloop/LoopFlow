export function VoiceWaveRibbon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 200"
      className={`pointer-events-none select-none ${className}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="vw1" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#A998FF" stopOpacity="0" />
          <stop offset="20%" stopColor="#A998FF" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#6F5EF7" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#866DFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5647D8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 100 Q150 30 300 100 T600 100 T900 100 T1200 100"
        stroke="url(#vw1)"
        strokeWidth="1.6"
        fill="none"
      >
        <animate
          attributeName="d"
          dur="9s"
          repeatCount="indefinite"
          values="
            M0 100 Q150 30 300 100 T600 100 T900 100 T1200 100;
            M0 100 Q150 160 300 100 T600 100 T900 100 T1200 100;
            M0 100 Q150 30 300 100 T600 100 T900 100 T1200 100
          "
        />
      </path>
      <path
        d="M0 110 Q200 60 400 110 T800 110 T1200 110"
        stroke="url(#vw1)"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      >
        <animate
          attributeName="d"
          dur="11s"
          repeatCount="indefinite"
          values="
            M0 110 Q200 60 400 110 T800 110 T1200 110;
            M0 110 Q200 150 400 110 T800 110 T1200 110;
            M0 110 Q200 60 400 110 T800 110 T1200 110
          "
        />
      </path>
    </svg>
  );
}
