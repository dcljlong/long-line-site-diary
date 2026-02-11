import React from "react";
const cx = (...a) => a.filter(Boolean).join(" ");

export function Card({ className = "", ...props }) {
  return <div className={cx("rounded-xl border border-black/10 bg-white shadow-sm", className)} {...props} />;
}
export function CardHeader({ className = "", ...props }) {
  return <div className={cx("p-4 pb-2", className)} {...props} />;
}
export function CardTitle({ className = "", ...props }) {
  return <h3 className={cx("text-base font-semibold leading-none", className)} {...props} />;
}
export function CardDescription({ className = "", ...props }) {
  return <p className={cx("text-sm text-slate-600", className)} {...props} />;
}
export function CardContent({ className = "", ...props }) {
  return <div className={cx("p-4 pt-2", className)} {...props} />;
}
export function CardFooter({ className = "", ...props }) {
  return <div className={cx("p-4 pt-2 flex items-center", className)} {...props} />;
}
