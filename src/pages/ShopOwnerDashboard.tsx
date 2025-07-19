
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Star,
  LogOut,
  IndianRupee,
  Users,
  CreditCard
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BillingForm } from "@/components/BillingForm";
import { RecentSales } from "@/components/RecentSales";
import { SalesManagement } from "@/components/SalesManagement";
import { supabase } from "@/integrations/supabase/client";

const ShopOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCustomers: 0,
    pendingPayments: 0
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      // Fetch sales statistics
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('total_amount, payment_status')
        .eq('shop_owner_id', user.id);

      if (salesError) {
        console.error('Error fetching sales:', salesError);
        return;
      }

      const totalSales = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      const pendingPayments = salesData?.filter(sale => sale.payment_status === 'pending')
        .reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;

      // Fetch unique customers count
      const { data: customersData, error: customersError } = await supabase
        .from('sales')
        .select('customer_id')
        .eq('shop_owner_id', user.id);

      if (customersError) {
        console.error('Error fetching customers:', customersError);
        return;
      }

      const uniqueCustomers = new Set(customersData?.map(sale => sale.customer_id)).size;

      setStats({
        totalSales,
        pendingPayments,
        totalCustomers: uniqueCustomers
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const dashboardStats = [
    {
      title: "Total Sales",
      value: `₹${stats.totalSales.toLocaleString()}`,
      icon: <IndianRupee className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      title: "Pending Payments",
      value: `₹${stats.pendingPayments.toLocaleString()}`,
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-orange-600"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <AppSidebar userRole="shop-owner" />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile?.business_name || 'Shop Owner Dashboard'}
                </h1>
                <p className="text-gray-600">
                  Welcome back, {profile?.full_name || user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <Button 
                  variant={activeTab === "dashboard" ? "default" : "outline"}
                  onClick={() => setActiveTab("dashboard")}
                >
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === "billing" ? "default" : "outline"}
                  onClick={() => setActiveTab("billing")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  New Sale
                </Button>
                <Button 
                  variant={activeTab === "manage" ? "default" : "outline"}
                  onClick={() => setActiveTab("manage")}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Manage Sales
                </Button>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Main Content */}
          {activeTab === "dashboard" && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {dashboardStats.map((stat, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-green-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Sales */}
              <RecentSales />
            </div>
          )}

          {activeTab === "billing" && (
            <BillingForm />
          )}

          {activeTab === "manage" && (
            <SalesManagement />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ShopOwnerDashboard;
