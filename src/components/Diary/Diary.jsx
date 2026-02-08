import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, HardHat, Truck, AlertTriangle, Camera, ChevronLeft, Save, Plus } from 'lucide-react';

const Diary = ({ site, onBack, onUpdateSite }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeSection, setActiveSection] = useState('general');
  const [entry, setEntry] = useState({
    date: selectedDate,
    weather: { condition: 'Sunny', temperature: '', wind: '' },
    labor: [],
    workCompleted: '',
    deliveries: [],
    safety: { incidents: false, toolboxTalk: false, talkTopic: '', ppeCompliance: 'good' },
    nextDayPlan: '',
    photos: [],
    notes: ''
  });

  const weatherOptions = ['Sunny', 'Cloudy', 'Rain', 'Windy', 'Storm', 'Fog', 'Extreme Heat'];
  const trades = ['Carpenter', 'Electrician', 'Plumber', 'Painter', 'Tiler', 'Plasterer', 'Laborer', 'Other'];

  const sections = [
    { id: 'general', label: 'General', icon: Calendar },
    { id: 'labor', label: 'Labor', icon: Users },
    { id: 'work', label: 'Work Done', icon: HardHat },
    { id: 'deliveries', label: 'Deliveries', icon: Truck },
    { id: 'safety', label: 'Safety', icon: AlertTriangle },
    { id: 'photos', label: 'Photos', icon: Camera },
  ];

  const handleSave = () => {
    const updatedEntries = [...(site.diaryEntries || [])];
    const existingIndex = updatedEntries.findIndex(e => e.date === selectedDate);
    if (existingIndex >= 0) updatedEntries[existingIndex] = entry;
    else updatedEntries.push(entry);
    onUpdateSite({ ...site, diaryEntries: updatedEntries });
    alert('Diary entry saved!');
  };

  const addLabor = () => {
    setEntry({ ...entry, labor: [...entry.labor, { trade: 'Carpenter', count: 1, hours: 8, name: '' }] });
  };

  const updateLabor = (index, field, value) => {
    const updated = [...entry.labor];
    updated[index] = { ...updated[index], [field]: value };
    setEntry({ ...entry, labor: updated });
  };

  const removeLabor = (index) => {
    setEntry({ ...entry, labor: entry.labor.filter((_, i) => i !== index) });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weather</label>
                <select value={entry.weather.condition} onChange={(e) => setEntry({...entry, weather: {...entry.weather, condition: e.target.value}})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  {weatherOptions.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                <input type="text" placeholder="e.g., 24-28" value={entry.weather.temperature} onChange={(e) => setEntry({...entry, weather: {...entry.weather, temperature: e.target.value}})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wind</label>
                <input type="text" placeholder="e.g., Light breeze" value={entry.weather.wind} onChange={(e) => setEntry({...entry, weather: {...entry.weather, wind: e.target.value}})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">General Notes</label>
              <textarea rows={4} value={entry.notes} onChange={(e) => setEntry({...entry, notes: e.target.value})} placeholder="Daily overview, site conditions, general observations..." className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
          </div>
        );
      case 'labor':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Workers on Site</h3>
              <button onClick={addLabor} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700"><Plus className="w-4 h-4" /> Add Worker</button>
            </div>
            {entry.labor.map((worker, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Trade</label>
                    <select value={worker.trade} onChange={(e) => updateLabor(idx, 'trade', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm">{trades.map(t => <option key={t} value={t}>{t}</option>)}</select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Count</label>
                    <input type="number" min="1" value={worker.count} onChange={(e) => updateLabor(idx, 'count', parseInt(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Hours</label>
                    <input type="number" step="0.5" value={worker.hours} onChange={(e) => updateLabor(idx, 'hours', parseFloat(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                  </div>
                  <div className="flex items-end"><button onClick={() => removeLabor(idx)} className="text-red-600 hover:text-red-800 text-sm">Remove</button></div>
                </div>
              </motion.div>
            ))}
            {entry.labor.length === 0 && <p className="text-gray-400 text-center py-8">No workers added yet</p>}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Total Hours: {entry.labor.reduce((sum, w) => sum + (w.count * w.hours), 0).toFixed(1)}</p>
            </div>
          </div>
        );
      case 'work':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Completed Today</label>
              <textarea rows={6} value={entry.workCompleted} onChange={(e) => setEntry({...entry, workCompleted: e.target.value})} placeholder="Describe all work completed today by area/trade..." className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Day Plan</label>
              <textarea rows={3} value={entry.nextDayPlan} onChange={(e) => setEntry({...entry, nextDayPlan: e.target.value})} placeholder="Planned activities for tomorrow..." className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
          </div>
        );
      case 'safety':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5" />Safety Checklist</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={entry.safety.incidents} onChange={(e) => setEntry({...entry, safety: {...entry.safety, incidents: e.target.checked}})} className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-800">Any incidents or near misses?</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={entry.safety.toolboxTalk} onChange={(e) => setEntry({...entry, safety: {...entry.safety, toolboxTalk: e.target.checked}})} className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-red-800">Toolbox talk conducted?</span>
                </label>
                {entry.safety.toolboxTalk && <input type="text" placeholder="Topic of toolbox talk..." value={entry.safety.talkTopic} onChange={(e) => setEntry({...entry, safety: {...entry.safety, talkTopic: e.target.value}})} className="w-full border border-red-300 rounded px-3 py-2 text-sm" />}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PPE Compliance</label>
              <div className="flex gap-4">
                {['excellent', 'good', 'fair', 'poor'].map((level) => (
                  <label key={level} className="flex items-center gap-2">
                    <input type="radio" name="ppe" value={level} checked={entry.safety.ppeCompliance === level} onChange={(e) => setEntry({...entry, safety: {...entry.safety, ppeCompliance: e.target.value}})} className="text-blue-600" />
                    <span className="text-sm capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 'photos':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">Click to browse photos</p>
              <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer inline-block hover:bg-blue-700">Select Photos</label>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{site.name}</h2>
            <p className="text-sm text-gray-500">Daily Site Diary</p>
          </div>
        </div>
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"><Save className="w-4 h-4" />Save Entry</button>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button key={section.id} onClick={() => setActiveSection(section.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeSection === section.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <Icon className="w-4 h-4" />{section.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto">
        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
};

export default Diary;