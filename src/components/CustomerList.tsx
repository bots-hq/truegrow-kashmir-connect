import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  User, 
  Phone, 
  Calendar,
  IndianRupee,
  Star,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface CustomerSummary {
  customer_id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  totalOrders: number;
  totalSpent: number;
  averageRating: number;
  lastOrderDate: string | null;
}

export const CustomerList = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      // Get current user's sales to find unique customer IDs
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          customer_id,
          total_amount,
          customer_rating,
          sale_date
        `)
        .eq('shop_owner_id', (await supabase.auth.getUser()).data.user?.id);

      if (salesError) {
        console.error('Error fetching sales:', salesError);
        setError("Error fetching sales data");
        return;
      }

      if (!salesData || salesData.length === 0) {
        setCustomers([]);
        return;
      }

      // Get unique customer IDs
      const uniqueCustomerIds = [...new Set(salesData.map(sale => sale.customer_id))];

      // Fetch customer profiles for those IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('customer_id, full_name, phone, created_at')
        .in('customer_id', uniqueCustomerIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setError("Error fetching customer profiles");
        return;
      }

      // Calculate statistics for each customer
      const customerSummaries: CustomerSummary[] = (profilesData || []).map(profile => {
        const customerSales = salesData.filter(sale => sale.customer_id === profile.customer_id);
        
        const totalOrders = customerSales.length;
        const totalSpent = customerSales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
        
        const ratingsData = customerSales.filter(sale => sale.customer_rating !== null);
        const averageRating = ratingsData.length > 0 
          ? ratingsData.reduce((sum, sale) => sum + (sale.customer_rating || 0), 0) / ratingsData.length 
          : 0;

        const lastOrderDate = customerSales.length > 0 
          ? customerSales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())[0].sale_date
          : null;

        return {
          customer_id: profile.customer_id,
          full_name: profile.full_name,
          phone: profile.phone,
          created_at: profile.created_at,
          totalOrders,
          totalSpent,
          averageRating,
          lastOrderDate
        };
      });

      // Sort by total spent (highest first)
      customerSummaries.sort((a, b) => b.totalSpent - a.totalSpent);
      
      setCustomers(customerSummaries);

    } catch (error) {
      console.error('Error fetching customers:', error);
      setError("An error occurred while fetching customer data");
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2">Loading customer data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-red-100">
          <CardContent className="p-6">
            <p className="text-red-600 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer Reports
          </CardTitle>
          <CardDescription>
            Overview of all customers who have made purchases from your shop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Total Customers</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{customers.length}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IndianRupee className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Total Revenue</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                ₹{customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">Total Orders</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {customers.reduce((sum, customer) => sum + customer.totalOrders, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Detailed information about each customer (sorted by total spending)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No customers found</p>
              <p className="text-gray-400 text-sm">Start making sales to see your customers here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer, index) => (
                <div key={customer.customer_id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{customer.full_name}</h3>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">ID: {customer.customer_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-green-600">₹{customer.totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{customer.totalOrders} orders</p>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{customer.phone || "Not provided"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Joined:</span>
                      <span className="font-medium">
                        {format(new Date(customer.created_at), "MMM dd, yyyy")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Rating:</span>
                      {customer.averageRating > 0 ? (
                        <div className="flex items-center gap-1">
                          <div className="flex">{renderStars(customer.averageRating)}</div>
                          <span className="font-medium">({customer.averageRating.toFixed(1)})</span>
                        </div>
                      ) : (
                        <span className="font-medium text-gray-400">No ratings</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Last Order:</span>
                      <span className="font-medium">
                        {customer.lastOrderDate 
                          ? format(new Date(customer.lastOrderDate), "MMM dd, yyyy")
                          : "Never"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};