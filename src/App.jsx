import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import Sites from "./components/Sites/Sites";
import Diary from "./components/Diary/Diary";
import Calendar from "./components/Calendar/Calendar";
import Tasks from "./components/Tabs/Tasks";
import Documents from "./components/Tabs/Documents";
import { useLocalStorage, exportData, importData } from "./hooks/useLocalStorage";
import { initialSites, initialTasks } from "./data/initialData";
import { Download, Upload, Menu, ArrowLeft } from "lucide-react";
import { saveSnapshot } from "./utils/snapshot";

function normalizeTab(input) {
  const t = (input || "").toString().toLowerCase().trim();
  if (!t) return "dashboard";
  if (t === "documents") return "docs";
  return t;
}

function getHashTab() {
  return normalizeTab((window.location.hash || "#dashboard").replace("#", ""));
}

function setHashTab(tab) {
  const key = normalizeTab(tab);
  if ((window.location.hash || "").replace("#", "") !== key) {
    window.location.hash = key;
  }
}

function titleFor(tab, selectedSiteId) {
  const t = normalizeTab(tab);
  if (selectedSiteId) return "Site Diary";
  if (t === "dashboard") return "Dashboard Overview";
  if (t === "diary") return "Diary";
  if (t === "calendar") return "Calendar";
  if (t === "projects") return "Projects";
  if (t === "tasks") return "Tasks";
  if (t === "docs") return "Documents";
  if (t === "settings") return "Settings";
  return "Long Line Site Diary";
}

function normalizeTask(t) {
  const nowIso = new Date().toISOString();
  const safe = t && typeof t === 'object' ? t : {};

  const id = (safe.id || '').toString() || ('t' + Date.now());
  const title = (safe.title || '').toString();

  const jobId = (safe.jobId || safe.siteId || '').toString();

  const hasStatus = !!safe.status;
  const statusRaw = (safe.status || '').toString().toLowerCase();
  const status =
    statusRaw === 'planned' || statusRaw === 'active' || statusRaw === 'complete'
      ? statusRaw
      : (status ? 'complete' : 'active');

  const startDate = safe.startDate ? safe.startDate : '';
  const dueDate = safe.dueDate ? safe.dueDate : '';

  const category = (safe.category || 'urgent').toString();
  const priority = (safe.priority || 'medium').toString();

  const scopeType = (safe.scopeType || 'other').toString();

  const createdAt = (safe.createdAt || nowIso).toString();
  const updatedAt = (safe.updatedAt || nowIso).toString();

  return {
    id,
    jobId,
    title,
    category,
    priority,
    status,
    startDate,
    dueDate,
    scopeType,
    createdAt,
    updatedAt
  };
}

function normalizeTasks(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map(normalizeTask);
}
function App() {
  const [activeTab, setActiveTab] = useState(() => getHashTab());
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [sites, setSites] = useLocalStorage("ll-sites", initialSites);
  const [tasks, setTasks] = useLocalStorage("ll-tasks", normalizeTasks(initialTasks));
  const [showMenu, setShowMenu] = useState(false);

  const todayKey = new Date().toISOString().slice(0, 10);

  const tasksNorm = useMemo(() => normalizeTasks(tasks), [tasks]);

  useEffect(() =>  {
    const onHash = () => {
      const next = getHashTab();
      setActiveTab(next);
      setSelectedSiteId(null);
    };
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleNavigate = (tab, siteId = null) => {
    const key = normalizeTab(tab);
    setActiveTab(key);
    setHashTab(key);
    if (siteId) setSelectedSiteId(siteId);
  };

  const handleUpdateSite = (updatedSite) => {
    const updatedSites = sites.map((s) => (s.id === updatedSite.id ? updatedSite : s));
    setSites(updatedSites);
    saveSnapshot(todayKey, { sites: updatedSites, tasks: tasksNorm });
  };

  const handleUpdateSites = (newSites) => {
    setSites(newSites);
    saveSnapshot(todayKey, { sites: newSites, tasks: tasksNorm });
  };

  const handleUpdateTasks = (newTasks) => {
    const normalized = normalizeTasks(newTasks);
    setTasks(normalized);
    saveSnapshot(todayKey, { sites, tasks: normalized });
  };

  const handleExport = () => {
    exportData({ sites, tasks: tasksNorm }, "long-line-backup");
  };

  const handleImport = (data) => {
    if (data.sites) setSites(data.sites);
    if (data.tasks) setTasks(data.tasks);
    alert("Data imported successfully!");
  };

  const goBack = () => {
    if (selectedSiteId) {
      setSelectedSiteId(null);
      setActiveTab("diary");
      setHashTab("diary");
      return;
    }
    setActiveTab("dashboard");
    setHashTab("dashboard");
  };

  const pageTitle = useMemo(() => titleFor(activeTab, selectedSiteId), [activeTab, selectedSiteId]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard sites={sites} tasks={tasksNorm} onNavigate={handleNavigate} />;

      case "diary":
      case "projects":
        if (selectedSiteId) {
          const site = sites.find((s) => s.id === selectedSiteId);
          if (site) {
            return (
              <Diary
                site={site}
                onBack={() => {
                  setSelectedSiteId(null);
                  setActiveTab("diary");
                  setHashTab("diary");
                }}
                onUpdateSite={handleUpdateSite}
              />
            );
          }
        }
        return (
          <Sites
            sites={sites}
            onUpdateSites={handleUpdateSites}
            onSelectSite={(id) => {
              setSelectedSiteId(id);
              setActiveTab("diary");
              setHashTab("diary");
            }}
          />
        );

      case "calendar":
        return <Calendar sites={sites} tasks={tasksNorm} onNavigate={handleNavigate} />;

      case "tasks":
        return <Tasks tasks={tasksNorm} sites={sites} onUpdateTasks={handleUpdateTasks} />;

      case "docs":
        return <Documents sites={sites} onUpdateSites={handleUpdateSite} />;

      case "settings":
        return (
          <div className="p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-md border border-black/10 p-4">
              <div className="text-lg font-semibold text-slate-800">Settings</div>
              <div className="text-sm text-slate-600 mt-1">
                Placeholder screen (wire real settings next).
              </div>
            </div>
          </div>
        );

      default:
        return <Dashboard sites={sites} tasks={tasksNorm} onNavigate={handleNavigate} />;
    }
  };

  const showBack = activeTab !== "dashboard" || !!selectedSiteId;

  const mobileMenuItems = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Diary", key: "diary" },
    { label: "Calendar", key: "calendar" },
    { label: "Projects", key: "projects" },
    { label: "Tasks", key: "tasks" },
    { label: "Documents", key: "docs" },
    { label: "Settings", key: "settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-300">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800 text-white px-4 py-2 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {showBack && (
            <button
              onClick={goBack}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

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
              {mobileMenuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    handleNavigate(item.key);
                    setShowMenu(false);
                  }}
                  className={[
                    "w-full text-left px-4 py-3 rounded-lg transition-colors",
                    activeTab === item.key ? "bg-blue-600" : "hover:bg-slate-700",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-14">
        <DashboardLayout title={pageTitle}>
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
        </DashboardLayout>
      </div>
    </div>
  );
}

export default App;







