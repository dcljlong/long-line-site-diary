import React from 'react';

const DailySnapshotView = ({ date, snapshot, onClose }) => {
  if (!snapshot) {
    return (
      <div className="mt-4 bg-white p-6 rounded shadow">
        <h3 className="text-lg font-bold">No diary data for {date}</h3>
        <button onClick={onClose} className="mt-2 text-blue-600 underline">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white p-6 rounded shadow space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Diary — {date}</h3>
        <button onClick={onClose} className="text-blue-600 underline">
          Close
        </button>
      </div>

      <div>
        <h4 className="font-semibold">Diary Entries</h4>
        {snapshot.diaryEntries?.length
          ? snapshot.diaryEntries.map((e, i) => (
              <div key={i} className="text-sm border-b py-1">
                {e.text}
              </div>
            ))
          : <p className="text-gray-500">None</p>}
      </div>

      <div>
        <h4 className="font-semibold">Completed Tasks</h4>
        {snapshot.tasksCompleted?.length
          ? snapshot.tasksCompleted.map(t => (
              <div key={t.id} className="text-sm">
                {t.title}
              </div>
            ))
          : <p className="text-gray-500">None</p>}
      </div>

      <div>
        <h4 className="font-semibold">Sites Updated</h4>
        {snapshot.sitesUpdated?.length
          ? snapshot.sitesUpdated.map(s => (
              <div key={s.id} className="text-sm">
                {s.name}
              </div>
            ))
          : <p className="text-gray-500">None</p>}
      </div>
    </div>
  );
};

export default DailySnapshotView;
