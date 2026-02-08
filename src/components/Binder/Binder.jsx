import React from 'react';
import { motion } from 'framer-motion';

const Binder = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', color: 'bg-binder-tabBlue' },
    { id: 'sites', label: 'Sites', color: 'bg-binder-tabOrange' },
    { id: 'diary', label: 'Diary', color: 'bg-binder-tabGreen' },
    { id: 'calendar', label: 'Calendar', color: 'bg-binder-tabPurple' },
    { id: 'tasks', label: 'Tasks', color: 'bg-binder-tabRed' },
    { id: 'docs', label: 'Docs', color: 'bg-binder-tabTeal' },
  ];

  return (
    <div className="min-h-screen bg-gray-300 p-4 md:p-8 flex items-center justify-center">
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="relative flex">

          {/* LEFT COVER */}
          <motion.div
            className="hidden lg:block w-80 h-[800px] leather-texture rounded-l-2xl shadow-binder relative overflow-hidden"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute left-4 top-16 w-6 h-6 rounded-full metal-ring" />
            <div className="absolute left-4 top-1/2 w-6 h-6 rounded-full metal-ring -translate-y-1/2" />
            <div className="absolute left-4 bottom-16 w-6 h-6 rounded-full metal-ring" />

            <div className="absolute inset-8 top-12 bottom-24 bg-gray-900 rounded-lg overflow-hidden shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop"
                alt="Construction site"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="font-display text-3xl font-bold text-white tracking-wide">
                  LONG LINE
                </h1>
                <p className="text-gray-300 text-sm mt-1 tracking-widest uppercase">
                  Site Diary
                </p>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs tracking-widest uppercase">
                Project Management
              </span>
            </div>
          </motion.div>

          {/* RIGHT PAGE */}
          <div className="flex-1 relative">

            {/* RINGS */}
            <div className="absolute left-0 top-0 bottom-0 w-16 z-20 flex flex-col items-center py-12 space-y-24">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="relative">
                  <div className="w-8 h-12 metal-ring rounded-full shadow-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-8 bg-gray-400 rounded-full shadow-inner" />
                  </div>
                </div>
              ))}
            </div>

            {/* PAGE */}
            <motion.div
              className="ml-12 bg-binder-paper min-h-[800px] rounded-r-2xl shadow-binder relative overflow-hidden"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* HEADER */}
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold tracking-wide">
                    {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
                  </h2>
                  <div className="text-xs text-gray-300">
                    {new Date().toLocaleDateString('en-AU', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 h-[calc(800px-80px)] overflow-y-auto">
                {children}
              </div>

              {/* PAGE LINES */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)',
                  backgroundPosition: '0 60px'
                }}
              />
            </motion.div>

            {/* ✅ BOOK TABS — ACTIVE TAB IS LARGER */}
            <div className="absolute right-[-96px] top-24 bottom-24 flex flex-col justify-center gap-3 z-30">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={[
                      tab.color,
                      'text-white font-semibold',
                      isActive ? 'text-sm py-5 w-28' : 'text-xs py-3 w-24',
                      'px-4 rounded-l-lg shadow-md transition-all duration-200 ease-in-out',
                      isActive ? 'scale-105 ring-2 ring-white' : 'hover:translate-x-1'
                    ].join(' ')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>

          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden mt-4">
          <div className="leather-texture rounded-lg p-4 text-white shadow-lg">
            <h1 className="font-display text-2xl font-bold text-center">
              LONG LINE Site Diary
            </h1>
          </div>
          <div className="flex overflow-x-auto mt-2 space-x-2 pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`${tab.color} text-white px-4 py-2 rounded-full text-xs font-semibold`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Binder;
