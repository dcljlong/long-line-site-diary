import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

export function ScrollArea({ className = "", children, ...props }) {
  return (
    <div className={cx("overflow-auto", className)} {...props}>
      {children}
    </div>
  );
}
