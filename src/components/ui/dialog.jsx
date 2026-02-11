import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

const Ctx = React.createContext(null);

export function Dialog({ open, defaultOpen, onOpenChange, children }) {
  const [inner, setInner] = React.useState(!!defaultOpen);
  const isControlled = typeof open === "boolean";
  const o = isControlled ? open : inner;

  const setOpen = (next) => {
    if (!isControlled) setInner(next);
    onOpenChange?.(next);
  };

  return <Ctx.Provider value={{ open: o, setOpen }}>{children}</Ctx.Provider>;
}

export function DialogTrigger({ children }) {
  const ctx = React.useContext(Ctx);
  const child = React.Children.only(children);
  return React.cloneElement(child, { onClick: () => ctx?.setOpen(true) });
}

export function DialogClose({ children }) {
  const ctx = React.useContext(Ctx);
  const child = React.Children.only(children);
  return React.cloneElement(child, { onClick: () => ctx?.setOpen(false) });
}

export function DialogContent({ className = "", children }) {
  const ctx = React.useContext(Ctx);
  if (!ctx?.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => ctx.setOpen(false)} />
      <div className={cx("relative z-10 w-[95vw] max-w-lg rounded-2xl bg-white p-4 shadow-xl border border-black/10", className)}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className = "", ...props }) {
  return <div className={cx("mb-3", className)} {...props} />;
}
export function DialogTitle({ className = "", ...props }) {
  return <h2 className={cx("text-base font-semibold", className)} {...props} />;
}
export function DialogDescription({ className = "", ...props }) {
  return <p className={cx("text-sm text-slate-600", className)} {...props} />;
}
export function DialogFooter({ className = "", ...props }) {
  return <div className={cx("mt-4 flex items-center justify-end gap-2", className)} {...props} />;
}
