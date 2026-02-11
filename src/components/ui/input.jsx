import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

export const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cx(
        "h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400",
        className
      )}
      {...props}
    />
  );
});
