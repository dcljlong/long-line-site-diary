import React from "react";

const tabs = [
  { label: "Dashboard", key: "dashboard", color: "bg-blue-600" },
  { label: "Sites", key: "sites", color: "bg-orange-500" },
  { label: "Diary", key: "diary", color: "bg-green-600" },
  { label: "Calendar", key: "calendar", color: "bg-purple-600" },
  { label: "Tasks", key: "tasks", color: "bg-red-600" },
  { label: "Docs", key: "docs", color: "bg-teal-600" },
];

const BookTabs = ({ setActiveTab, activeTab }) => {
  return (
    <div className="absolute top-20 right-[-80px] flex flex-col space-y-2 z-10">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`text-white font-semibold text-xs py-2 px-3 w-[80px] rounded-l-md shadow-md hover:brightness-110 transition-all ${tab.color} ${
            activeTab === tab.key ? "ring-2 ring-white" : ""
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default BookTabs;
