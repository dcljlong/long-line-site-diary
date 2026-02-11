import React from "react";

export default function Binder({
  title = "Dashboard Overview",
  dateLabel = "",
  activeTab = "Dashboard",
  onTabChange = () => {},
  children,
}) {
  const tabs = [
    "Dashboard",
    "Diary",
    "Calendar",
    "Projects",
    "Settings",
  ];

  return (
    <div className="binderRoot">
      <div className="binderFrame">
        {/* LEFT COVER */}
        <aside className="binderCover" aria-label="Binder cover" />

        {/* SPINE (SINGLE ELEMENT ONLY) */}
        <div className="binderSpine" aria-label="Binder spine">
          {/* spine disabled */}
        </div>

        {/* RIGHT PAGE (A4-ish) */}
        <main className="binderPageWrap" aria-label="Binder page">
          {/* page holes must be part of the page layer */}
          <div className="binderPageHoles" aria-hidden="true">
            <span className="hole" />
            <span className="hole" />
            <span className="hole" />
            <span className="hole" />
            <span className="hole" />
            <span className="hole" />
          </div>

          <div className="binderPage">
            {children}
          </div>
        </main>

        {/* RIGHT TABS */}
        <nav className="binderTabs" aria-label="Binder tabs">
          {tabs.map((t) => {
            const isActive = t === activeTab;
            return (
              <button
                key={t}
                type="button"
                className={"binderTab" + (isActive ? " isActive" : "")}
                onClick={() => onTabChange(t)}
                title={t}
              >
                <span className="binderTabText">{t}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


