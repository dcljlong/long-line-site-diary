import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

const Ctx = React.createContext(null);

export function Select({ value, defaultValue, onValueChange, children }) {
  const [inner, setInner] = React.useState(defaultValue ?? "");
  const isControlled = typeof value === "string";
  const v = isControlled ? value : inner;

  const setValue = (next) => {
    if (!isControlled) setInner(next);
    onValueChange?.(next);
  };

  return <Ctx.Provider value={{ value: v, setValue }}>{children}</Ctx.Provider>;
}

export function SelectTrigger({ className = "", children, ...props }) {
  // purely visual wrapper for compatibility
  return <div className={cx("w-full", className)} {...props}>{children}</div>;
}

export function SelectValue({ placeholder = "Select…" }) {
  const ctx = React.useContext(Ctx);
  return <span className="text-sm">{ctx?.value ? ctx.value : placeholder}</span>;
}

export function SelectContent({ className = "", children }) {
  // render children directly (we use native <select> in SelectItem)
  return <div className={cx("w-full", className)}>{children}</div>;
}

export function SelectItem({ value, children }) {
  const ctx = React.useContext(Ctx);
  return (
    <option value={value}>
      {children}
    </option>
  );
}

export function NativeSelect({ className = "", ...props }) {
  const ctx = React.useContext(Ctx);
  return (
    <select
      className={cx("h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400", className)}
      value={ctx?.value ?? ""}
      onChange={(e) => ctx?.setValue(e.target.value)}
      {...props}
    />
  );
}
