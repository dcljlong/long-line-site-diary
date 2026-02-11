import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, X } from "lucide-react";

import AddSiteModal from "./AddSiteModal";

const Sites = ({ sites, onUpdateSites, onSelectSite }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const editingSite = useMemo(
    () => (sites || []).find((s) => s.id === editingId) || null,
    [sites, editingId]
  );

  const [draft, setDraft] = useState(null);

  const openEdit = (siteId) => {
    const s = (sites || []).find((x) => x.id === siteId);
    if (!s) return;

    setEditingId(siteId);
    setDraft({
      jobNumber: s.jobNumber || "",
      name: s.name || "",
      projectAddress: s.projectAddress || s.address || "",
      status: s.status || "Active",
      description: s.description || "",
      mainContractor: s.mainContractor || s.mainContractorName || "",
      mainContractorLogo: s.mainContractorLogo || "", // dataURL
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEdit = () => {
    if (!editingId || !draft) return;

    const jobNumber = (draft.jobNumber || "").trim();
    if (!jobNumber) {
      alert("Job number is required.");
      return;
    }

    const name = (draft.name || "").trim();
    if (!name) {
      alert("Site name is required.");
      return;
    }

    const projectAddress = (draft.projectAddress || "").trim();
    const mainContractor = (draft.mainContractor || "").trim();

    const next = (sites || []).map((s) => {
      if (s.id !== editingId) return s;
      return {
        ...s,
        jobNumber,
        name,
        projectAddress,
        address: projectAddress, // back-compat alias
        status: (draft.status || "Active").trim(),
        description: (draft.description || "").trim(),
        mainContractor,
        mainContractorName: mainContractor, // back-compat alias
        mainContractorLogo: draft.mainContractorLogo || "",
      };
    });

    onUpdateSites(next);
    closeEdit();
  };

  const handleDeleteSite = (siteId) => {
    if (confirm("Are you sure you want to delete this site?")) {
      onUpdateSites((sites || []).filter((s) => s.id !== siteId));
    }
  };

  const handleAddSite = (newSite) => {
    // Hydrate to include new structured fields + back-compat aliases
    const hydrated = {
      jobNumber: newSite.jobNumber || "",
      projectAddress: newSite.projectAddress || newSite.address || "",
      address: newSite.projectAddress || newSite.address || "",
      mainContractor: newSite.mainContractor || newSite.mainContractorName || "",
      mainContractorName: newSite.mainContractor || newSite.mainContractorName || "",
      mainContractorLogo: newSite.mainContractorLogo || "",
      ...newSite,
    };

    onUpdateSites([...(sites || []), hydrated]);
    setShowAddModal(false);
  };

  const onPickLogo = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setDraft((d) => ({ ...(d || {}), mainContractorLogo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Project Sites</h2>
          <p className="text-gray-500 text-sm">
            Manage sites. Job number + contractor details.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Site
        </button>
      </div>

      {(sites || []).length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500">No sites yet. Add your first project site.</p>
        </div>
      )}

      {/* Compact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {(sites || []).map((site) => {
          const logo = site.mainContractorLogo || "";
          const contractor = site.mainContractor || site.mainContractorName || "";
          const addr = site.projectAddress || site.address || "";
          const title = site.jobNumber
            ? `[${site.jobNumber}] – ${site.name || "Site"}`
            : (site.name || "Site");

          return (
            <motion.div
              key={site.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  {/* Contractor logo */}
                  <div className="w-10 h-10 rounded-md border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                    {logo ? (
                      <img
                        src={logo}
                        alt="Contractor logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-[10px] text-gray-400 px-1 text-center">
                        No logo
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="font-semibold text-gray-800 truncate"
                        title={title}
                      >
                        {title}
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 shrink-0">
                        {site.status || "Active"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 truncate" title={addr}>
                      {addr || "—"}
                    </div>

                    <div className="text-[11px] text-gray-500 truncate" title={contractor}>
                      {contractor ? `MC: ${contractor}` : "MC: —"}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onSelectSite(site.id)}
                    className="flex-1 bg-blue-600 text-white py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Open Diary
                  </button>

                  <button
                    onClick={() => openEdit(site.id)}
                    className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-gray-700" />
                  </button>

                  <button
                    onClick={() => handleDeleteSite(site.id)}
                    className="px-3 py-1.5 border border-red-300 rounded hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingSite && draft && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
            >
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-800">Edit Site</div>
                  <div className="text-xs text-gray-500 truncate" title={editingSite.name}>
                    {editingSite.name}
                  </div>
                </div>
                <button
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={closeEdit}
                  title="Close"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Site Name
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={draft.name}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Job Number
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={draft.jobNumber}
                      onChange={(e) => setDraft((d) => ({ ...d, jobNumber: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={draft.status}
                      onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                    >
                      <option>Active</option>
                      <option>On Hold</option>
                      <option>Complete</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Main Contractor
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={draft.mainContractor}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, mainContractor: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Project Address
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={draft.projectAddress}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, projectAddress: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={3}
                    value={draft.description}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, description: e.target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Main Contractor Logo
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                        {draft.mainContractorLogo ? (
                          <img
                            src={draft.mainContractorLogo}
                            alt="Contractor logo"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-[10px] text-gray-400 px-1 text-center">
                            No logo
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="block w-full text-xs text-gray-600"
                          onChange={(e) => onPickLogo(e.target.files?.[0] || null)}
                        />
                        {draft.mainContractorLogo ? (
                          <button
                            className="mt-1 text-xs text-red-600 hover:underline"
                            onClick={() =>
                              setDraft((d) => ({ ...(d || {}), mainContractorLogo: "" }))
                            }
                            type="button"
                          >
                            Remove logo
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div />
                </div>
              </div>

              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 text-sm"
                  onClick={closeEdit}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                  onClick={saveEdit}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAddModal && (
        <AddSiteModal onClose={() => setShowAddModal(false)} onSave={handleAddSite} />
      )}
    </div>
  );
};

export default Sites;
