import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Clock, 
  Briefcase, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = ({ sites, tasks, onNavigate }) => {
  const activeSites = sites.filter(s => s.status === 'active');
  const urgentSites = sites.filter(s => s.priority === 'urgent' || s.priority === 'high');
  const pendingTasks = tasks.filter(t => !t.completed);

  const weeklyHours = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 9.0 },
    { day: 'Wed', hours: 7.5 },
    { day: 'Thu', hours: 8.0 },
    { day: 'Fri', hours: 6.5 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 0 },
  ];

  const totalHours = weeklyHours.reduce((sum, d) => sum + d.hours, 0);

  const upcomingEvents = sites.flatMap(site => 
    site.milestones
      .filter(m => m.status === 'pending' || m.status === 'in-progress')
      .map(m => ({
        ...m,
        siteName: site.name,
        siteId: site.id
      }))
  ).slice(0, 4);

  const priorityColors = {
    urgent: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Active Sites</p>
              <p className="text-3xl font-bold text-gray-800">{activeSites.length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-red-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Urgent</p>
              <p className="text-3xl font-bold text-gray-800">{urgentSites.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-yellow-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Pending Tasks</p>
              <p className="text-3xl font-bold text-gray-800">{pendingTasks.length}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Hours This Week</p>
              <p className="text-3xl font-bold text-gray-800">{totalHours.toFixed(1)}</p>
            </div>
            <Clock className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2 space-y-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-slate-700 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><Briefcase className="w-4 h-4" />Site Overview</h3>
              <button onClick={() => onNavigate('sites')} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">View All</button>
            </div>
            <div className="divide-y divide-gray-100">
              {sites.slice(0, 5).map((site, idx) => (
                <motion.div key={site.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onNavigate('sites', site.id)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * idx }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{site.name}</h4>
                        <span className={`w-2 h-2 rounded-full ${priorityColors[site.priority]}`} />
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{site.address}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{site.contactPhone}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{site.contactEmail}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">${(site.projectValue / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-gray-400">{site.milestones.filter(m => m.status === 'completed').length}/{site.milestones.length} phases</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${(site.milestones.filter(m => m.status === 'completed').length / site.milestones.length) * 100}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-slate-700 text-white px-4 py-3">
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4" />Time Tracking - This Week</h3>
            </div>
            <div className="p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyHours}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {weeklyHours.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 8 ? '#ef4444' : entry.hours > 0 ? '#3b82f6' : '#e5e7eb'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-slate-700 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><CheckSquare className="w-4 h-4" />Priority Tasks</h3>
              <button onClick={() => onNavigate('tasks')} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">All Tasks</button>
            </div>
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
              {pendingTasks.slice(0, 6).map((task, idx) => (
                <motion.div key={task.id} className={`p-3 rounded-lg border-l-4 text-sm ${task.priority === 'urgent' ? 'bg-red-50 border-red-500' : task.priority === 'high' ? 'bg-orange-50 border-orange-500' : task.priority === 'medium' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-400'}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString('en-AU')}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-slate-700 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><CalendarIcon className="w-4 h-4" />Upcoming Events</h3>
              <button onClick={() => onNavigate('calendar')} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">Calendar</button>
            </div>
            <div className="p-3 space-y-2">
              {upcomingEvents.map((event, idx) => (
                <motion.div key={`${event.siteId}-${event.id}`} className="p-3 bg-gray-50 rounded-lg border border-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * idx }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${event.status === 'in-progress' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <p className="font-medium text-sm text-gray-800">{event.name}</p>
                  </div>
                  <p className="text-xs text-gray-500">{event.siteName}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(event.date).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-md p-4 text-white">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider">Project Value</h3>
            <p className="text-3xl font-bold">${(sites.reduce((sum, s) => sum + s.projectValue, 0) / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-gray-300 mt-1">Across {sites.length} active projects</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Spent to Date</span>
                <span className="font-semibold">${(sites.reduce((sum, s) => sum + s.budget.spent, 0) / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-gray-300">Remaining</span>
                <span className="font-semibold text-green-400">${(sites.reduce((sum, s) => sum + s.budget.remaining, 0) / 1000).toFixed(0)}k</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;