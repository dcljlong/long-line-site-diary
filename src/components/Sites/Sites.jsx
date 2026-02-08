import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Calendar, DollarSign, 
  CheckCircle, Clock, AlertTriangle, Plus, 
  ChevronRight, ChevronDown, FileText, Camera,
  Edit2, Trash2
} from 'lucide-react';

const Sites = ({ sites, onUpdateSites, onSelectSite }) => {
  const [expandedSite, setExpandedSite] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);

  const priorityConfig = {
    urgent: { color: 'bg-red-500', label: 'Urgent', icon: AlertTriangle },
    high: { color: 'bg-orange-500', label: 'High', icon: Clock },
    medium: { color: 'bg-yellow-500', label: 'Medium', icon: Clock },
    low: { color: 'bg-green-500', label: 'Low', icon: CheckCircle }
  };

  const statusConfig = {
    active: { color: 'bg-blue-500', label: 'Active' },
    planning: { color: 'bg-purple-500', label: 'Planning' },
    completed: { color: 'bg-gray-500', label: 'Completed' },
    onHold: { color: 'bg-yellow-500', label: 'On Hold' }
  };

  const handleDeleteSite = (siteId) => {
    if (confirm('Are you sure you want to delete this site?')) {
      onUpdateSites(sites.filter(s => s.id !== siteId));
    }
  };

  const toggleMilestone = (siteId, milestoneId) => {
    const updatedSites = sites.map(site => {
      if (site.id === siteId) {
        return {
          ...site,
          milestones: site.milestones.map(m => 
            m.id === milestoneId 
              ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' }
              : m
          )
        };
      }
      return site;
    });
    onUpdateSites(updatedSites);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Project Sites</h2>
          <p className="text-gray-500 text-sm">Manage your construction sites and track progress</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Site
        </button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 gap-4">
        {sites.map((site, index) => {
          const PriorityIcon = priorityConfig[site.priority].icon;
          const isExpanded = expandedSite === site.id;
          const completedMilestones = site.milestones.filter(m => m.status === 'completed').length;
          const progress = (completedMilestones / site.milestones.length) * 100;

          return (
            <motion.div 
              key={site.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Site Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedSite(isExpanded ? null : site.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{site.name}</h3>
                      <span className={`${priorityConfig[site.priority].color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                        <PriorityIcon className="w-3 h-3" />
                        {priorityConfig[site.priority].label}
                      </span>
                      <span className={`${statusConfig[site.status].color} text-white text-xs px-2 py-1 rounded-full`}>
                        {statusConfig[site.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {site.address}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{site.contactPhone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{site.contactEmail}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">${(site.projectValue / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-500">Project Value</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectSite(site.id); }}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        View Diary
                      </button>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{completedMilestones}/{site.milestones.length} phases</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100 bg-gray-50"
                  >
                    <div className="p-4 space-y-4">
                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                        <p className="text-sm text-gray-600">{site.description}</p>
                      </div>

                      {/* Milestones */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Milestones</h4>
                        <div className="space-y-2">
                          {site.milestones.map((milestone) => (
                            <div 
                              key={milestone.id}
                              className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200"
                            >
                              <button
                                onClick={() => toggleMilestone(site.id, milestone.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  milestone.status === 'completed' 
                                    ? 'bg-green-500 border-green-500' 
                                    : milestone.status === 'in-progress'
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-300'
                                }`}
                              >
                                {milestone.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                                {milestone.status === 'in-progress' && <Clock className="w-3 h-3 text-white" />}
                              </button>
                              <span className={`text-sm flex-1 ${milestone.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                {milestone.name}
                              </span>
                              <span className="text-xs text-gray-400">{new Date(milestone.date).toLocaleDateString('en-AU')}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500">Total Budget</p>
                          <p className="text-lg font-bold text-gray-800">${(site.budget.total / 1000).toFixed(0)}k</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500">Spent</p>
                          <p className="text-lg font-bold text-red-600">${(site.budget.spent / 1000).toFixed(0)}k</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500">Remaining</p>
                          <p className="text-lg font-bold text-green-600">${(site.budget.remaining / 1000).toFixed(0)}k</p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => onSelectSite(site.id)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Open Diary
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSite(site.id)}
                          className="px-3 py-2 border border-red-300 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {sites.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No sites yet. Add your first project site.</p>
        </div>
      )}
    </div>
  );
};

export default Sites;