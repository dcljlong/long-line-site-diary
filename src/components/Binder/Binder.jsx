import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Binder = ({ children, activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  const tabs = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", color: "bg-binder-tabBlue" },
      { id: "sites", label: "Sites", color: "bg-binder-tabOrange" },
      { id: "diary", label: "Diary", color: "bg-binder-tabGreen" },
      { id: "calendar", label: "Calendar", color: "bg-binder-tabPurple" },
      { id: "tasks", label: "Tasks", color: "bg-binder-tabRed" },
      { id: "docs", label: "Docs", color: "bg-binder-tabTeal" },
    ],
    []
  );

  const title = useMemo(
    () => tabs.find((t) => t.id === activeTab)?.label || "Dashboard",
    [tabs, activeTab]
  );

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-AU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  // Asset base:
  // - In your dev + pages setup, assets resolve under /long-line-site-diary/assets/...
  // - Vite's BASE_URL may be "/" in dev, so we derive from current path as fallback.
  const resolveBase = () => {
    const b = (import.meta?.env?.BASE_URL || "").trim();
    if (b && b !== "/") return b.endsWith("/") ? b : b + "/";
    const p = (typeof window !== "undefined" ? window.location.pathname : "/") || "/";
    if (p.startsWith("/long-line-site-diary/")) return "/long-line-site-diary/";
    return "/";
  };

  const base = resolveBase();
  const asset = (p) => base + String(p || "").replace(/^\//, "");

  const openBinder = () => setIsOpen(true);
  const closeBinder = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-gray-300 p-4 md:p-8 flex items-center justify-center">
      <div className="relative w-full max-w-7xl mx-auto">

        {/* CLOSED COVER */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="closed"
              className="relative mx-auto"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <button onClick={openBinder} className="w-full text-left focus:outline-none" title="Open diary">
                <div className="relative overflow-hidden rounded-2xl shadow-binder leather-texture">
                  <picture>
                    <source media="(max-width: 1023px)" srcSet={asset("assets/cover/cover-mobile.webp")} />
                    <img
                      src={asset("assets/cover/cover-desktop.webp")}
                      alt="Diary cover"
                      className="w-full h-[520px] lg:h-[820px] object-cover"
                    />
                  </picture>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <img
                      src={asset("assets/logo/lld-logo-256.webp")}
                      alt="LLD Logo"
                      className="w-20 h-20 lg:w-28 lg:h-28 object-contain drop-shadow"
                    />
                    <div className="mt-4">
                      <div className="font-display text-3xl lg:text-5xl font-bold text-white tracking-wide drop-shadow">
                        LONG LINE
                      </div>
                      <div className="mt-1 text-white/90 text-sm lg:text-base tracking-[0.25em] uppercase">
                        Site Diary
                      </div>
                    </div>

                    <div className="mt-6 text-xs lg:text-sm text-white/80 bg-black/30 px-4 py-2 rounded-full border border-white/20">
                      Click to open
                    </div>
                  </div>

                  <div className="absolute left-0 top-0 bottom-0 w-10 lg:w-14 bg-black/25 backdrop-blur-[1px]" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OPEN BINDER */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="open"
              className="relative"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              {/* Always-visible close */}
              <button
                onClick={closeBinder}
                className="fixed right-4 top-4 z-[60] px-3 py-2 rounded-lg bg-black/60 hover:bg-black/75 text-white text-xs font-semibold border border-white/20 shadow-lg"
                title="Close diary"
              >
                Close
              </button>

              <div className="relative flex">

                {/* LEFT COVER (desktop only) */}
                <motion.div
                  className="hidden lg:block w-80 h-[800px] leather-texture rounded-l-2xl shadow-binder relative overflow-hidden"
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="absolute left-4 top-16 w-6 h-6 rounded-full metal-ring" />
                  <div className="absolute left-4 top-1/2 w-6 h-6 rounded-full metal-ring -translate-y-1/2" />
                  <div className="absolute left-4 bottom-16 w-6 h-6 rounded-full metal-ring" />

                  <div className="absolute inset-8 top-12 bottom-24 bg-gray-900 rounded-lg overflow-hidden shadow-inner">
                    <img
                      src={asset("assets/cover/cover-desktop.webp")}
                      alt="Cover art"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={asset("assets/logo/lld-logo-128.webp")}
                          alt="Logo"
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <h1 className="font-display text-2xl font-bold text-white tracking-wide">LONG LINE</h1>
                          <p className="text-gray-300 text-xs mt-1 tracking-widest uppercase">Site Diary</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs tracking-widest uppercase">Project Management</span>
                  </div>

                  {/* Strap / close control (desktop) */}
                  <button
                    onClick={closeBinder}
                    className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-8 h-28 rounded-r-2xl bg-black/60 border border-white/20 shadow-lg hover:bg-black/70 transition-colors"
                    title="Close diary"
                  >
                    <span className="sr-only">Close</span>
                  </button>
                </motion.div>

                {/* RIGHT PAGE */}
                <div className="flex-1 relative">

                  {/* RINGS (desktop only) */}
                  <div className="hidden lg:flex absolute left-0 top-0 bottom-0 w-16 z-20 flex-col items-center py-12 space-y-24">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="relative">
                        <div className="w-8 h-12 metal-ring rounded-full shadow-lg" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-8 bg-gray-400 rounded-full shadow-inner" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PAGE */}
                  <motion.div
                    className="lg:ml-12 bg-binder-paper min-h-[800px] rounded-2xl lg:rounded-r-2xl shadow-binder relative overflow-hidden"
                    initial={{ x: 18, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                  >
                    {/* HEADER with Mount banner (desktop only) */}
                    <div className="relative overflow-hidden">
                      <div className="hidden lg:block">
                        <img
                          src={asset("assets/cover/cover-desktop.webp")}
                          alt="Header"
                          className="w-full h-[64px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />
                      </div>

                      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 shadow-md relative">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="font-display text-xl font-semibold tracking-wide">{title}</h2>
                          <div className="text-xs text-gray-200">{today}</div>
                        </div>
                      </div>

                      <button
                        onClick={closeBinder}
                        className="lg:hidden absolute right-3 top-3 p-2 rounded-full bg-black/40 hover:bg-black/55 text-white border border-white/20"
                        title="Close diary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6 h-[calc(800px-80px)] overflow-y-auto">
                      {children}
                    </div>

                    {/* PAGE LINES */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-30"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)",
                        backgroundPosition: "0 60px",
                      }}
                    />
                  </motion.div>

                  {/* BOOK TABS (desktop only) */}
                  <div className="hidden lg:flex absolute right-[-96px] top-24 bottom-24 flex-col justify-center gap-3 z-30">
                    {tabs.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <motion.button
                          key={tab.id}
                          onClick={() => onTabChange(tab.id)}
                          className={[
                            tab.color,
                            "text-white font-semibold",
                            isActive ? "text-sm py-5 w-28" : "text-xs py-3 w-24",
                            "px-4 rounded-l-lg shadow-md transition-all duration-200 ease-in-out",
                            isActive ? "scale-105 ring-2 ring-white" : "hover:translate-x-1",
                          ].join(" ")}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tab.label}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* MOBILE TABS */}
                  <div className="lg:hidden mt-4">
                    <div className="flex overflow-x-auto space-x-2 pb-2">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => onTabChange(tab.id)}
                          className={`${tab.color} text-white px-4 py-2 rounded-full text-xs font-semibold shrink-0`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Binder;
