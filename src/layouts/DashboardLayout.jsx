import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function DashboardLayout({ children, title = "Dashboard Overview" }) {
  const dateText = new Date().toLocaleDateString("en-NZ", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [hash, setHash] = useState(() =>
    (window.location.hash || "#dashboard").replace("#", "")
  );

  useEffect(() => {
    const onHash = () => setHash((window.location.hash || "#dashboard").replace("#", ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Full-colour tab fills (inactive still filled; active "pops")
  const tabTone = {
    dashboard: { fill: "bg-blue-600", border: "border-blue-700" },
    diary: { fill: "bg-purple-600", border: "border-purple-700" },
    calendar: { fill: "bg-teal-600", border: "border-teal-700" },
    projects: { fill: "bg-orange-600", border: "border-orange-700" },
    tasks: { fill: "bg-rose-600", border: "border-rose-700" },
    docs: { fill: "bg-indigo-600", border: "border-indigo-700" },
    settings: { fill: "bg-slate-700", border: "border-slate-800" },
  };

  const tabs = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Diary", key: "diary" },
    { label: "Calendar", key: "calendar" },
    { label: "Projects", key: "projects" },
    { label: "Tasks", key: "tasks" },
    { label: "Docs", key: "docs" },
    { label: "Settings", key: "settings" },
  ];

  const canBack = (hash || "dashboard") !== "dashboard";

  const back = () => {
    window.location.hash = "dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Raised picture header (replaces old top bar visually) */}
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 pt-4">
        <header className="relative overflow-hidden rounded-2xl border border-black/10 shadow-xl">
          <div className="absolute inset-0">
            <img
              src="assets/header/header-strip.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={back}
                disabled={!canBack}
                title="Back"
                className={[
                  "shrink-0 p-2 rounded-xl border transition-all",
                  canBack
                    ? "bg-white/10 border-white/15 hover:bg-white/15"
                    : "bg-white/5 border-white/10 opacity-50 cursor-not-allowed",
                ].join(" ")}
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              <div className="min-w-0">
                <div className="text-[11px] md:text-xs text-white/85 truncate">
                  Long Line Site Diary
                </div>
                <div className="text-base md:text-xl font-semibold tracking-wide text-white truncate">
                  {title}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <div className="text-[11px] md:text-xs text-white/90 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5">
                {dateText}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Page frame */}
      <main className="relative max-w-[1180px] mx-auto px-4 md:px-6 pb-10 mt-4">
        <div className="bg-slate-50 border border-black/10 rounded-2xl shadow-xl p-4 md:p-5 relative">
          {children}

          {/* Right-edge tabs: attached to page card edge */}
          <div className="absolute top-6 right-0 translate-x-full hidden lg:flex flex-col z-[60] pointer-events-auto">
            {tabs.map((t) => {
              const active = (hash || "dashboard") === t.key;
              const tone = tabTone[t.key] || tabTone.dashboard;

              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    window.location.hash = t.key;
                  }}
                  className={[
                    // Tabs shorter so card reads taller than tab stack
                    "mb-2 px-3 py-2 rounded-l-2xl border text-[13px] font-semibold tracking-wide w-11",
                    "cursor-pointer select-none",
                    "transition-all duration-150",
                    // Full colour fills always
                    tone.fill,
                    tone.border,
                    "text-white",
                    // Strong active pop + clear selection marker
                    active
                      ? "opacity-100 shadow-2xl -translate-x-6 scale-[1.08] ring-2 ring-white/90 ring-offset-2 ring-offset-slate-50 w-16"
                      : "opacity-70 shadow-md hover:opacity-95 hover:-translate-x-2 w-11",
                  ].join(" ")}
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

