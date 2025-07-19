
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Package, 
  CreditCard, 
  Users, 
  FileText, 
  StickyNote,
  TrendingUp,
  AlertTriangle,
  IndianRupee,
  Star,
  LogOut
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ShopOwnerDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const stats = [
    {
      title: "Total Sales",
      value: "₹1,24,500",
      change: "+12.5%",
      icon: <IndianRupee className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      title: "Pending Payments",
      value: "₹45,200",
      change: "-5.2%",
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-orange-600"
    },
    {
      title: "Active Customers",
      value: "143",
      change: "+8.1%",
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "Low Stock Items",
      value: "12",
      change: "+3",
      icon: <Package className="w-5 h-5" />,
      color: "text-red-600"
    }
  ];

  const recentTransactions = [
    { customer: "Rajesh Kumar", amount: "₹3,500", status: "paid", date: "Today" },
    { customer: "Priya Sharma", amount: "₹1,200", status: "pending", date: "Yesterday" },
    { customer: "Amit Singh", amount: "₹5,800", status: "paid", date: "2 days ago" },
    { customer: "Sunita Devi", amount: "₹2,400", status: "overdue", date: "5 days ago" }
  ];

  const lowStockItems = [
    { name: "NPK Fertilizer", current: "5 kg", minimum: "20 kg", status: "critical" },
    { name: "Pesticide Spray", current: "8 bottles", minimum: "15 bottles", status: "low" },
    { name: "Seed Packets", current: "12 packs", minimum: "25 packs", status: "low" }
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
              <Badge className="bg-green-100 text-green-800">
                <Star className="w-3 h-3 mr-1" />
                Trust Score: 4.8
              </Badge>
              <Button className="bg-green-600 hover:bg-green-700">
                <FileText className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Transactions */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Latest customer payments and dues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.customer}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{transaction.amount}</p>
                        <Badge variant={
                          transaction.status === 'paid' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  Stock Alerts
                </CardTitle>
                <CardDescription>Items running low on inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Current: {item.current}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Min: {item.minimum}</p>
                        <Badge variant={item.status === 'critical' ? 'destructive' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <FileText className="w-6 h-6" />
                  <span>New Invoice</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Package className="w-6 h-6" />
                  <span>Manage Stock</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Users className="w-6 h-6" />
                  <span>Customer Reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <StickyNote className="w-6 h-6" />
                  <span>Add Notes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ShopOwnerDashboard;
