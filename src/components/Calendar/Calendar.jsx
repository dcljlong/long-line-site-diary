import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Plus, X } from 'lucide-react';
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
import { useLocalStorage } from '../../hooks/useLocalStorage';

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
  const d = parseISO(v);
  if (isNaN(d.getTime())) return null;
  return startOfDay(d);
}

function readHashDate() {
  const raw = (window.location.hash || '').replace('#', '');
  const parts = raw.split('?');
  if (parts.length < 2) return null;

  const qs = parts.slice(1).join('?');
  const params = new URLSearchParams(qs);
  const dateStr = params.get('date');
  return safeDate(dateStr);
}

function writeHashDate(date) {
  const d = startOfDay(date);
  const ymd = format(d, 'yyyy-MM-dd');
  window.location.hash = `calendar?date=${ymd}`;
}

function clearHashToCalendarRoot() {
  window.location.hash = 'calendar';
}

function newId(prefix = 'ev') {
  try {
    const u = globalThis.crypto?.randomUUID?.();
    if (u) return u;
  } catch {}
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeEvent(e) {
  const nowIso = new Date().toISOString();
  const safe = e && typeof e === 'object' ? e : {};
  const id = (safe.id || '').toString() || newId('ev');
  const title = (safe.title || '').toString().trim() || 'Calendar Item';
  const date = (safe.date || '').toString().trim(); // YYYY-MM-DD required
  const allDay = !!safe.allDay;
  const startTime = (safe.startTime || '').toString().trim(); // HH:mm
  const endTime = (safe.endTime || '').toString().trim();     // HH:mm
  const location = (safe.location || '').toString().trim();
  const notes = (safe.notes || '').toString().trim();
  const jobId = (safe.jobId || safe.siteId || '').toString().trim();
  const createdAt = (safe.createdAt || nowIso).toString();
  const updatedAt = (safe.updatedAt || nowIso).toString();

  return {
    id,
    title,
    date,
    allDay,
    startTime,
    endTime,
    location,
    notes,
    jobId,
    createdAt,
    updatedAt,
  };
}

function normalizeEvents(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr
    .map(normalizeEvent)
    .filter((x) => !!safeDate(x.date)); // only keep valid YYYY-MM-DD events
}

function taskStatus(t) {
  const st = (t?.status || '').toString().toLowerCase();
  if (st === 'planned' || st === 'active' || st === 'complete') return st;
  if (t?.done || t?.isDone) return 'complete';
  return 'active';
}

function taskSpan(t) {
  const safe = t && typeof t === 'object' ? t : {};

  const startRaw =
    safe.startDate ?? safe.start ?? safe.start_at ?? safe.start_date ?? null;

  const endRaw =
    safe.endDate ?? safe.end ?? safe.end_at ?? safe.end_date ?? null;

  const durRaw = safe.durationDays ?? safe.duration ?? safe.days ?? null;

  const start = startRaw ? new Date(startRaw) : null;
  if (!start || isNaN(start.getTime())) return null;

  let end = null;

  if (endRaw) {
    const e = new Date(endRaw);
    if (!isNaN(e.getTime())) end = e;
  }

  if (!end && durRaw != null) {
    const dur = Number(durRaw);
    if (isFinite(dur) && dur > 0) {
      end = addDays(start, Math.max(0, Math.round(dur) - 1));
    }
  }

  if (!end) {
    const dueRaw =
      safe.dueDate ?? safe.due ?? safe.date ?? safe.deadline ?? null;
    const d = dueRaw ? new Date(dueRaw) : null;
    if (d && !isNaN(d.getTime())) end = d;
  }

  if (!end || isNaN(end.getTime())) end = start;

  return { start, end };
}

function taskTypeLabel(t) {
  const typeRaw = ((t && t.type) || '').toString().toLowerCase();
  if (typeRaw === 'site-visit') return 'Site Visit';
  if (typeRaw === 'inspection') return 'Inspection';
  if (typeRaw === 'delivery') return 'Delivery';
  if (typeRaw === 'deadline') return 'Deadline';
  return 'Task';
}



function buildMonthCells(monthDate) {
  const ms = startOfMonth(monthDate);
  const me = endOfMonth(ms);
  const cs = startOfWeek(ms);
  const ce = endOfWeek(me);

  const out = [];
  let d = cs;
  while (d <= ce) {
    out.push(d);
    d = addDays(d, 1);
  }

  // Keep stable height (6 weeks) like main grid
  while (out.length < 42) out.push(addDays(out[out.length - 1], 1));
  return out.slice(0, 42);
}
const Calendar = ({ sites, tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snapshot, setSnapshot] = useState(null);

  // View mode: month/week/day (fixed tabs)
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day'

  // Calendar items stored separately from tasks
  const [eventsRaw, setEventsRaw] = useLocalStorage('ll-events', []);
  const events = useMemo(() => normalizeEvents(eventsRaw), [eventsRaw]);

  // Day create form
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    title: '',
    allDay: false,
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    notes: '',
    jobId: '',
  });
  const [formErr, setFormErr] = useState('');

  const selectedYmd = useMemo(() => format(startOfDay(selectedDate), 'yyyy-MM-dd'), [selectedDate]);

  const siteOptions = useMemo(() => {
    return (sites || [])
      .filter((s) => s && s.id)
      .map((s) => ({ id: s.id, name: s.name || 'Site', address: s.address || '' }));
  }, [sites]);

  // Keep storage normalized (idempotent)
  useEffect(() => {
    const norm = normalizeEvents(eventsRaw);
    const rawStr = JSON.stringify(eventsRaw || []);
    const normStr = JSON.stringify(norm || []);
    if (rawStr !== normStr) setEventsRaw(norm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If URL has #calendar?date=YYYY-MM-DD, open Day view for that date
  useEffect(() => {
    const d = readHashDate();
    if (d) {
      setSelectedDate(d);
      setCurrentMonth(d);
      setViewMode('day');

      const key = format(d, 'yyyy-MM-dd');
      const daySnapshot = loadSnapshot(key);
      setSnapshot(daySnapshot);
    }
  }, []);

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

  const getItemsForDate = (date) => {
    const items = [];

    // 0) Calendar Items (ll-events)
    const ymd = format(startOfDay(date), 'yyyy-MM-dd');
    (events || []).forEach((ev) => {
      if (!ev?.date) return;
      if (String(ev.date).trim() !== ymd) return;

      const jobName = ev.jobId ? (siteNameById.get(ev.jobId) || 'Job') : 'General';
      const jobColor = ev.jobId ? (siteColorById.get(ev.jobId) || 'bg-slate-600') : 'bg-slate-600';

      const timeLabel = ev.allDay
        ? 'All day'
        : (ev.startTime && ev.endTime ? `${ev.startTime}–${ev.endTime}` : (ev.startTime || ev.endTime || ''));

      items.push({
        kind: 'Event',
        type: 'event',
        title: ev.title || 'Calendar Item',
        site: jobName,
        status: '',
        color: jobColor,
        meta: timeLabel,
        location: ev.location || '',
        notes: ev.notes || '',
        eventId: ev.id,
      });
    });

    // 1) Site milestones
    (sites || []).forEach(site => {
      (site.milestones || []).forEach(milestone => {
        const md = safeDate(milestone?.date);
        if (md && isSameDay(md, date)) {
          items.push({
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

    // 2) Tasks
    (tasks || []).forEach((task) => {
      const st = taskStatus(task);
      const jobId = task?.jobId || task?.siteId || '';
      const jobName = jobId ? (siteNameById.get(jobId) || 'Job') : 'General';
      const jobColor = jobId ? (siteColorById.get(jobId) || 'bg-slate-600') : 'bg-slate-600';

      // Start marker
      const sd = safeDate(task?.startDate);
      if (sd && isSameDay(sd, date)) {
        items.push({
          kind: 'Task',
          type: 'task-start',
          title: task.title || 'Task',
          site: jobName,
          status: st,
          color: st === 'complete' ? 'bg-green-600' : (st === 'planned' ? 'bg-slate-500' : jobColor),
        });
      }

      // Due marker
      const dd = safeDate(task?.dueDate);
      if (dd && isSameDay(dd, date)) {
        items.push({
          kind: 'Deadline',
          type: 'deadline',
          typeLabel: taskTypeLabel(task),
          title: task.title || 'Task',
          site: jobName,
          status: st,
          color: st === 'complete' ? 'bg-green-600' : 'bg-rose-600',
        });
      }

      // Span marker
      const span = taskSpan(task);
      if (span && isWithinInterval(date, { start: span.start, end: span.end })) {
        const isStart = isSameDay(span.start, date);
        const isEnd = isSameDay(span.end, date);

        items.push({
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

    // Ordering: milestone, event, task-start, task-span, deadline
    const rank = (t) =>
      t.type === 'milestone' ? 0 :
      t.type === 'event' ? 1 :
      t.type === 'task-start' ? 2 :
      t.type === 'task-span' ? 3 :
      t.type === 'deadline' ? 4 : 9;

    return items.sort((a, b) => rank(a) - rank(b));
  };

  const selectedDateItems = getItemsForDate(startOfDay(selectedDate));

  const loadDaySnapshot = (date) => {
    const key = format(date, 'yyyy-MM-dd');
    const daySnapshot = loadSnapshot(key);
    setSnapshot(daySnapshot);
  };

  const handleSelectDate = (date, { updateHashForDay = false } = {}) => {
    setSelectedDate(date);
    setCurrentMonth(date);
    setSnapshot(null);
    setShowAdd(false);
    setFormErr('');

    if (updateHashForDay) writeHashDate(date);

    loadDaySnapshot(date);
  };

  const goPrevDay = () => handleSelectDate(addDays(startOfDay(selectedDate), -1), { updateHashForDay: true });
  const goNextDay = () => handleSelectDate(addDays(startOfDay(selectedDate), 1), { updateHashForDay: true });

  const goPrevWeek = () => handleSelectDate(addDays(startOfDay(selectedDate), -7));
  const goNextWeek = () => handleSelectDate(addDays(startOfDay(selectedDate), 7));

  const addEvent = () => {
    setFormErr('');

    const title = (form.title || '').toString().trim();
    if (!title) {
      setFormErr('Title is required.');
      return;
    }

    const allDay = !!form.allDay;
    const startTime = (form.startTime || '').toString().trim();
    const endTime = (form.endTime || '').toString().trim();

    if (!allDay) {
      const isTime = (t) => /^\d{2}:\d{2}$/.test(t);
      if (startTime && !isTime(startTime)) {
        setFormErr('Start time must be HH:mm.');
        return;
      }
      if (endTime && !isTime(endTime)) {
        setFormErr('End time must be HH:mm.');
        return;
      }
      if (startTime && endTime && startTime > endTime) {
        setFormErr('End time must be after start time.');
        return;
      }
    }

    const nowIso = new Date().toISOString();
    const ev = normalizeEvent({
      id: newId('ev'),
      title,
      date: selectedYmd,
      allDay,
      startTime: allDay ? '' : startTime,
      endTime: allDay ? '' : endTime,
      location: (form.location || '').toString().trim(),
      notes: (form.notes || '').toString().trim(),
      jobId: (form.jobId || '').toString().trim(),
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    setEventsRaw((prev) => {
      const next = normalizeEvents([...(Array.isArray(prev) ? prev : []), ev]);
      return next;
    });

    setForm((p) => ({
      ...p,
      title: '',
      location: '',
      notes: '',
    }));
    setShowAdd(false);
  };

  const Tabs = (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      {[
        { k: 'day', label: 'Day' },
        { k: 'week', label: 'Week' },
        { k: 'month', label: 'Month' },
      ].map((t) => {
        const active = viewMode === t.k;
        return (
          <button
            key={t.k}
            type="button"
            onClick={() => {
              setShowAdd(false);
              setFormErr('');

              if (t.k === 'day') {
                setViewMode('day');
                writeHashDate(selectedDate);
                loadDaySnapshot(selectedDate);
                return;
              }

              setViewMode(t.k);
              clearHashToCalendarRoot();
            }}
            className={[
              'px-3 py-1.5 text-sm font-semibold rounded-md transition-colors',
              active ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-100',
            ].join(' ')}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );

  const weekStart = startOfWeek(startOfDay(selectedDate));
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const TopBar = (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Project Calendar</h2>
        <div className="hidden md:block">{Tabs}</div>
      </div>

      <div className="flex items-center gap-2">
        <div className="md:hidden">{Tabs}</div>

        {viewMode === 'month' && (
          <>
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-sm md:text-base font-semibold min-w-[150px] text-center text-slate-800">
              {format(currentMonth, 'MMMM yyyy')}
            </div>

            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {viewMode === 'week' && (
          <>
            <button
              type="button"
              onClick={goPrevWeek}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Previous week"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-sm md:text-base font-semibold min-w-[200px] text-center text-slate-800">
              {format(weekStart, 'dd MMM')} – {format(addDays(weekStart, 6), 'dd MMM yyyy')}
            </div>

            <button
              type="button"
              onClick={goNextWeek}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Next week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {viewMode === 'day' && (
          <>
            <button
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 inline-flex items-center gap-2"
              title="Add item"
            >
              {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAdd ? 'Close' : 'Add Item'}
            </button>

            <button
              type="button"
              onClick={goPrevDay}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={goNextDay}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="hidden md:block text-sm font-semibold text-slate-700 ml-2">
              {format(selectedDate, 'EEEE, dd MMM yyyy')}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // MONTH GRID DATA
  const monthGridDays = days;

  // DAY VIEW
  if (viewMode === 'day') {
    return (
      <div className="h-[calc(100vh-220px)] flex flex-col">
        {TopBar}

{/* 5-month ribbon: -2, -1, 0 (selected), +1, +2 + mini prev/next months */}
      <div className="mb-3 space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const m = subMonths(currentMonth, 1);
              setCurrentMonth(m);
            }}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>

          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {[-2, -1, 0, 1, 2].map((offset) => {
                const m = startOfMonth(addMonths(currentMonth, offset));
                const isSel =
                  m.getFullYear() === currentMonth.getFullYear() &&
                  m.getMonth() === currentMonth.getMonth();

                return (
                  <button
                    key={`${m.getFullYear()}-${m.getMonth()}`}
                    type="button"
                    onClick={() => setCurrentMonth(m)}
                    className={[
                      "px-3 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap",
                      isSel
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                    title={format(m, "MMMM yyyy")}
                  >
                    <div className="leading-tight">{format(m, "MMM")}</div>
                    <div className={["text-[10px]", isSel ? "text-white/80" : "text-slate-500"].join(" ")}>
                      {format(m, "yyyy")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const m = addMonths(currentMonth, 1);
              setCurrentMonth(m);
            }}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[subMonths(currentMonth, 1), addMonths(currentMonth, 1)].map((m) => {
            const cells = buildMonthCells(m);
            const mStart = startOfMonth(m);

            return (
              <div
                key={`${m.getFullYear()}--mini`}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-slate-700">{format(m, "MMMM yyyy")}</div>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(m)}
                    className="text-[11px] font-semibold text-slate-700 underline underline-offset-2"
                    title="Jump to this month"
                  >
                    Open
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={`${d}-209`} className="text-[10px] text-slate-500 text-center font-semibold">
                      {d}
                    </div>
                  ))}

                  {cells.map((d, i) => {
                    const inMonth = isSameMonth(d, mStart);
                    const isToday = isSameDay(d, new Date());

                    return (
                      <button
                        key={`${d.toISOString()}-209`}
                        type="button"
                        onClick={() => {
                          setViewMode("day");
                          writeHashDate(startOfDay(d));
                          handleSelectDate(startOfDay(d), { updateHashForDay: true });
                        }}
                        className={[
                          "h-7 rounded-md text-[11px] font-semibold",
                          inMonth ? "text-slate-700 hover:bg-slate-100" : "text-slate-300",
                          isToday ? "ring-2 ring-blue-600" : "",
                        ].join(" ")}
                        title={format(d, "yyyy-MM-dd")}
                      >
                        {format(d, "d")}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Day list + add form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col min-h-0">
            <div className="bg-slate-700 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4" />
                Items ({selectedYmd})
              </div>
              <div className="text-xs text-white/80">Events saved to ll-events</div>
            </div>

            {showAdd && (
              <div className="border-b border-slate-200 bg-slate-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      placeholder="e.g. Concrete pour, Delivery, Site meeting"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Linked Job</label>
                    <select
                      value={form.jobId}
                      onChange={(e) => setForm((p) => ({ ...p, jobId: e.target.value }))}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="">General (no job)</option>
                      {siteOptions.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.allDay}
                        onChange={(e) => setForm((p) => ({ ...p, allDay: e.target.checked }))}
                      />
                      All day
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Start time</label>
                    <input
                      type="time"
                      value={form.startTime}
                      disabled={form.allDay}
                      onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">End time</label>
                    <input
                      type="time"
                      value={form.endTime}
                      disabled={form.allDay}
                      onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Notes</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                      className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white min-h-[80px]"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                {formErr ? (
                  <div className="mt-3 text-sm text-rose-700 font-semibold">{formErr}</div>
                ) : null}

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowAdd(false); setFormErr(''); }}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addEvent}
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                  >
                    Save Item
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {selectedDateItems.length === 0 ? (
                <div className="text-sm text-slate-600">No items scheduled for this day.</div>
              ) : (
                selectedDateItems.map((item, idx) => (
                  <div
                    key={`${item.type}_${item.eventId || item.title || idx}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-start gap-3"
                  >
                    <div className={`w-3 h-3 rounded mt-1 ${item.color}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-slate-600">{item.kind}</div>
                        {item.meta ? <div className="text-xs text-slate-600 tabular-nums">{item.meta}</div> : null}
                      </div>

                      <div className="text-sm font-semibold text-slate-800 truncate">{item.title}</div>

                      <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {item.site}
                        {item.location ? <span className="text-slate-500">• {item.location}</span> : null}
                      </div>

                      {item.status ? (
                        <div className="text-xs text-slate-500 mt-1 capitalize">Status: {item.status}</div>
                      ) : null}

                      {item.notes ? (
                        <div className="text-xs text-slate-600 mt-2 whitespace-pre-wrap">{item.notes}</div>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel (snapshot) */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 min-h-0 overflow-auto">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Day Details
            </h3>

            {snapshot ? (
              <DailySnapshotView
                date={format(selectedDate, 'yyyy-MM-dd')}
                snapshot={snapshot}
                onClose={() => setSnapshot(null)}
              />
            ) : (
              <div className="text-sm text-slate-600">No snapshot saved for this date.</div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="text-sm font-semibold text-slate-700 mb-2">Next</div>
              <div className="text-sm text-slate-600">C2C adds edit/delete actions per Event item.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // WEEK VIEW
  if (viewMode === 'week') {
    return (
      <div className="h-[calc(100vh-220px)] flex flex-col">
        {TopBar}

{/* 5-month ribbon: -2, -1, 0 (selected), +1, +2 + mini prev/next months */}
      <div className="mb-3 space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const m = subMonths(currentMonth, 1);
              setCurrentMonth(m);
            }}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>

          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {[-2, -1, 0, 1, 2].map((offset) => {
                const m = startOfMonth(addMonths(currentMonth, offset));
                const isSel =
                  m.getFullYear() === currentMonth.getFullYear() &&
                  m.getMonth() === currentMonth.getMonth();

                return (
                  <button
                    key={`${m.getFullYear()}-${m.getMonth()}`}
                    type="button"
                    onClick={() => setCurrentMonth(m)}
                    className={[
                      "px-3 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap",
                      isSel
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                    title={format(m, "MMMM yyyy")}
                  >
                    <div className="leading-tight">{format(m, "MMM")}</div>
                    <div className={["text-[10px]", isSel ? "text-white/80" : "text-slate-500"].join(" ")}>
                      {format(m, "yyyy")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const m = addMonths(currentMonth, 1);
              setCurrentMonth(m);
            }}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[subMonths(currentMonth, 1), addMonths(currentMonth, 1)].map((m) => {
            const cells = buildMonthCells(m);
            const mStart = startOfMonth(m);

            return (
              <div
                key={`${m.getFullYear()}--mini`}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-slate-700">{format(m, "MMMM yyyy")}</div>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(m)}
                    className="text-[11px] font-semibold text-slate-700 underline underline-offset-2"
                    title="Jump to this month"
                  >
                    Open
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={`${d}-209`} className="text-[10px] text-slate-500 text-center font-semibold">
                      {d}
                    </div>
                  ))}

                  {cells.map((d, i) => {
                    const inMonth = isSameMonth(d, mStart);
                    const isToday = isSameDay(d, new Date());

                    return (
                      <button
                        key={`${d.toISOString()}-209`}
                        type="button"
                        onClick={() => {
                          setViewMode("day");
                          writeHashDate(startOfDay(d));
                          handleSelectDate(startOfDay(d), { updateHashForDay: true });
                        }}
                        className={[
                          "h-7 rounded-md text-[11px] font-semibold",
                          inMonth ? "text-slate-700 hover:bg-slate-100" : "text-slate-300",
                          isToday ? "ring-2 ring-blue-600" : "",
                        ].join(" ")}
                        title={format(d, "yyyy-MM-dd")}
                      >
                        {format(d, "d")}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Week columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col min-h-0">
            <div className="grid grid-cols-7 bg-slate-700 text-white shrink-0">
              {weekDayLabels.map((d) => (
                <div key={d} className="py-2 text-center text-xs md:text-sm font-semibold">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 flex-1 min-h-0">
              {weekDays.map((d) => {
                const dateDay = startOfDay(d);
                const items = getItemsForDate(dateDay);
                const isSel = isSameDay(dateDay, selectedDate);
                const isToday = isSameDay(dateDay, new Date());

                return (
                  <button
                    key={dateDay.toISOString()}
                    type="button"
                    onClick={() => handleSelectDate(dateDay)}
                    className={[
                      'min-h-0 p-2 border border-slate-100 text-left',
                      'transition-colors outline-none',
                      isSel ? 'ring-2 ring-blue-600 ring-inset' : '',
                      isToday && !isSel ? 'bg-blue-50' : 'bg-white',
                      'hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <div className="text-xs font-semibold mb-1 flex items-center justify-between text-slate-700">
                      <span className={isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center' : ''}>
                        {format(dateDay, 'd')}
                      </span>
                      {items.length > 0 ? (
                        <span className="text-[10px] text-slate-500 tabular-nums">{items.length}</span>
                      ) : null}
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      {items.slice(0, 2).map((item, eidx) => (
                        <div
                          key={`${item.type}_${item.eventId || item.title || eidx}`}
                          className={[
                            item.color,
                            item.subtle ? 'opacity-60' : '',
                            'text-white text-[10px] px-1 py-0.5 rounded truncate',
                          ].join(' ')}
                          title={`${item.kind}: ${item.title} (${item.site})`}
                        >
                          {item.type === 'deadline' ? 'Due: ' : item.type === 'task-start' ? 'Start: ' : item.type === 'event' ? 'Evt: ' : ''}
                          {item.title}
                        </div>
                      ))}
                      {items.length > 2 && (
                        <div className="text-[10px] text-slate-500 text-center">+{items.length - 2} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day details */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 min-h-0 overflow-auto">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {format(selectedDate, 'EEEE, MMMM do')}
            </h3>

            {selectedDateItems.length === 0 && !snapshot ? (
              <p className="text-slate-400 text-center py-8">No items or snapshot for this date</p>
            ) : (
              <>
                {selectedDateItems.length > 0 && (
                  <div className="space-y-3">
                    {selectedDateItems.map((item, idx) => (
                      <motion.div
                        key={`${item.type}_${item.eventId || item.title || idx}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <div className={`inline-block px-2 py-0.5 rounded text-[10px] text-white ${item.color} mb-1`}>
                          {item.kind}
                        </div>
                        <h4 className="font-semibold text-sm text-slate-800">{item.title}</h4>
                        <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {item.site}
                          {item.meta ? <span className="text-slate-500">• {item.meta}</span> : null}
                        </p>
                        {item.location ? <p className="text-xs text-slate-500 mt-1">Location: {item.location}</p> : null}
                        {item.status ? <p className="text-xs text-slate-500 mt-1 capitalize">Status: {item.status}</p> : null}
                        {item.notes ? <p className="text-xs text-slate-600 mt-2 whitespace-pre-wrap">{item.notes}</p> : null}
                      </motion.div>
                    ))}
                  </div>
                )}

                {snapshot && (
                  <div className="mt-4">
                    <DailySnapshotView
                      date={format(selectedDate, 'yyyy-MM-dd')}
                      snapshot={snapshot}
                      onClose={() => setSnapshot(null)}
                    />
                  </div>
                )}
              </>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setViewMode('day');
                  writeHashDate(selectedDate);
                  loadDaySnapshot(selectedDate);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700"
                title="Open full Day view"
              >
                Open Day View
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MONTH VIEW
  return (
    <div className="h-[calc(100vh-220px)] flex flex-col">
      {TopBar}

{/* 5-month ribbon: -2, -1, 0 (selected), +1, +2 + mini prev/next months */}
      <div className="mb-3 space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const m = subMonths(currentMonth, 1);
              setCurrentMonth(m);
            }}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>

          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {[-2, -1, 0, 1, 2].map((offset) => {
                const m = startOfMonth(addMonths(currentMonth, offset));
                const isSel =
                  m.getFullYear() === currentMonth.getFullYear() &&
                  m.getMonth() === currentMonth.getMonth();

                return (
                  <button
                    key={`${m.getFullYear()}-${m.getMonth()}`}
                    type="button"
                    onClick={() => setCurrentMonth(m)}
                    className={[
                      "px-3 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap",
                      isSel
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                    title={format(m, "MMMM yyyy")}
                  >
                    <div className="leading-tight">{format(m, "MMM")}</div>
                    <div className={["text-[10px]", isSel ? "text-white/80" : "text-slate-500"].join(" ")}>
                      {format(m, "yyyy")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const m = addMonths(currentMonth, 1);
              setCurrentMonth(m);
            }}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[subMonths(currentMonth, 1), addMonths(currentMonth, 1)].map((m) => {
            const cells = buildMonthCells(m);
            const mStart = startOfMonth(m);

            return (
              <div
                key={`${m.getFullYear()}--mini`}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-slate-700">{format(m, "MMMM yyyy")}</div>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(m)}
                    className="text-[11px] font-semibold text-slate-700 underline underline-offset-2"
                    title="Jump to this month"
                  >
                    Open
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={`${d}-209`} className="text-[10px] text-slate-500 text-center font-semibold">
                      {d}
                    </div>
                  ))}

                  {cells.map((d, i) => {
                    const inMonth = isSameMonth(d, mStart);
                    const isToday = isSameDay(d, new Date());

                    return (
                      <button
                        key={`${d.toISOString()}-209`}
                        type="button"
                        onClick={() => {
                          setViewMode("day");
                          writeHashDate(startOfDay(d));
                          handleSelectDate(startOfDay(d), { updateHashForDay: true });
                        }}
                        className={[
                          "h-7 rounded-md text-[11px] font-semibold",
                          inMonth ? "text-slate-700 hover:bg-slate-100" : "text-slate-300",
                          isToday ? "ring-2 ring-blue-600" : "",
                        ].join(" ")}
                        title={format(d, "yyyy-MM-dd")}
                      >
                        {format(d, "d")}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col min-h-0">
          <div className="grid grid-cols-7 bg-slate-700 text-white shrink-0">
            {weekDayLabels.map(d => (
              <div key={d} className="py-2 text-center text-xs md:text-sm font-semibold">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 flex-1 min-h-0">
            {monthGridDays.map((date, idx) => {
              const dateDay = startOfDay(date);
              const items = getItemsForDate(dateDay);
              const isCurrent = isSameMonth(dateDay, currentMonth);
              const isSelected = isSameDay(dateDay, selectedDate);
              const isToday = isSameDay(dateDay, new Date());

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setViewMode('day');
                    writeHashDate(dateDay);
                    handleSelectDate(dateDay, { updateHashForDay: true });
                  }}
                  className={[
                    'min-h-0 p-2 border border-slate-100 text-left',
                    'transition-colors outline-none',
                    isCurrent ? 'bg-white' : 'bg-slate-50',
                    isSelected ? 'ring-2 ring-blue-600 ring-inset' : '',
                    isToday && !isSelected ? 'bg-blue-50' : '',
                    'hover:bg-slate-50',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'text-xs font-semibold mb-1 flex items-center justify-between',
                      !isCurrent ? 'text-slate-400' : 'text-slate-700',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-flex items-center justify-center',
                        isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full' : '',
                      ].join(' ')}
                    >
                      {format(dateDay, 'd')}
                    </span>

                    {items.length > 0 ? (
                      <span className="text-[10px] text-slate-500 tabular-nums">{items.length}</span>
                    ) : null}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {items.slice(0, 2).map((item, eidx) => (
                      <div
                        key={`${item.type}_${item.eventId || item.title || eidx}`}
                        className={[
                          item.color,
                          item.subtle ? 'opacity-60' : '',
                          'text-white text-[10px] px-1 py-0.5 rounded truncate',
                        ].join(' ')}
                        title={`${item.kind}: ${item.title} (${item.site})`}
                      >
                        {item.type === 'deadline' ? 'Due: ' : item.type === 'task-start' ? 'Start: ' : item.type === 'event' ? 'Evt: ' : ''}
                        {item.title}
                      </div>
                    ))}
                    {items.length > 2 && (
                      <div className="text-[10px] text-slate-500 text-center">
                        +{items.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 min-h-0 overflow-auto">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {format(selectedDate, 'EEEE, MMMM do')}
          </h3>

          {selectedDateItems.length === 0 && !snapshot ? (
            <p className="text-slate-400 text-center py-8">No items or snapshot for this date</p>
          ) : (
            <>
              {selectedDateItems.length > 0 && (
                <div className="space-y-3">
                  {selectedDateItems.map((item, idx) => (
                    <motion.div
                      key={`${item.type}_${item.eventId || item.title || idx}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <div className={`inline-block px-2 py-0.5 rounded text-[10px] text-white ${item.color} mb-1`}>
                        {item.kind}
                      </div>
                      <h4 className="font-semibold text-sm text-slate-800">{item.title}</h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {item.site}
                        {item.meta ? <span className="text-slate-500">• {item.meta}</span> : null}
                      </p>
                      {item.location ? <p className="text-xs text-slate-500 mt-1">Location: {item.location}</p> : null}
                      {item.status ? <p className="text-xs text-slate-500 mt-1 capitalize">Status: {item.status}</p> : null}
                      {item.notes ? <p className="text-xs text-slate-600 mt-2 whitespace-pre-wrap">{item.notes}</p> : null}
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
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-sky-600"></div><span>Calendar items (job-coloured)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;













