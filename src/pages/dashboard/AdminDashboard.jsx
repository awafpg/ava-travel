import React, { useState } from "react";
import Sidebar from "../../components/SideBar";
import DashboardContent from "../../components/DashboardContent";

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("banner");

  return (
    <div className="flex min-h-screen">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <DashboardContent activeMenu={activeMenu} />
    </div>
  );
};

export default AdminDashboard;
