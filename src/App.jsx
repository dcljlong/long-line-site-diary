import BookTabs from "./components/BookTabs";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Binder from './components/Binder/Binder';
import Dashboard from './components/Dashboard/Dashboard';
import Sites from './components/Sites/Sites';
import Diary from './components/Diary/Diary';
import Calendar from './components/Calendar/Calendar';
import Tasks from './components/Tabs/Tasks';
import Documents from './components/Tabs/Documents';
import { useLocalStorage, exportData, importData } from './hooks/useLocalStorage';
import { initialSites, initialTasks } from './data/initialData';
import { Download, Upload, Menu } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [sites, setSites] = useLocalStorage('ll-sites', initialSites);
  const [tasks, setTasks] = useLocalStorage('ll-tasks', initialTasks);
  const [showMenu, setShowMenu] = useState(false);

  const handleNavigate = (tab, siteId = null) => {
    setActiveTab(tab);
    if (siteId) setSelectedSiteId(siteId);
  };

  const handleUpdateSite = (updatedSite) => {
    setSites(sites.map(s => s.id === updatedSite.id ? updatedSite : s));
  };

  const handleUpdateSites = (newSites) => {
    setSites(newSites);
  };

  const handleUpdateTasks = (newTasks) => {
    setTasks(newTasks);
  };

  const handleExport = () => {
    exportData({ sites, tasks }, 'long-line-backup');
  };

  const handleImport = (data) => {
    if (data.sites) setSites(data.sites);
    if (data.tasks) setTasks(data.tasks);
    alert('Data imported successfully!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard sites={sites} tasks={tasks} onNavigate={handleNavigate} />;
      case 'sites':
        if (selectedSiteId) {
          const site = sites.find(s => s.id === selectedSiteId);
          if (site) {
            return (
              <Diary 
                site={site} 
                onBack={() => setSelectedSiteId(null)}
                onUpdateSite={handleUpdateSite}
              />
            );
          }
        }
        return <Sites sites={sites} onUpdateSites={handleUpdateSites} onSelectSite={setSelectedSiteId} />;
      case 'diary':
        return <Sites sites={sites} onUpdateSites={handleUpdateSites} onSelectSite={setSelectedSiteId} />;
      case 'calendar':
        return <Calendar sites={sites} tasks={tasks} onNavigate={handleNavigate} />;
      case 'tasks':
        return <Tasks tasks={tasks} sites={sites} onUpdateTasks={handleUpdateTasks} />;
      case 'docs':
        return <Documents sites={sites} onUpdateSites={handleUpdateSites} />;
      default:
        return <Dashboard sites={sites} tasks={tasks} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-300">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800 text-white px-4 py-2 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-bold tracking-wide">LONG LINE</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExport}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
            title="Export Data"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={() => importData(handleImport)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
            title="Import Data"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed top-14 left-0 bottom-0 w-64 bg-slate-800 text-white z-40 shadow-xl"
          >
            <div className="p-4 space-y-2">
              {['Dashboard', 'Sites', 'Diary', 'Calendar', 'Tasks', 'Documents'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item.toLowerCase());
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.toLowerCase() ? 'bg-blue-600' : 'hover:bg-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-14">
        <Binder activeTab={activeTab} onTabChange={setActiveTab}>
          <BookTabs setActiveTab={setActiveTab} activeTab={activeTab} />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedSiteId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </Binder>
      </div>
    </div>
  );
}

export default App;
