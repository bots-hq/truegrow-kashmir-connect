
import { useState } from "react";
import { 
  Home, 
  Store, 
  Package, 
  CreditCard, 
  Users, 
  FileText, 
  BarChart3,
  StickyNote,
  MessageSquare,
  ShoppingCart,
  History,
  Star,
  Settings,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  userRole: "shop-owner" | "customer";
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const shopOwnerItems = [
    { title: "Dashboard", url: "/dashboard/shop-owner", icon: Home },
    { title: "Billing & Invoices", url: "/billing", icon: FileText },
    { title: "Stock Management", url: "/stock", icon: Package },
    { title: "Payment Tracking", url: "/payments", icon: CreditCard },
    { title: "Customer Reports", url: "/customers", icon: Users },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Notes", url: "/notes", icon: StickyNote },
  ];

  const customerItems = [
    { title: "Dashboard", url: "/dashboard/customer", icon: Home },
    { title: "Browse Products", url: "/products", icon: ShoppingCart },
    { title: "My Orders", url: "/orders", icon: History },
    { title: "Payments", url: "/customer-payments", icon: CreditCard },
    { title: "Nearby Shops", url: "/shops", icon: Store },
    { title: "My Scorecard", url: "/scorecard", icon: Star },
  ];

  const items = userRole === "shop-owner" ? shopOwnerItems : customerItems;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible>
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TG</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-800">TrueGrow</span>
              <Badge className={`ml-2 text-xs ${
                userRole === "shop-owner" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}>
                {userRole === "shop-owner" ? "Shop Owner" : "Customer"}
              </Badge>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/community" className={getNavCls}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Community Feed</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" className={getNavCls}>
                <Settings className="mr-2 h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
