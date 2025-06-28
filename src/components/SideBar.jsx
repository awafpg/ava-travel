import React from "react";

const menuItems = [
  { key: "banner", label: "Manage Banner" },
  { key: "promo", label: "Manage Promo" },
  { key: "user", label: "Manage User" },
  { key: "category", label: "Manage Category" },
  { key: "activity", label: "Manage Activity" },
  { key: "transaction", label: "Manage Transaction" },
];

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  return (
    <div className="w-64 bg-blue-800 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`cursor-pointer p-2 rounded hover:bg-blue-600 ${
              activeMenu === item.key ? "bg-blue-600" : ""
            }`}
            onClick={() => setActiveMenu(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
