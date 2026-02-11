import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

export const Textarea = React.forwardRef(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cx(
        "min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400",
        className
      )}
      {...props}
    />
  );
});
