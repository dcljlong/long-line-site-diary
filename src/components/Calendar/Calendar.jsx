import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const Calendar = ({ sites, tasks, onNavigate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // Get events for calendar
  const getEventsForDate = (date) => {
    const events = [];

    // Site milestones
    sites.forEach(site => {
      site.milestones.forEach(milestone => {
        if (isSameDay(new Date(milestone.date), date)) {
          events.push({
            type: 'milestone',
            title: milestone.name,
            site: site.name,
            siteId: site.id,
            status: milestone.status,
            color: milestone.status === 'completed' ? 'bg-green-500' : milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
          });
        }
      });
    });

    // Tasks
    tasks.forEach(task => {
      if (isSameDay(new Date(task.dueDate), date)) {
        events.push({
          type: 'task',
          title: task.title,
          site: sites.find(s => s.id === task.siteId)?.name || 'General',
          priority: task.priority,
          color: task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
        });
      }
    });

    return events;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Project Calendar</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold min-w-[150px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-7 bg-slate-700 text-white">
            {weekDays.map(d => (
              <div key={d} className="py-2 text-center text-sm font-semibold">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((date, idx) => {
              const events = getEventsForDate(date);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());

              return (
                <motion.div
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-colors
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                    ${isToday ? 'bg-blue-50' : ''}
                    hover:bg-gray-50
                  `}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                  `}>
                    {format(date, 'd')}
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 3).map((event, eidx) => (
                      <div 
                        key={eidx}
                        className={`${event.color} text-white text-[10px] px-1 py-0.5 rounded truncate`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-[10px] text-gray-500 text-center">+{events.length - 3} more</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {format(selectedDate, 'EEEE, MMMM do')}
          </h3>

          {selectedDateEvents.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No events for this date</p>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-3 rounded-lg border-l-4 bg-gray-50"
                  style={{ borderLeftColor: event.color.replace('bg-', '') }}
                >
                  <div className={`inline-block px-2 py-0.5 rounded text-[10px] text-white ${event.color} mb-1`}>
                    {event.type === 'milestone' ? 'Milestone' : 'Task'}
                  </div>
                  <h4 className="font-medium text-sm text-gray-800">{event.title}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {event.site}
                  </p>
                  {event.status && (
                    <p className="text-xs text-gray-400 mt-1 capitalize">Status: {event.status}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500"></div><span>Completed</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"></div><span>In Progress</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500"></div><span>Pending</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"></div><span>Urgent Task</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;