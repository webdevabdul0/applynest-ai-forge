import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-gray-dark">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
