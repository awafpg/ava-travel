import React from "react";

const DashboardContent = ({ activeMenu }) => {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {activeMenu.replace("-", " ")}
      </h1>
      {/* Render komponen konten masing-masing sesuai activeMenu */}
      {activeMenu === "banner" && <p>Banner management content here.</p>}
      {activeMenu === "promo" && <p>Promo management content here.</p>}
      {activeMenu === "user" && <p>User management content here.</p>}
      {activeMenu === "category" && <p>Category management content here.</p>}
      {activeMenu === "activity" && <p>Activity management content here.</p>}
      {activeMenu === "payment" && (
        <p>Payment method management content here.</p>
      )}
      {activeMenu === "transaction" && (
        <p>Transaction management content here.</p>
      )}
    </div>
  );
};

export default DashboardContent;
