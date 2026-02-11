import React from "react";

const cx = (...a) => a.filter(Boolean).join(" ");

export const Button = React.forwardRef(function Button(
  { className = "", variant = "default", size = "default", type = "button", ...props },
  ref
) {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
    outline: "border border-slate-300 bg-white hover:bg-slate-50",
    ghost: "bg-transparent hover:bg-slate-100",
    destructive: "bg-rose-600 text-white hover:bg-rose-700",
    link: "bg-transparent underline underline-offset-4 hover:no-underline",
  };

  const sizes = {
    default: "h-9 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-sm",
    lg: "h-10 px-6 text-sm",
    icon: "h-9 w-9 p-0",
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        "inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
      )}
      {...props}
    />
  );
});
