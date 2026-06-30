import { useEffect, useMemo, useRef, useState } from "react";
import { Flag, PhoneOff, UserCircle2, Wrench, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { WorkflowGraph, WorkflowNode } from "@/lib/agent-store";

const COL_W = 240;
const COL_GAP = 56;
const ROW_H = 130;
const ROW_GAP = 44;
const NODE_W = 220;
const NODE_H = 96;
const PAD = 80;

function initialPos(n: WorkflowNode) {
  return {
    x: n.col * (COL_W + COL_GAP),
    y: n.row * (ROW_H + ROW_GAP),
  };
}

export function WorkflowCanvas({
  graph,
  compact = false,
}: {
  graph: WorkflowGraph;
  compact?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // viewport transform
  const [view, setView] = useState({ x: 40, y: 40, k: 1 });

  // node positions (draggable)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const out: Record<string, { x: number; y: number }> = {};
    graph.nodes.forEach((n) => (out[n.id] = initialPos(n)));
    return out;
  });

  useEffect(() => {
    setPositions((prev) => {
      const out = { ...prev };
      graph.nodes.forEach((n) => {
        if (!out[n.id]) out[n.id] = initialPos(n);
      });
      return out;
    });
  }, [graph]);

  const bounds = useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    Object.values(positions).forEach((p) => {
      maxX = Math.max(maxX, p.x + NODE_W);
      maxY = Math.max(maxY, p.y + NODE_H);
    });
    return { w: maxX + PAD * 2, h: maxY + PAD * 2 };
  }, [positions]);

  // panning
  const panRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  function onCanvasMouseDown(e: React.MouseEvent) {
    // ignore if on node
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    panRef.current = { startX: e.clientX, startY: e.clientY, ox: view.x, oy: view.y };
  }
  function onMouseMove(e: React.MouseEvent) {
    if (panRef.current) {
      const { ox, oy, startX, startY } = panRef.current;
      setView((v) => ({
        ...v,
        x: ox + (e.clientX - startX),
        y: oy + (e.clientY - startY),
      }));
    }
    if (dragRef.current) {
      const { id, ox, oy, startX, startY } = dragRef.current;
      const dx = (e.clientX - startX) / view.k;
      const dy = (e.clientY - startY) / view.k;
      setPositions((p) => ({
        ...p,
        [id]: {
          x: ox + dx,
          y: oy + dy,
        },
      }));
    }
  }
  function onMouseUp() {
    panRef.current = null;
    dragRef.current = null;
  }

  // node dragging
  const dragRef = useRef<{ id: string; startX: number; startY: number; ox: number; oy: number } | null>(null);
  function onNodeMouseDown(e: React.MouseEvent, n: WorkflowNode) {
    e.stopPropagation();
    const p = positions[n.id];
    dragRef.current = { id: n.id, startX: e.clientX, startY: e.clientY, ox: p.x, oy: p.y };
    setSelected(n.id);
  }

  // wheel zoom
  function onWheel(e: React.WheelEvent) {
    if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 20) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setView((v) => {
      const k = Math.max(0.4, Math.min(2.2, v.k * factor));
      // zoom around cursor
      const nx = mx - (mx - v.x) * (k / v.k);
      const ny = my - (my - v.y) * (k / v.k);
      return { x: nx, y: ny, k };
    });
  }

  function zoomBy(factor: number) {
    setView((v) => {
      const k = Math.max(0.4, Math.min(2.2, v.k * factor));
      return { ...v, k };
    });
  }

  function resetView() {
    setView({ x: 40, y: 40, k: 1 });
  }

  function nodeCenter(id: string) {
    const p = positions[id] ?? { x: 0, y: 0 };
    return { x: p.x + NODE_W / 2, y: p.y + NODE_H / 2 };
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
      className="relative w-full overflow-hidden rounded-lg border border-hairline bg-canvas-soft select-none"
      style={{
        backgroundImage: "radial-gradient(circle, oklch(0.86 0.008 60) 1px, transparent 1px)",
        backgroundSize: `${18 * view.k}px ${18 * view.k}px`,
        backgroundPosition: `${view.x}px ${view.y}px`,
        height: compact ? 480 : 640,
        cursor: panRef.current ? "grabbing" : "grab",
      }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
          width: bounds.w,
          height: bounds.h,
        }}
      >
        {/* Edges */}
        <svg className="pointer-events-none absolute inset-0" width={bounds.w} height={bounds.h}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.65 0.010 285)" />
            </marker>
          </defs>
          {graph.edges.map((e, i) => {
            const a = nodeCenter(e.from);
            const b = nodeCenter(e.to);
            const sy = a.y + NODE_H / 2;
            const ey = b.y - NODE_H / 2;
            const midY = (sy + ey) / 2;
            const d = `M ${a.x} ${sy} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${ey}`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="oklch(0.78 0.008 285)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                {e.label && (
                  <foreignObject x={(a.x + b.x) / 2 - 110} y={midY - 14} width="220" height="28">
                    <div className="flex justify-center">
                      <span className="truncate rounded-full bg-heading px-2.5 py-1 text-[10.5px] font-medium text-canvas shadow-sm">
                        ↳ {e.label}
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {graph.nodes.map((n) => {
          const pos = positions[n.id] ?? initialPos(n);
          const isPill = n.kind === "start" || n.kind === "end";
          if (isPill) {
            const Icon = n.kind === "start" ? Flag : PhoneOff;
            return (
              <div
                key={n.id}
                data-node
                onMouseDown={(e) => onNodeMouseDown(e, n)}
                className="absolute cursor-move"
                style={{ left: pos.x + NODE_W / 2 - 50, top: pos.y + NODE_H / 2 - 18 }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-[12px] font-medium text-heading shadow-xs">
                  <Icon className="h-3 w-3 text-secondary-text" /> {n.label}
                </span>
              </div>
            );
          }
          const isSelected = selected === n.id;
          return (
            <div
              key={n.id}
              data-node
              onMouseDown={(e) => onNodeMouseDown(e, n)}
              onClick={() => setSelected(isSelected ? null : n.id)}
              className={`absolute cursor-move rounded-xl border bg-surface p-3 text-left shadow-xs transition-shadow hover:shadow-md ${
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-hairline"
              }`}
              style={{ left: pos.x, top: pos.y, width: NODE_W, minHeight: NODE_H }}
            >
              <div className="flex items-center gap-1.5">
                <UserCircle2 className="h-3.5 w-3.5 text-secondary-text" />
                <span className="text-[12.5px] font-medium text-heading">{n.label}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-secondary-text">
                {n.description}
              </p>
              {n.toolBadge && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-medium text-primary ring-1 ring-violet-border">
                  <Wrench className="h-2.5 w-2.5" /> +{n.toolBadge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md border border-hairline bg-surface/95 p-1 shadow-sm backdrop-blur">
        <button
          onClick={() => zoomBy(0.9)}
          className="inline-flex h-7 w-7 items-center justify-center rounded text-secondary-text hover:bg-canvas-soft hover:text-heading"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-[36px] text-center text-[11px] font-medium text-secondary-text tabular-nums">
          {Math.round(view.k * 100)}%
        </span>
        <button
          onClick={() => zoomBy(1.1)}
          className="inline-flex h-7 w-7 items-center justify-center rounded text-secondary-text hover:bg-canvas-soft hover:text-heading"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <span className="mx-0.5 h-4 w-px bg-hairline" />
        <button
          onClick={resetView}
          className="inline-flex h-7 items-center justify-center gap-1 rounded px-1.5 text-[11px] text-secondary-text hover:bg-canvas-soft hover:text-heading"
          aria-label="Reset"
        >
          <Maximize2 className="h-3 w-3" /> Fit
        </button>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface/90 px-2 py-1 text-[11px] text-secondary-text backdrop-blur">
        Drag · Scroll to zoom · Drag nodes to rearrange
      </span>
    </div>
  );
}
