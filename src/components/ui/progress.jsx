import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

export function Progress({ value = 0, className = "" }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-slate-200", className)}>
      <div className="h-full bg-slate-700" style={{ width: `${pct}%` }} />
    </div>
  );
}
