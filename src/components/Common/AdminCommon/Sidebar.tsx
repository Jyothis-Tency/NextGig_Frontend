import React from "react";
import { LayoutDashboard, Users, Building,DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Sidebar: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const navigate = useNavigate();
  const sidebarContents = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Users", path: "/admin/user-list" },
    { icon: Building, label: "Companies", path: "/admin/company-list" },
    { icon: DollarSign, label: "Subscriptions", path: "/admin/subscriptions" },
  ];

  return (
    <aside className="fixed top-16 left-0 bg-[#0f1117] w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-800">
      <nav className="space-y-1 p-4">
        {sidebarContents.map((item, index) => (
          <a
            key={index}
            // href={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer ${
              currentPage.toLowerCase() === item.label.toLowerCase()
                ? "bg-[#ffffff] text-[#000000]"
                : ""
            }`}
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};
