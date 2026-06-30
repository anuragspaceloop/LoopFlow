import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  AudioLines,
  BarChart3,
  Activity,
  Settings,
  Plug,
  PhoneCall,
  BookOpen,
  PanelLeft,
  PanelLeftClose,
  Plus,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Agents", icon: AudioLines, active: (p: string) => p === "/" || p.startsWith("/agent") || p.startsWith("/build") || p === "/new" },
  { to: "/", label: "Calls", icon: PhoneCall, disabled: true },
  { to: "/", label: "Knowledge", icon: BookOpen, disabled: true },
  { to: "/", label: "Integrations", icon: Plug, disabled: true },
  { to: "/", label: "Analytics", icon: BarChart3, disabled: true },
  { to: "/", label: "Observability", icon: Activity, disabled: true },
];

const STORAGE_KEY = "prodloop.sidebar.open";

export function AppShell({ children, topbar }: { children: ReactNode; topbar?: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  // Closed by default (icon rail)
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "1") setOpen(true);
    } catch {}
  }, []);

  function toggle() {
    setOpen((o) => {
      const next = !o;
      try { localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-canvas">
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-hairline bg-canvas-soft/80 backdrop-blur-xl transition-[width] duration-200 ease-out md:flex ${
          open ? "w-56" : "w-[60px]"
        }`}
      >
        <div className={`flex h-14 items-center ${open ? "px-4" : "justify-center px-2"}`}>
          {open ? (
            <>
              <img src="/prodloop-logo.png" alt="Prodloop" className="h-5 w-auto object-contain" />
              <button
                onClick={toggle}
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-text transition-colors hover:bg-surface hover:text-heading"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="relative group flex items-center justify-center cursor-pointer rounded-md overflow-hidden" onClick={toggle}>
              <img src="/prodloop-icon.png" alt="Prodloop" className="h-5 w-auto object-contain" />
              <div className="absolute inset-0 flex items-center justify-center bg-canvas-soft/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <PanelLeft className="h-4 w-4 text-heading" />
              </div>
            </div>
          )}
        </div>

        <nav className={`flex-1 space-y-0.5 ${open ? "px-2 pt-2" : "px-2 pt-2"}`}>
          <Link
            to="/new"
            className={`group relative mb-2 flex items-center rounded-md text-[13px] font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 ${
              open ? "h-9 pr-2.5" : "h-9 w-9"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
            {open && <span>New agent</span>}
            {!open && (
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-heading px-2 py-1 text-[11px] font-medium text-canvas opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
                New agent
              </span>
            )}
          </Link>

          {NAV.map((item) => {
            const isActive = !item.disabled && item.active?.(path);
            const Icon = item.icon;
            const base = `group relative flex items-center rounded-md text-[13px] transition-colors ${
              open ? "h-9 pr-2.5" : "h-9 w-9"
            }`;
            const state = isActive
              ? "bg-primary-soft text-primary ring-1 ring-violet-border"
              : item.disabled
              ? "text-muted-text/70 cursor-not-allowed"
              : "text-body hover:bg-surface hover:text-heading";
            const cls = `${base} ${state}`;
            const content = (
              <>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                {open && <span>{item.label}</span>}
                {!open && (
                  <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-heading px-2 py-1 text-[11px] font-medium text-canvas opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
                    {item.label}
                  </span>
                )}
              </>
            );
            return item.disabled ? (
              <div key={item.label} className={cls} title={item.label}>{content}</div>
            ) : (
              <Link key={item.label} to={item.to} className={cls}>{content}</Link>
            );
          })}
        </nav>

        <div className={`border-t border-hairline ${open ? "p-2" : "p-2"}`}>
          <div className={`flex items-center rounded-md ${open ? "gap-2 px-2 py-1.5" : "justify-center"}`}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
              AB
            </div>
            {open && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-heading">Alex Brewer</p>
                <p className="truncate text-[11px] text-muted-text">acme.co</p>
              </div>
            )}
            {open && (
              <button className="rounded-md p-1 text-muted-text hover:bg-canvas hover:text-heading" aria-label="Settings">
                <Settings className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className={`transition-[padding] duration-200 ${open ? "md:pl-56" : "md:pl-[60px]"}`}>
        {topbar}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function TopBar({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-hairline bg-canvas/85 px-6 backdrop-blur-xl">
      {children}
    </header>
  );
}
