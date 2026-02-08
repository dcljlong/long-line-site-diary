import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Mail, ChevronRight, ChevronDown, Plus, Trash2, Edit2 
} from 'lucide-react';

import AddSiteModal from './AddSiteModal';

const Sites = ({ sites, onUpdateSites, onSelectSite }) => {
  const [expandedSite, setExpandedSite] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDeleteSite = (siteId) => {
    if (confirm('Are you sure you want to delete this site?')) {
      onUpdateSites(sites.filter(s => s.id !== siteId));
    }
  };

  const handleAddSite = (newSite) => {
    onUpdateSites([...sites, newSite]);
    setShowAddModal(false);
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

      {sites.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No sites yet. Add your first project site.</p>
        </div>
      )}

      {/* Sites List */}
      <div className="grid grid-cols-1 gap-4">
        {sites.map((site) => {
          const isExpanded = expandedSite === site.id;

          return (
            <motion.div 
              key={site.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Site Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedSite(isExpanded ? null : site.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">{site.name}</h3>
                  {isExpanded 
                    ? <ChevronDown className="w-5 h-5 text-gray-400" /> 
                    : <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </div>
                <p className="text-sm text-gray-600">{site.address}</p>
                <p className="text-xs text-gray-500">Status: {site.status}</p>
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
                    <div className="p-4 space-y-3">
                      <p className="text-sm text-gray-700">{site.description}</p>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => onSelectSite(site.id)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
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

      {showAddModal && (
        <AddSiteModal 
          onClose={() => setShowAddModal(false)} 
          onSave={handleAddSite} 
        />
      )}
    </div>
  );
};

export default Sites;
