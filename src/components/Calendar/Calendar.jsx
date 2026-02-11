import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
  startOfDay
} from 'date-fns';
import { loadSnapshot } from '../../utils/snapshot';
import DailySnapshotView from '../DailySnapshotView';

const bgPalette = [
  'bg-sky-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-fuchsia-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-lime-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-cyan-600',
];

function hashIdx(input) {
  const s = String(input || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % bgPalette.length;
}

function safeDate(value) {
  if (!value) return null;
  const v = String(value).trim();
  if (!v) return null;
  // Prefer parseISO for YYYY-MM-DD so it stays stable in local time
  const d = parseISO(v);
  if (isNaN(d.getTime())) return null;
  return startOfDay(d);
}

function taskStatus(t) {
  const st = (t?.status || '').toString().toLowerCase();
  if (st === 'planned' || st === 'active' || st === 'complete') return st;
  // backward compat fallbacks
  if (t?.done || t?.isDone) return 'complete';
  return 'active';
}

function taskSpan(t) {
  const safe = t && typeof t === 'object' ? t : {};
  const start = safe.startDate || safe.start || safe.start_at || null;
  const due = safe.dueDate || safe.due || safe.date || safe.deadline || null;

  const s = start ? new Date(start) : null;
  const d = due ? new Date(due) : null;

  const startOk = !!(s && !isNaN(s.getTime()));
  const dueOk = !!(d && !isNaN(d.getTime()));

  return {
    start: startOk ? s : null,
    due: dueOk ? d : null,
  };
}

function taskTypeLabel(t) {
  const typeRaw = ((t && t.type) || '').toString().toLowerCase();
  if (typeRaw === 'site-visit') return 'Site Visit';
  if (typeRaw === 'inspection') return 'Inspection';
  if (typeRaw === 'delivery') return 'Delivery';
  if (typeRaw === 'deadline') return 'Deadline';
  return 'Task';
}

const Calendar = ({ sites, tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snapshot, setSnapshot] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const siteNameById = useMemo(() => {
    const m = new Map();
    (sites || []).forEach((s) => {
      if (!s?.id) return;
      m.set(s.id, s.name || 'Site');
    });
    return m;
  }, [sites]);

  const siteColorById = useMemo(() => {
    const m = new Map();
    (sites || []).forEach((s) => {
      if (!s?.id) return;
      m.set(s.id, bgPalette[hashIdx(s.id)]);
    });
    return m;
  }, [sites]);

  const getEventsForDate = (date) => {
    const events = [];

    // Site milestones (existing)
    (sites || []).forEach(site => {
      (site.milestones || []).forEach(milestone => {
        const md = safeDate(milestone?.date);
        if (md && isSameDay(md, date)) {
          events.push({
            kind: 'Milestone',
            type: 'milestone',
            title: milestone.name,
            site: site.name,
            status: milestone.status,
            color:
              milestone.status === 'completed'
                ? 'bg-green-600'
                : milestone.status === 'in-progress'
                ? 'bg-blue-600'
                : 'bg-yellow-600'
          });
        }
      });
    });

    // Tasks -> Calendar (single source of truth)
    (tasks || []).forEach((task) => {
      const st = taskStatus(task);
      const jobId = task?.jobId || task?.siteId || '';
      const jobName = jobId ? (siteNameById.get(jobId) || 'Job') : 'General';
      const jobColor = jobId ? (siteColorById.get(jobId) || 'bg-slate-600') : 'bg-slate-600';

      // 1) Start marker
      const sd = safeDate(task?.startDate);
      if (sd && isSameDay(sd, date)) {
        events.push({
          kind: 'Task',
          type: 'task-start',
          title: task.title || 'Task',
          site: jobName,
          status: st,
          color: st === 'complete' ? 'bg-green-600' : (st === 'planned' ? 'bg-slate-500' : jobColor),
        });
      }

      // 2) Due/deadline marker
      const dd = safeDate(task?.dueDate);
      if (dd && isSameDay(dd, date)) {
        events.push({
          kind: 'Deadline',
          type: 'deadline',
          typeLabel: taskTypeLabel(task),
          title: task.title || 'Task',
          site: jobName,
          status: st,
          color: st === 'complete' ? 'bg-green-600' : 'bg-rose-600',
        });
      }

      // 3) Duration block (span) if start + (endDate|durationDays)
      const span = taskSpan(task);
      if (span && isWithinInterval(date, { start: span.start, end: span.end })) {
        // avoid duplicating the exact same day markers too heavily:
        // show the span marker, but keep it visually subtle on non-start days
        const isStart = isSameDay(span.start, date);
        const isEnd = isSameDay(span.end, date);

        events.push({
          kind: 'Task',
          type: 'task-span',
          typeLabel: taskTypeLabel(task),
          title: task.title || 'Task',
          site: jobName,
          status: st,
          color: st === 'complete' ? 'bg-green-600' : (st === 'planned' ? 'bg-slate-500' : jobColor),
          subtle: !isStart && !isEnd,
        });
      }
    });

    // Stable ordering: milestone, start, span, deadline
    const rank = (t) =>
      t.type === 'milestone' ? 0 :
      t.type === 'task-start' ? 1 :
      t.type === 'task-span' ? 2 :
      t.type === 'deadline' ? 3 : 9;

    return events.sort((a, b) => rank(a) - rank(b));
  };

  const selectedDateEvents = getEventsForDate(startOfDay(selectedDate));

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const key = date.toISOString().slice(0, 10);
    const daySnapshot = loadSnapshot(key);
    setSnapshot(daySnapshot);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-[calc(100vh-220px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Project Calendar</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h3 className="text-base md:text-lg font-semibold min-w-[160px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col min-h-0">
          <div className="grid grid-cols-7 bg-slate-700 text-white shrink-0">
            {weekDays.map(d => (
              <div key={d} className="py-2 text-center text-xs md:text-sm font-semibold">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 flex-1 min-h-0">
            {days.map((date, idx) => {
              const dateDay = startOfDay(date);
              const events = getEventsForDate(dateDay);
              const isCurrent = isSameMonth(dateDay, currentMonth);
              const isSelected = isSameDay(dateDay, selectedDate);
              const isToday = isSameDay(dateDay, new Date());

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDateClick(dateDay)}
                  className={[
                    "min-h-0 p-2 border border-slate-100 text-left",
                    "transition-colors outline-none",
                    isCurrent ? "bg-white" : "bg-slate-50",
                    isSelected ? "ring-2 ring-blue-600 ring-inset" : "",
                    isToday && !isSelected ? "bg-blue-50" : "",
                    "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "text-xs font-semibold mb-1 flex items-center justify-between",
                      !isCurrent ? "text-slate-400" : "text-slate-700",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-flex items-center justify-center",
                        isToday ? "bg-blue-600 text-white w-6 h-6 rounded-full" : "",
                      ].join(" ")}
                    >
                      {format(dateDay, 'd')}
                    </span>

                    {events.length > 0 ? (
                      <span className="text-[10px] text-slate-500 tabular-nums">{events.length}</span>
                    ) : null}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {events.slice(0, 2).map((event, eidx) => (
                      <div
                        key={eidx}
                        className={[
                          event.color,
                          event.subtle ? "opacity-60" : "",
                          "text-white text-[10px] px-1 py-0.5 rounded truncate",
                        ].join(" ")}
                        title={`${event.kind}: ${event.title} (${event.site})`}
                      >
                        {event.type === 'deadline' ? 'Due: ' : event.type === 'task-start' ? 'Start: ' : ''}
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[10px] text-slate-500 text-center">
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 min-h-0 overflow-auto">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {format(selectedDate, 'EEEE, MMMM do')}
          </h3>

          {selectedDateEvents.length === 0 && !snapshot ? (
            <p className="text-slate-400 text-center py-8">
              No events or snapshot for this date
            </p>
          ) : (
            <>
              {selectedDateEvents.length > 0 && (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <div className={`inline-block px-2 py-0.5 rounded text-[10px] text-white ${event.color} mb-1`}>
                        {event.kind}
                      </div>
                      <h4 className="font-semibold text-sm text-slate-800">{event.title}</h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {event.site}
                      </p>
                      {event.status && (
                        <p className="text-xs text-slate-500 mt-1 capitalize">Status: {event.status}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {snapshot && (
                <div className="mt-4">
                  <DailySnapshotView
                    date={selectedDate.toISOString().slice(0, 10)}
                    snapshot={snapshot}
                    onClose={() => setSnapshot(null)}
                  />
                </div>
              )}
            </>
          )}

          <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-500"></div><span>Planned</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-600"></div><span>Complete</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-600"></div><span>Deadline (Due)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-sky-600"></div><span>Job-coloured tasks</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;



