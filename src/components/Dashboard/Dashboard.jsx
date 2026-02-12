import React, { useMemo, useState } from "react";
import { AlertTriangle, Calendar as CalIcon, ClipboardList, CloudSun, TrendingUp, Users } from "lucide-react";

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const fmtShort = (d) =>
  new Date(d).toLocaleDateString("en-NZ", { weekday: "short", day: "numeric", month: "numeric" });

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" });

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

// Monday week start (Mon=0..Sun=6)
const startOfWeekMon = (d) => {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
};

const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();
const isSameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const Card = ({ title, tone = "blue", icon: Icon, right, children, className = "" }) => {
  const toneMap = {
    blue: "from-slate-700 to-slate-800",
    red: "from-rose-700 to-rose-800",
    teal: "from-teal-700 to-teal-800",
    gray: "from-slate-600 to-slate-700",
  };

  return (
    <div
      className={[
        "bg-slate-50 rounded-2xl shadow-lg border border-slate-200 overflow-hidden",
        "ring-1 ring-black/5",
        className,
      ].join(" ")}
    >
      <div className={["px-4 py-2 text-white bg-gradient-to-r", toneMap[tone] || toneMap.blue].join(" ")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {Icon ? <Icon className="w-4 h-4 opacity-90" /> : null}
            <div className="font-semibold text-sm tracking-wide truncate">{title}</div>
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

const ProgressRow = ({ label, value = 0 }) => {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-700">
        <div className="truncate pr-2">{label}</div>
        <div className="tabular-nums">{pct}%</div>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-slate-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const Segmented = ({ value, onChange }) => {
  const opts = [
    { k: "day", label: "Day" },
    { k: "week", label: "Week" },
    { k: "month", label: "Month" },
  ];

  return (
    <div className="inline-flex rounded-lg border border-white/15 bg-white/10 p-1">
      {opts.map((o) => {
        const active = value === o.k;
        return (
          <button
            key={o.k}
            type="button"
            onClick={() => onChange(o.k)}
            className={[
              "px-2 py-1 text-[11px] rounded-md font-semibold transition-colors",
              active ? "bg-white text-slate-900" : "text-white/85 hover:text-white",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

const Dashboard = ({ sites = [], tasks = [], onNavigate }) => {
  const [calMode, setCalMode] = useState("week");
  const today = startOfDay(new Date());

  const derived = useMemo(() => {
    const t = (tasks || []).map((x) => {
      const due = x.dueDate || x.due || x.date || null;
      const dueDate = due ? new Date(due) : null;

      const prRaw = (x.priority || x.pr || "").toString().toLowerCase();
      let pr = "Normal";
      if (prRaw === "urgent" || prRaw === "critical") pr = "Urgent";
      else if (prRaw === "high") pr = "High";
      else if (prRaw === "low") pr = "Normal";
      if (typeof x.priority === "number") {
        if (x.priority <= 1) pr = "Urgent";
        else if (x.priority === 2) pr = "High";
        else pr = "Normal";
      }

      const st = (x.status || '').toString().toLowerCase();
      const isDone = (st === 'complete') || !!(x.done || false || x.isDone);
      const isOverdue = !isDone && dueDate && startOfDay(dueDate) < today;

      return { ...x, dueDate, pr, isDone, isOverdue };
    });

    const open = t.filter((x) => !x.isDone);

    const overdue = open
      .filter((x) => x.isOverdue)
      .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));

    const urgent = open
      .filter((x) => x.pr === "Urgent" && !x.isOverdue)
      .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));

    const high = open
      .filter((x) => x.pr === "High")
      .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));

    const upcoming = open
      .filter((x) => x.dueDate && startOfDay(x.dueDate) >= today)
      .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
      .slice(0, 6);

    const dueToday = open
      .filter((x) => x.dueDate && isSameDay(x.dueDate, today))
      .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));

    // Week (Mon..Sun) summary counts
    const week = [];
    const weekStart = startOfWeekMon(today);
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const count = open.filter((x) => x.dueDate && isSameDay(x.dueDate, d)).length;
      week.push({ d, count });
    }

    // Month mini-grid (Mon-start) with task counts
    const mStart = startOfMonth(today);
    const mEnd = endOfMonth(today);
    const gridStart = startOfWeekMon(mStart);
    const days = [];
    const cursor = new Date(gridStart);

    // Always render 6 weeks (42 cells) for stability
    for (let i = 0; i < 42; i++) {
      const d = new Date(cursor);
      const count = open.filter((x) => x.dueDate && isSameDay(x.dueDate, d)).length;
      days.push({ d, count });
      cursor.setDate(cursor.getDate() + 1);
    }

    return {
      overdue,
      urgent,
      high,
      upcoming,
      dueToday,
      openCount: open.length,
      week,
      month: { mStart, mEnd, days },
    };
  }, [tasks, today]);

  const stats = useMemo(() => {
    const totalTasks = (tasks || []).length;
    const openTasks = derived.openCount;
    const missed = derived.overdue.length;
    const daysUntilNextSite = sites.length ? 1 : 0;
    return { totalTasks, openTasks, missed, daysUntilNextSite };
  }, [tasks, sites, derived]);

  const projects = useMemo(() => {
    return (sites || []).slice(0, 5).map((s, idx) => ({
      id: s.id,
      name: s.name || "Site",
      sub: s.address || "",
      a: 6 + idx,
      b: 12 + idx * 2,
    }));
  }, [sites]);

  const progress = useMemo(() => {
    return (sites || []).slice(0, 5).map((s, idx) => {
      const siteTasks = (tasks || []).filter((t) => (t.jobId === s.id));
      const done = siteTasks.filter((t) => ((t.status || '').toString().toLowerCase() === 'complete') ).length;
      const total = siteTasks.length || 0;
      const pct = total ? Math.round((done / total) * 100) : Math.max(35, 72 - idx * 7);
      return { id: s.id, name: s.name || "Site", pct };
    });
  }, [sites, tasks]);

  const activity = useMemo(() => {
    const items = [...derived.overdue.slice(0, 2), ...derived.upcoming.slice(0, 3)];
    return items.map((x, i) => ({
      id: x.id || `${i}`,
      line1: x.isOverdue ? "Overdue task" : "Upcoming task",
      line2: x.title || x.name || "Task",
      meta: x.dueDate ? `${fmtShort(x.dueDate)} ${fmtTime(x.dueDate)}` : "",
    }));
  }, [derived]);

  const goTasks = () => onNavigate && onNavigate("tasks");
  const goSites = () => onNavigate && onNavigate("diary");

  const calendarRight = <Segmented value={calMode} onChange={setCalMode} />;

  return (
    <div className="dashboard-root space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT COLUMN */}
        <div className="col-span-12 xl:col-span-5 space-y-4">
          <Card title="Calendar" tone="blue" icon={CalIcon} right={calendarRight}>
            {calMode === "day" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-800">{fmtShort(today)}</div>
                  <div className="text-xs text-slate-600 tabular-nums">{derived.dueToday.length} due today</div>
                </div>

                <div className="space-y-2">
                  {derived.dueToday.slice(0, 6).map((t) => (
                    <div key={t.id || t.title} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{t.title || "Task"}</div>
                        <div className="text-xs text-slate-600 truncate">{t.siteName || t.site || ""}</div>
                      </div>
                      <div className="text-xs text-slate-600 whitespace-nowrap">
                        {t.dueDate ? fmtTime(t.dueDate) : ""}
                      </div>
                    </div>
                  ))}
                  {derived.dueToday.length === 0 && (
                    <div className="text-sm text-slate-600">No tasks due today.</div>
                  )}
                </div>

                <div className="pt-1">
                  <button onClick={goTasks} className="text-xs text-slate-700 underline underline-offset-2">
                    View tasks
                  </button>
                </div>
              </div>
            )}

            {calMode === "week" && (
              <>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {derived.week.map(({ d, count }) => (
                    <div key={d.toISOString()} className="space-y-2">
                      <div className="text-[11px] text-slate-600">
                        {d.toLocaleDateString("en-NZ", { weekday: "narrow" })}
                      </div>
                      <div className="text-sm font-semibold text-slate-800">{d.getDate()}</div>
                      <div className="h-2 flex items-center justify-center">
                        {count > 0 ? (
                          <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-200 inline-block" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-4 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-slate-700 inline-block" />
                    Has tasks
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-slate-200 inline-block" />
                    None
                  </span>
                </div>
              </>
            )}

            {calMode === "month" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-800">
                    {today.toLocaleDateString("en-NZ", { month: "long", year: "numeric" })}
                  </div>
                  <div className="text-xs text-slate-600">dots = tasks due</div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {["M", "T", "W", "T", "F", "S", "S"].map((x) => (
                    <div key={x} className="text-[11px] font-semibold text-slate-600 py-1">
                      {x}
                    </div>
                  ))}

                  {derived.month.days.map(({ d, count }) => {
                    const inMonth = isSameMonth(d, today);
                    const isT = isSameDay(d, today);

                    return (
                      <div
                        key={d.toISOString()}
                        className={[
                          "rounded-lg border border-slate-200 bg-white px-1 py-1 min-h-[38px]",
                          inMonth ? "" : "opacity-40",
                          isT ? "ring-2 ring-blue-600" : "",
                        ].join(" ")}
                      >
                        <div className="text-[11px] font-semibold text-slate-700">{d.getDate()}</div>
                        <div className="mt-1 flex items-center justify-center gap-1">
                          {count > 0 ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 inline-block" />
                              {count > 1 ? <span className="text-[10px] text-slate-600 tabular-nums">{count}</span> : null}
                            </>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 inline-block" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          <Card
            title="Priority Tasks"
            tone="red"
            icon={AlertTriangle}
            right={<button onClick={goTasks} className="text-xs text-white/90 underline underline-offset-2">View all</button>}
          >
            <div className="space-y-3">
              {[...derived.overdue, ...derived.urgent, ...derived.high].slice(0, 6).map((t) => (
                <div key={t.id || t.title} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{t.title || "Task"}</div>
                    <div className="text-xs text-slate-600 truncate">{t.siteName || t.site || ""}</div>
                  </div>
                  <div className="text-xs text-slate-600 whitespace-nowrap">
                    {t.isOverdue ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        Overdue
                      </span>
                    ) : (
                      (t.dueDate ? fmtShort(t.dueDate) : "")
                    )}
                  </div>
                </div>
              ))}
              {[...derived.overdue, ...derived.urgent, ...derived.high].length === 0 && (
                <div className="text-sm text-slate-600">No priority tasks.</div>
              )}
            </div>
          </Card>

          <Card
            title="Upcoming Schedule"
            tone="blue"
            icon={ClipboardList}
            right={<button onClick={goTasks} className="text-xs text-white/90 underline underline-offset-2">View all</button>}
          >
            <div className="space-y-3">
              {derived.upcoming.map((t) => (
                <div key={t.id || t.title} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{t.title || "Task"}</div>
                    <div className="text-xs text-slate-600 truncate">{t.siteName || t.site || ""}</div>
                  </div>
                  <div className="text-xs text-slate-600 whitespace-nowrap">
                    {t.dueDate ? `${fmtShort(t.dueDate)} ${fmtTime(t.dueDate)}` : ""}
                  </div>
                </div>
              ))}
              {derived.upcoming.length === 0 && <div className="text-sm text-slate-600">No upcoming items.</div>}
            </div>
          </Card>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <Card
            title="Urgent"
            tone="red"
            icon={AlertTriangle}
            right={<span className="text-xs text-white/90">{derived.overdue.length + derived.urgent.length} items</span>}
          >
            <div className="space-y-3">
              {[...derived.overdue, ...derived.urgent].slice(0, 8).map((t) => (
                <div key={t.id || t.title} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{t.title || "Task"}</div>
                    <div className="text-xs text-slate-600 truncate">{t.siteName || t.site || ""}</div>
                  </div>
                  <div className="text-xs text-slate-600 whitespace-nowrap">
                    {t.isOverdue ? (
                      <span className="text-rose-700 font-semibold">Overdue</span>
                    ) : (
                      (t.dueDate ? fmtShort(t.dueDate) : "")
                    )}
                  </div>
                </div>
              ))}
              {[...derived.overdue, ...derived.urgent].length === 0 && <div className="text-sm text-slate-600">No urgent items.</div>}
              <div className="pt-2">
                <button onClick={goTasks} className="text-xs text-slate-700 underline underline-offset-2">
                  Open full urgent list
                </button>
              </div>
            </div>
          </Card>

          <Card
            title="Projects"
            tone="blue"
            icon={Users}
            right={<button onClick={goSites} className="text-xs text-white/90 underline underline-offset-2">Open Sites</button>}
          >
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{p.name}</div>
                    <div className="text-xs text-slate-600 truncate">{p.sub}</div>
                  </div>
                  <div className="text-xs text-slate-600 whitespace-nowrap tabular-nums">{p.a}/{p.b}</div>
                </div>
              ))}
              {projects.length === 0 && <div className="text-sm text-slate-600">No sites yet. Add one under Sites.</div>}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 xl:col-span-3 space-y-4">
          <Card title="Stats" tone="blue" icon={TrendingUp}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">Total Tasks</div>
                <div className="text-lg font-bold text-slate-800 tabular-nums">{stats.totalTasks}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">Open Tasks</div>
                <div className="text-lg font-bold text-slate-800 tabular-nums">{stats.openTasks}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">Deadlines Missed</div>
                <div className="text-lg font-bold text-rose-700 tabular-nums">{stats.missed}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">Days Until Next Site</div>
                <div className="text-lg font-bold text-slate-800 tabular-nums">{stats.daysUntilNextSite}</div>
              </div>
            </div>
          </Card>

          <Card title="Active Sites Progress" tone="blue">
            <div className="space-y-3">
              {progress.map((p) => (
                <ProgressRow key={p.id} label={p.name} value={p.pct} />
              ))}
              {progress.length === 0 && <div className="text-sm text-slate-600">No sites to show progress.</div>}
            </div>
          </Card>

          <Card title="Weather Forecast" tone="gray" icon={CloudSun}>
            <div className="grid grid-cols-3 gap-3">
              {[
                { day: "Today", t: "19°C", sub: "Fine" },
                { day: "Tomorrow", t: "17°C", sub: "Cloud" },
                { day: "Next", t: "20°C", sub: "Sun" },
              ].map((x) => (
                <div key={x.day} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                  <div className="text-xs text-slate-600">{x.day}</div>
                  <div className="text-lg font-bold text-slate-800">{x.t}</div>
                  <div className="text-xs text-slate-600">{x.sub}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {activity.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="text-xs text-slate-600">{a.line1}</div>
                  <div className="text-sm font-semibold text-slate-800">{a.line2}</div>
                  <div className="text-xs text-slate-600 mt-1">{a.meta}</div>
                </div>
              ))}
              {activity.length === 0 && <div className="text-sm text-slate-600">No recent activity.</div>}
            </div>

            <div className="mt-3 text-xs text-slate-600">(Weather placeholder until API is wired.)</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



