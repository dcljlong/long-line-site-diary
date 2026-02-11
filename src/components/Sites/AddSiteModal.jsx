import React, { useState } from 'react';

const AddSiteModal = ({ onClose, onSave }) => {
    const [form, setForm] = useState({
    jobNumber: '',
    name: '',
    projectAddress: '',
    mainContractor: '',
    contactPhone: '',
    contactEmail: '',
    status: 'active',
    description: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
        if (!form.jobNumber || !String(form.jobNumber).trim()) {
      alert('Job number is required');
      return;
    }
    if (!form.name || !String(form.name).trim()) {
      alert('Site name is required');
      return;
    }
        const newSite = {
      ...form,
      address: (form.projectAddress || '').trim(),
      mainContractorName: (form.mainContractor || '').trim(),
      mainContractorLogo: '',
      id: crypto.randomUUID(),
      milestones: [],
      budget: { total: 0, spent: 0, remaining: 0, categories: {} },
      tasks: []
    };
    onSave(newSite);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-bold mb-3">Add New Site</h3>

        <label className="block text-sm font-medium">Job Number</label>
        <input
          name="jobNumber"
          onChange={handleChange}
          value={form.jobNumber}
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block text-sm font-medium">Main Contractor</label>
        <input
          name="mainContractor"
          onChange={handleChange}
          value={form.mainContractor}
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block text-sm font-medium">Project Address</label>
        <input
          name="projectAddress"
          onChange={handleChange}
          value={form.projectAddress}
          className="w-full border rounded p-2 mb-3"
        /><label className="block text-sm font-medium">Name</label>
        <input 
          name="name"
          onChange={handleChange}
          value={form.name}
          className="w-full border rounded p-2 mb-3"
        />
<label className="block text-sm font-medium">Phone</label>
        <input 
          name="contactPhone"
          onChange={handleChange}
          value={form.contactPhone}
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block text-sm font-medium">Email</label>
        <input 
          name="contactEmail"
          onChange={handleChange}
          value={form.contactEmail}
          className="w-full border rounded p-2 mb-3"
        />

        <label className="block text-sm font-medium">Status</label>
        <select 
          name="status"
          onChange={handleChange}
          value={form.status}
          className="w-full border rounded p-2 mb-3"
        >
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="completed">Completed</option>
          <option value="onHold">On Hold</option>
        </select>

        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          onChange={handleChange}
          value={form.description}
          className="w-full border rounded p-2 mb-3"
        />

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddSiteModal;

