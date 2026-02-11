import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

export function Switch({ checked, defaultChecked, onCheckedChange, onChange, className = "", ...props }) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const isControlled = typeof checked === "boolean";
  const val = isControlled ? checked : inner;

  const setVal = (next) => {
    if (!isControlled) setInner(next);
    if (typeof onCheckedChange === "function") onCheckedChange(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={val}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full border border-black/10 transition",
        val ? "bg-slate-900" : "bg-slate-300",
        className
      )}
      onClick={() => setVal(!val)}
      {...props}
    >
      <span
        className={cx(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
          val ? "translate-x-5" : "translate-x-1"
        )}
      />
      <input
        type="checkbox"
        checked={val}
        onChange={(e) => {
          onChange?.(e);
          setVal(e.target.checked);
        }}
        className="sr-only"
      />
    </button>
  );
}
