import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

export function Slider({ value, defaultValue, min = 0, max = 100, step = 1, onValueChange, className = "", ...props }) {
  const [inner, setInner] = React.useState(Array.isArray(defaultValue) ? defaultValue[0] : (defaultValue ?? min));
  const isControlled = Array.isArray(value);
  const v = isControlled ? value[0] : inner;

  const setValue = (next) => {
    if (!isControlled) setInner(next);
    onValueChange?.([next]);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={(e) => setValue(Number(e.target.value))}
      className={cx("w-full accent-slate-900", className)}
      {...props}
    />
  );
}
