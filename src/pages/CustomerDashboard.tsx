
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  CreditCard, 
  History, 
  Star,
  Search,
  Filter,
  Heart,
  MapPin,
  Clock,
  IndianRupee,
  Copy,
  User
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CustomerDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  // State for real data
  const [stats, setStats] = useState({
    totalPurchases: 0,
    pendingDues: 0,
    completedOrders: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [pendingDues, setPendingDues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Static data (would be fetched from database in real app)
  const nearbyShops: any[] = [];

  // Fetch customer's sales data
  useEffect(() => {
    if (profile) {
      if (profile.customer_id) {
        fetchCustomerData();
      } else {
        // Profile exists but no customer_id, stop loading
        setLoading(false);
      }
    }
  }, [profile]);

  const fetchCustomerData = async () => {
    if (!profile?.customer_id) return;

    try {
      setLoading(true);

      // Fetch sales records for this customer
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          shop_owner:profiles!shop_owner_id(full_name, business_name)
        `)
        .eq('customer_id', profile.customer_id)
        .order('sale_date', { ascending: false });

      if (salesError) {
        console.error('Error fetching sales:', salesError);
        return;
      }

      // Process sales data
      const sales = salesData || [];
      
      // Calculate stats
      const totalPurchases = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
      const pendingDues = sales
        .filter(sale => sale.payment_status === 'pending')
        .reduce((sum, sale) => sum + Number(sale.total_amount), 0);
      const completedOrders = sales.filter(sale => sale.payment_status === 'paid').length;

      setStats({
        totalPurchases,
        pendingDues, 
        completedOrders
      });

      // Format recent orders
      const formattedOrders = sales.slice(0, 5).map(sale => ({
        id: sale.id,
        invoiceNumber: sale.invoice_number,
        shop: sale.shop_owner?.business_name || sale.shop_owner?.full_name || 'Unknown Shop',
        items: JSON.parse(String(sale.items || '[]')).map((item: any) => item.name).join(', ') || 'No items',
        amount: `₹${Number(sale.total_amount).toFixed(2)}`,
        status: sale.payment_status,
        date: new Date(sale.sale_date).toLocaleDateString()
      }));

      setRecentOrders(formattedOrders);

      // Format pending dues
      const pendingDuesList = sales
        .filter(sale => sale.payment_status === 'pending')
        .map(sale => ({
          id: sale.id,
          shop: sale.shop_owner?.business_name || sale.shop_owner?.full_name || 'Unknown Shop',
          amount: `₹${Number(sale.total_amount).toFixed(2)}`,
          dueDate: new Date(sale.sale_date).toLocaleDateString(),
          priority: 'medium'
        }));

      setPendingDues(pendingDuesList);

    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic stats based on real data
  const dynamicStats = [
    {
      title: "Total Purchases",
      value: `₹${stats.totalPurchases.toLocaleString()}`,
      description: "All time",
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "Pending Dues",
      value: `₹${stats.pendingDues.toLocaleString()}`,
      description: `${pendingDues.length} invoice(s)`,
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-orange-600"
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders.toString(),
      description: "Paid orders",
      icon: <Star className="w-5 h-5" />,
      color: "text-green-600"
    }
  ];

  const copyCustomerId = () => {
    if (profile?.customer_id) {
      navigator.clipboard.writeText(profile.customer_id);
      toast({
        title: "Copied!",
        description: "Customer ID copied to clipboard",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <AppSidebar userRole="customer" />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
                <p className="text-gray-600">Discover products and manage your purchases</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-gray-100 text-gray-600">
                <Star className="w-3 h-3 mr-1" />
                Trust Score: N/A
              </Badge>
            </div>
          </div>

          {/* Customer ID Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Your Customer ID</h3>
                    <p className="text-blue-100 text-sm">Share this ID with shop owners when making purchases</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold mb-2">
                    {loading ? 'Loading...' : (profile?.customer_id || 'Not generated')}
                  </p>
                  <Button 
                    onClick={copyCustomerId} 
                    size="sm" 
                    variant="secondary"
                    className="bg-white/20 text-white hover:bg-white/30 border-white/30"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy ID
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {dynamicStats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-600">
                      View Details
                    </Button>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filter */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search for products, shops, or categories..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Near Me
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Nearby Shops */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Nearby Shops
                  </CardTitle>
                  <CardDescription>Agricultural suppliers in your area</CardDescription>
                </CardHeader>
                <CardContent>
                  {nearbyShops.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No shops found in your area yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {nearbyShops.map((shop, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                          <img 
                            src={shop.image} 
                            alt={shop.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{shop.name}</h4>
                              <Button size="sm" variant="ghost" className="text-red-500">
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{shop.location}</p>
                            <p className="text-sm text-blue-600 mb-2">{shop.speciality}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">{shop.rating}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {shop.offers}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pending Dues */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IndianRupee className="w-5 h-5 mr-2 text-orange-600" />
                  Pending Dues
                </CardTitle>
                <CardDescription>Outstanding payments</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingDues.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending dues.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingDues.map((due, index) => (
                      <div key={index} className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900 text-sm">{due.shop}</p>
                          <Badge variant={due.priority === 'high' ? 'destructive' : 'secondary'}>
                            {due.priority}
                          </Badge>
                        </div>
                        <p className="text-lg font-bold text-orange-600">{due.amount}</p>
                        <p className="text-xs text-gray-600 mb-3">Due: {due.dueDate}</p>
                        <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                          Pay Now
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2 text-blue-600" />
                Recent Orders
              </CardTitle>
              <CardDescription>Your purchase history</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent orders found.</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.shop}</p>
                          <p className="text-sm text-gray-600">{order.items}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{order.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{order.amount}</p>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'pending' ? 'secondary' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
