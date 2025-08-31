"use client";

import React from "react";

export type TabType = "overview" | "reservations" | "venues";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "overview" as TabType, name: "Overview" },
    { id: "reservations" as TabType, name: "Reservations" },
    { id: "venues" as TabType, name: "Venues" },
  ];

  return (
    <div className="mb-6">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
