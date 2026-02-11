import React, { useState } from 'react';
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
  subMonths
} from 'date-fns';
import { loadSnapshot } from '../../utils/snapshot';
import DailySnapshotView from '../DailySnapshotView';

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

  const getEventsForDate = (date) => {
    const events = [];

    // Site milestones
    (sites || []).forEach(site => {
      (site.milestones || []).forEach(milestone => {
        if (milestone?.date && isSameDay(new Date(milestone.date), date)) {
          events.push({
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

    // Tasks
    (tasks || []).forEach(task => {
      if (task?.dueDate && isSameDay(new Date(task.dueDate), date)) {
        const pr = (task.priority || '').toString().toLowerCase();
        events.push({
          type: 'task',
          title: task.title,
          site: (sites || []).find(s => s.id === task.siteId)?.name || 'General',
          priority: task.priority,
          color:
            pr === 'urgent'
              ? 'bg-rose-600'
              : pr === 'high'
              ? 'bg-orange-600'
              : 'bg-sky-600'
        });
      }
    });

    return events;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

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

          {/* Fill remaining height */}
          <div className="grid grid-cols-7 flex-1 min-h-0">
            {days.map((date, idx) => {
              const events = getEventsForDate(date);
              const isCurrent = isSameMonth(date, currentMonth);
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDateClick(date)}
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
                        isToday
                          ? "bg-blue-600 text-white w-6 h-6 rounded-full"
                          : "",
                      ].join(" ")}
                    >
                      {format(date, 'd')}
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
                          "text-white text-[10px] px-1 py-0.5 rounded truncate",
                        ].join(" ")}
                      >
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
                        {event.type === 'milestone' ? 'Milestone' : 'Task'}
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
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-600"></div><span>Completed</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-600"></div><span>In Progress</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-600"></div><span>Pending</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-600"></div><span>Urgent Task</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
