import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Download, Trash2, Upload, Folder, File } from 'lucide-react';

const Documents = ({ sites, onUpdateSites }) => {
  const [selectedSite, setSelectedSite] = useState(sites[0]?.id || '');
  const [activeTab, setActiveTab] = useState('documents');

  const currentSite = sites.find(s => s.id === selectedSite);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload to storage. Here we simulate with object URLs
    const newDocs = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      date: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));

    if (currentSite) {
      const updatedSites = sites.map(s => {
        if (s.id === selectedSite) {
          return {
            ...s,
            [activeTab]: [...(s[activeTab] || []), ...newDocs]
          };
        }
        return s;
      });
      onUpdateSites(updatedSites);
    }
  };

  const deleteDocument = (docId) => {
    if (confirm('Delete this file?')) {
      const updatedSites = sites.map(s => {
        if (s.id === selectedSite) {
          return {
            ...s,
            [activeTab]: (s[activeTab] || []).filter(d => d.id !== docId)
          };
        }
        return s;
      });
      onUpdateSites(updatedSites);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const documents = currentSite?.[activeTab] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Documents & Photos</h2>
          <p className="text-gray-500 text-sm">Manage project files and site photos</p>
        </div>
      </div>

      {/* Site Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sites.map(site => (
          <button
            key={site.id}
            onClick={() => setSelectedSite(site.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSite === site.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {site.name}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-2 px-1 text-sm font-medium flex items-center gap-2 ${
            activeTab === 'documents' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Documents
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`pb-2 px-1 text-sm font-medium flex items-center gap-2 ${
            activeTab === 'photos' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Image className="w-4 h-4" />
          Photos
        </button>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
        <input 
          type="file" 
          multiple 
          className="hidden" 
          id="file-upload"
          onChange={handleFileUpload}
          accept={activeTab === 'photos' ? 'image/*' : '*/*'}
        />
        <label 
          htmlFor="file-upload"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer inline-block hover:bg-blue-700 transition-colors"
        >
          Select Files
        </label>
      </div>

      {/* File List */}
      {documents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No {activeTab} yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group"
            >
              {activeTab === 'photos' && doc.type?.startsWith('image/') ? (
                <div className="aspect-video bg-gray-100 relative">
                  <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <File className="w-16 h-16 text-gray-300" />
                </div>
              )}
              <div className="p-3">
                <p className="font-medium text-sm text-gray-800 truncate" title={doc.name}>{doc.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                <p className="text-xs text-gray-400">{new Date(doc.date).toLocaleDateString('en-AU')}</p>
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={doc.url} 
                    download={doc.name}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 rounded text-xs flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                  <button 
                    onClick={() => deleteDocument(doc.id)}
                    className="px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;