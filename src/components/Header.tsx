import { Link, useRouterState } from "@tanstack/react-router";

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-30 border-b border-violet-border/40 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="absolute inset-1 rounded-lg bg-white/15 backdrop-blur-sm" />
            <svg viewBox="0 0 24 24" className="relative h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 12h2M9 7v10M14 4v16M19 9v6" />
            </svg>
          </span>
          <span className="text-[15px] font-medium tracking-tight text-heading">
            Prodloop <span className="text-secondary-text">AI</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-secondary-text md:flex">
          <Link
            to="/"
            className={`transition-colors hover:text-heading ${path === "/" ? "text-heading" : ""}`}
          >
            Agents
          </Link>
          <a className="cursor-not-allowed opacity-50" title="Coming soon">Analytics</a>
          <a className="cursor-not-allowed opacity-50" title="Coming soon">Observability</a>
          <a className="cursor-not-allowed opacity-50" title="Coming soon">Simulation</a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-secondary-text md:inline">acme.co</span>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lavender to-primary text-[11px] font-medium text-white flex items-center justify-center">
            AB
          </div>
        </div>
      </div>
    </header>
  );
}
