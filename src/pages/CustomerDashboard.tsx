
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
  IndianRupee
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const CustomerDashboard = () => {
  const stats = [
    {
      title: "Total Purchases",
      value: "₹45,300",
      description: "This month",
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "Pending Dues",
      value: "₹2,400",
      description: "2 shops",
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-orange-600"
    },
    {
      title: "Trust Score",
      value: "4.6/5",
      description: "Excellent rating",
      icon: <Star className="w-5 h-5" />,
      color: "text-green-600"
    }
  ];

  const nearbyShops = [
    {
      name: "Himalaya Agro Store",
      location: "Srinagar, 2.5 km",
      rating: 4.8,
      speciality: "Pesticides & Fertilizers",
      offers: "10% off on bulk orders",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=200&fit=crop"
    },
    {
      name: "Kashmir Seeds & Supplies",
      location: "Baramulla, 5 km", 
      rating: 4.5,
      speciality: "Premium Seeds",
      offers: "Free delivery above ₹500",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&h=200&fit=crop"
    },
    {
      name: "Valley Fertilizer Hub",
      location: "Anantnag, 8 km",
      rating: 4.7,
      speciality: "Organic Products",
      offers: "Buy 2 Get 1 Free",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop"
    }
  ];

  const recentOrders = [
    {
      shop: "Himalaya Agro Store",
      items: "NPK Fertilizer, Pesticide Spray",
      amount: "₹3,200",
      status: "delivered",
      date: "2 days ago"
    },
    {
      shop: "Kashmir Seeds & Supplies", 
      items: "Wheat Seeds, Rice Seeds",
      amount: "₹1,800",
      status: "pending",
      date: "5 days ago"
    },
    {
      shop: "Valley Fertilizer Hub",
      items: "Organic Compost",
      amount: "₹1,200",
      status: "paid",
      date: "1 week ago"
    }
  ];

  const pendingDues = [
    {
      shop: "Himalaya Agro Store",
      amount: "₹1,200",
      dueDate: "3 days",
      priority: "medium"
    },
    {
      shop: "Valley Fertilizer Hub",
      amount: "₹1,200",
      dueDate: "Overdue by 1 day",
      priority: "high"
    }
  ];

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
              <Badge className="bg-green-100 text-green-800">
                <Star className="w-3 h-3 mr-1" />
                Trust Score: 4.6
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
