import React, { useMemo, useState } from 'react';
import { newId } from '../../utils/id';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, Circle, Calendar, MapPin, Trash2, Edit2 } from 'lucide-react';
import { taskCategories } from '../../data/initialData';

const taskTypes = [
  { id: 'task', label: 'Task' },
  { id: 'site-visit', label: 'Site Visit' },
  { id: 'inspection', label: 'Inspection' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'deadline', label: 'Deadline' },
];

function normalizeTask(t) {
  const safe = t && typeof t === 'object' ? t : {};
  const typeRaw = (safe.type || '').toString().toLowerCase();
  const type =
    (taskTypes.some(x => x.id === typeRaw) ? typeRaw : '') ||
    'task';

  const statusRaw = (safe.status || '').toString().toLowerCase();
  const status =
    (statusRaw === 'planned' || statusRaw === 'active' || statusRaw === 'complete')
      ? statusRaw
      : ((safe.done || safe.completed || safe.isDone) ? 'complete' : 'active');

  const dueDate = safe.dueDate || safe.due || safe.date || new Date().toISOString().slice(0, 10);

  return {
    ...safe,
    id: safe.id || newId('t'),
    title: (safe.title || safe.name || '').toString(),
    category: (safe.category || 'urgent').toString(),
    priority: (safe.priority || 'medium').toString(),
    jobId: safe.jobId || safe.siteId || '',
    siteId: safe.siteId || safe.jobId || '',
    startDate: safe.startDate || '',
    dueDate,
    type,
    status,
    createdAt: safe.createdAt || new Date().toISOString(),
    updatedAt: safe.updatedAt || safe.createdAt || new Date().toISOString(),
  };
}

const Tasks = ({ tasks, sites, onUpdateTasks }) => {
  const normalizedTasks = useMemo(() => (tasks || []).map(normalizeTask), [tasks]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const [newTask, setNewTask] = useState({
    title: '',
    category: 'urgent',
    jobId: '',
    type: 'task',
    startDate: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'active',
  });

  const filteredTasks = normalizedTasks.filter(task => {
    if (filter === 'completed') return (task.status || '') === 'complete';
    if (filter === 'pending') return (task.status || '') !== 'complete';
    if (filter === 'urgent') return task.priority === 'urgent' || task.priority === 'high';
    return true;
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const nowIso = new Date().toISOString();
    const task = normalizeTask({
      ...newTask,
      id: newId('t'),
      createdAt: nowIso,
      updatedAt: nowIso,
      siteId: newTask.jobId || '',
      jobId: newTask.jobId || '',
    });

    const next = [...normalizedTasks, task];
    onUpdateTasks(next);
    setShowAddModal(false);

    setNewTask({
      title: '',
      category: 'urgent',
      jobId: '',
      type: 'task',
      startDate: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      status: 'active',
    });
  };

  const toggleTask = (taskId) => {
    const next = normalizedTasks.map(t =>
      t.id === taskId
        ? { ...t, status: (t.status === 'complete' ? 'active' : 'complete'), updatedAt: new Date().toISOString() }
        : t
    );
    onUpdateTasks(next);
  };

  const deleteTask = (taskId) => {
    if (confirm('Delete this task?')) {
      onUpdateTasks(normalizedTasks.filter(t => t.id !== taskId));
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'text-red-600 bg-red-50 border-red-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      medium: 'text-blue-600 bg-blue-50 border-blue-200',
      low: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  const typeLabel = (t) => (taskTypes.find(x => x.id === (t || ''))?.label || 'Task');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Task Manager</h2>
          <p className="text-gray-500 text-sm">Track your to-dos across all sites</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'completed', 'urgent'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-slate-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task, idx) => {
          const category = taskCategories.find(c => c.id === task.category) || taskCategories[0];
          const site = (sites || []).find(s => s.id === (task.jobId || task.siteId));

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`
                bg-white rounded-lg shadow-sm border-l-4 p-4 flex items-start gap-4
                ${(task.status === 'complete') ? 'opacity-60' : ''}
                ${getPriorityColor(task.priority)}
              `}
            >
              <button onClick={() => toggleTask(task.id)} className="mt-1">
                {(task.status === 'complete') ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-medium ${(task.status === 'complete') ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-1 text-xs flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-white ${category.color}`}>
                        {category.label}
                      </span>

                      <span className="px-2 py-0.5 rounded-full border border-slate-200 text-slate-700 bg-white">
                        {typeLabel(task.type)}
                      </span>

                      {site && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {site.name}
                        </span>
                      )}

                      {task.startDate ? (
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          Start {new Date(task.startDate).toLocaleDateString('en-AU')}
                        </span>
                      ) : null}

                      {task.dueDate ? (
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          Due {new Date(task.dueDate).toLocaleDateString('en-AU')}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded" title="Edit (next phase)">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="p-1 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-400">No tasks found</p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Task</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {taskTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {taskCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site / Job</label>
                <select
                  value={newTask.jobId}
                  onChange={(e) => setNewTask({ ...newTask, jobId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">General (No specific site)</option>
                  {(sites || []).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

