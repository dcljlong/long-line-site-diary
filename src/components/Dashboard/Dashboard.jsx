import React from 'react';

const Dashboard = ({ sites, tasks, onNavigate }) => {
  return (
    <div className="space-y-6">
      {sites.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-600">No sites yet</h2>
          <p className="text-gray-500 mt-2">Click "Sites" to get started with your first project.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map(site => (
              <div
                key={site.id}
                className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => onNavigate('sites', site.id)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{site.name}</h3>
                <p className="text-sm text-gray-500">{site.address}</p>
                <p className="mt-2 text-xs text-gray-400">{site.status} • {site.priority}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-md font-bold text-gray-700 mb-2">Upcoming Tasks</h4>
              <ul className="space-y-2">
                {tasks.slice(0, 5).map(task => (
                  <li key={task.id} className="text-sm text-gray-600">
                    • {task.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
