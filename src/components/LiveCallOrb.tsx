import { useEffect, useRef } from "react";

export type CallState = "idle" | "listening" | "thinking" | "speaking";

const STATE_LABEL: Record<CallState, string> = {
  idle: "Idle",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
};

const STATE_DOT: Record<CallState, string> = {
  idle: "bg-status-idle",
  listening: "bg-status-listening",
  thinking: "bg-status-thinking",
  speaking: "bg-status-speaking",
};

export function LiveCallOrb({ state }: { state: CallState }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const live = state === "listening" || state === "speaking";

  useEffect(() => {
    if (videoRef.current) {
      if (state !== "idle") {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [state]);

  return (
    <div className="relative mx-auto flex h-[200px] w-[200px] items-center justify-center sm:h-[220px] sm:w-[220px]">
      {live && (
        <>
          <span
            className="absolute inset-0 rounded-full border border-primary/20 pointer-events-none"
            style={{ animation: "ripple 3.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite" }}
          />
          <span
            className="absolute inset-0 rounded-full border border-primary/15 pointer-events-none"
            style={{ animation: "ripple 3.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.8s infinite" }}
          />
          <span
            className="absolute inset-0 rounded-full border border-primary/10 pointer-events-none"
            style={{ animation: "ripple 3.2s cubic-bezier(0.2, 0.8, 0.2, 1) 1.6s infinite" }}
          />
          <span
            className="absolute inset-0 rounded-full border border-primary/5 pointer-events-none"
            style={{ animation: "ripple 3.2s cubic-bezier(0.2, 0.8, 0.2, 1) 2.4s infinite" }}
          />
        </>
      )}

      <div
        className="relative h-[72%] w-[72%] overflow-hidden rounded-full shadow-md transition-transform duration-700 bg-primary"
        style={{
          transform: state === "speaking" ? "scale(1.05)" : state === "listening" ? "scale(1.02)" : "scale(1)",
        }}
      >
        <video
          ref={videoRef}
          src="/loop.mp4#t=0.1"
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
      </div>

      <span className="absolute bottom-[-26px] left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-heading ring-1 ring-hairline">
        <span className={`h-1.5 w-1.5 rounded-full ${STATE_DOT[state]} ${live ? "animate-pulse" : ""}`} />
        {STATE_LABEL[state]}
      </span>
    </div>
  );
}
