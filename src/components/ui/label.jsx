import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

export function Label({ className = "", ...props }) {
  return <label className={cx("text-sm font-medium text-slate-800", className)} {...props} />;
}
