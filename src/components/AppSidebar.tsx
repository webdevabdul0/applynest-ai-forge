
import { Home, FileText, PenTool, FolderOpen, Settings, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Resume Builder",
    url: "/resume-builder",
    icon: FileText,
  },
  {
    title: "Cover Letters",
    url: "/cover-letter-builder",
    icon: PenTool,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: FolderOpen,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar className="border-r border-applynest-slate-light/20">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-applynest-emerald to-applynest-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AN</span>
          </div>
          <span className="text-xl font-bold gradient-text">ApplyNest</span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-applynest-slate/50">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="w-8 h-8 bg-applynest-emerald/20 rounded-full flex items-center justify-center">
              <span className="text-applynest-emerald font-medium">
                {user?.profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">{user?.profile?.full_name || 'User'}</p>
              <p className="text-xs">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-applynest-slate/50"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
