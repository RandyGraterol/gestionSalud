
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType;
  onClick: () => void;
  isActive?: boolean;
}

interface AppSidebarProps {
  menuItems: MenuItem[];
  title: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ menuItems, title }) => {
  const { session, logout } = useAuth();

  return (
    <Sidebar className="border-r border-blue-100">
      <SidebarHeader className="border-b border-blue-100 p-3 lg:p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base lg:text-lg font-semibold text-blue-900 truncate">
              Sistema Médico
            </h2>
            <p className="text-sm text-blue-600 capitalize truncate">
              {session?.role === 'medical_staff' ? 'médico' : session?.role}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-700 font-medium text-sm px-3">
            {title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={item.onClick}
                      isActive={item.isActive}
                      className="w-full min-h-[40px] px-3 text-sm hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-900 flex items-center gap-3"
                    >
                      <Icon />
                      <span className="truncate flex-1 text-left">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-blue-100 p-3 lg:p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-blue-700">
            <User className="h-4 w-4" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{session?.name}</p>
              <p className="text-xs text-blue-500 capitalize truncate">
                ({session?.role === 'medical_staff' ? 'médico' : session?.role})
              </p>
            </div>
          </div>
          
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 text-sm h-9"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="truncate">Cerrar Sesión</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
