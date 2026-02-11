const tabs = [
  { label: "Dashboard", key: "dashboard", color: "bg-blue-600" },
  { label: "Diary",     key: "diary",     color: "bg-purple-600" },
  { label: "Calendar",  key: "calendar",  color: "bg-emerald-600" },
  { label: "Projects",  key: "projects",  color: "bg-orange-600" },
  { label: "Settings",  key: "settings",  color: "bg-slate-700" },
];

export default function BookTabs({ activeTab, setActiveTab }) {
  return (
    <div className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-30">
      <div className="flex flex-col gap-2 pr-2">
        {tabs.map((tab) => {
          const isActive = (activeTab || "dashboard") === tab.key;

          const base =
            "group relative w-14 h-20 rounded-l-2xl border border-black/10 shadow-lg " +
            "flex items-center justify-center cursor-pointer select-none " +
            "transition-all active:scale-[0.99]";

          const fill = `${tab.color} text-white`;
          const inactive = "opacity-90 hover:opacity-100";
          const active = "ring-2 ring-white/80 -translate-x-2";

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[base, fill, isActive ? active : inactive].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xs font-semibold tracking-wide rotate-90 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
