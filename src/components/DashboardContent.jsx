import React from "react";
import ManageBanner from "../pages/dashboard/ManageBanner";
import ManagePromo from "../pages/dashboard/ManagePromo";
import ManageUser from "../pages/dashboard/ManageUser";
import ManageCategory from "../pages/dashboard/ManageCategory";
import ManageActivity from "../pages/dashboard/ManageActivity";

import ManageTransaction from "../pages/dashboard/ManageTransaction";

const DashboardContent = ({ activeMenu }) => {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {activeMenu.replace("-", " ")}
      </h1>
      {/* Render komponen konten masing-masing sesuai activeMenu */}
      {activeMenu === "banner" && <ManageBanner />}
      {activeMenu === "promo" && <ManagePromo />}
      {activeMenu === "user" && <ManageUser />}
      {activeMenu === "category" && <ManageCategory />}
      {activeMenu === "activity" && <ManageActivity />}
      {activeMenu === "transaction" && <ManageTransaction />}
    </div>
  );
};

export default DashboardContent;
