
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { User, Dog, ScanQrCode, Clipboard } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth') === 'true');
  const location = useLocation();

  // If not authenticated and not on login page, show only the children (login page)
  if (!isAuth && location.pathname !== '/') {
    // Redirect happens in the individual pages
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    setIsAuth(false);
    window.location.href = '/';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {isAuth && (
          <AppSidebar />
        )}
        <div className="flex-1 flex flex-col">
          {isAuth && (
            <header className="h-16 border-b flex items-center justify-between px-4 bg-white">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="h-8 w-8 p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors" />
                <h1 className="text-xl font-semibold text-vet-dark">PetCare Clinic CRM</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Logout
                </Button>
              </div>
            </header>
          )}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { collapsed } = useSidebar();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) => 
    isActive 
      ? "bg-vet-light text-vet-dark font-medium border-l-4 border-vet-blue" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} bg-white border-r transition-all duration-300`}
      collapsible
    >
      <SidebarContent className="py-4">
        <div className={`flex justify-center mb-8 ${collapsed ? "" : "px-4"}`}>
          {!collapsed ? (
            <div className="font-bold text-xl text-vet-blue">PetCare CRM</div>
          ) : (
            <Dog className="h-6 w-6 text-vet-blue" />
          )}
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/dashboard" className={`flex items-center py-2 px-4 ${getNavCls({ isActive: currentPath === "/dashboard" })}`}>
                <Clipboard className="mr-2 h-5 w-5" />
                {!collapsed && <span>Dashboard</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/scanner" className={`flex items-center py-2 px-4 ${getNavCls({ isActive: currentPath === "/scanner" })}`}>
                <ScanQrCode className="mr-2 h-5 w-5" />
                {!collapsed && <span>QR Scanner</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/pets" className={`flex items-center py-2 px-4 ${getNavCls({ isActive: currentPath.includes("/pet") })}`}>
                <Dog className="mr-2 h-5 w-5" />
                {!collapsed && <span>Pets</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/profile" className={`flex items-center py-2 px-4 ${getNavCls({ isActive: currentPath === "/profile" })}`}>
                <User className="mr-2 h-5 w-5" />
                {!collapsed && <span>Profile</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

function useSidebar() {
  // A simplified version of the hook just for our needs
  const [collapsed, setCollapsed] = useState(false);
  
  return { collapsed, setCollapsed };
}

export default Layout;
