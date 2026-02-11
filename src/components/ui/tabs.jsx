import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

const TabsCtx = React.createContext(null);

export function Tabs({ value, defaultValue, onValueChange, className = "", children, ...props }) {
  const [inner, setInner] = React.useState(defaultValue);
  const isControlled = typeof value === "string";
  const v = isControlled ? value : inner;

  const setValue = (next) => {
    if (!isControlled) setInner(next);
    onValueChange?.(next);
  };

  return (
    <TabsCtx.Provider value={{ value: v, setValue }}>
      <div className={cx("w-full", className)} {...props}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className = "", ...props }) {
  return <div className={cx("inline-flex items-center rounded-lg bg-slate-100 p-1", className)} {...props} />;
}

export function TabsTrigger({ value, className = "", children, ...props }) {
  const ctx = React.useContext(TabsCtx);
  const active = ctx?.value === value;

  return (
    <button
      type="button"
      className={cx(
        "px-3 py-1.5 text-sm rounded-md transition",
        active ? "bg-white shadow text-slate-900" : "text-slate-700 hover:bg-white/60",
        className
      )}
      onClick={() => ctx?.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className = "", children, ...props }) {
  const ctx = React.useContext(TabsCtx);
  if (ctx?.value !== value) return null;
  return <div className={cx("mt-3", className)} {...props}>{children}</div>;
}
