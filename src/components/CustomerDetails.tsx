import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Star, 
  User, 
  Calendar, 
  IndianRupee,
  FileText,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface CustomerInfo {
  customer_id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  totalPurchases: number;
  totalSpent: number;
  averageRating: number;
  totalReviews: number;
  sales: Array<{
    id: string;
    invoice_number: string;
    total_amount: number;
    payment_status: string;
    sale_date: string;
    customer_rating: number | null;
    rating_comment: string | null;
    items: any;
  }>;
}

export const CustomerDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchCustomer = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a customer ID");
      return;
    }

    setLoading(true);
    setError("");
    setCustomerInfo(null);

    try {
      // First, get customer profile info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('customer_id, full_name, phone, created_at')
        .eq('customer_id', searchQuery.trim().toUpperCase())
        .single();

      if (profileError || !profileData) {
        setError("Customer not found");
        setLoading(false);
        return;
      }

      // Get customer's sales data
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('customer_id', profileData.customer_id)
        .order('sale_date', { ascending: false });

      if (salesError) {
        console.error('Error fetching sales:', salesError);
        setError("Error fetching customer sales data");
        setLoading(false);
        return;
      }

      // Calculate statistics
      const totalPurchases = salesData?.length || 0;
      const totalSpent = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      
      const ratingsData = salesData?.filter(sale => sale.customer_rating !== null) || [];
      const averageRating = ratingsData.length > 0 
        ? ratingsData.reduce((sum, sale) => sum + (sale.customer_rating || 0), 0) / ratingsData.length 
        : 0;
      const totalReviews = ratingsData.length;

      setCustomerInfo({
        customer_id: profileData.customer_id,
        full_name: profileData.full_name,
        phone: profileData.phone,
        created_at: profileData.created_at,
        totalPurchases,
        totalSpent,
        averageRating,
        totalReviews,
        sales: salesData || []
      });

    } catch (error) {
      console.error('Error searching customer:', error);
      setError("An error occurred while searching");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Customer Search
          </CardTitle>
          <CardDescription>
            Enter a customer ID to view their details, reviews, and purchase history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter customer ID (e.g., CU123456)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && searchCustomer()}
            />
            <Button 
              onClick={searchCustomer}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {customerInfo && (
        <div className="space-y-6">
          {/* Customer Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{customerInfo.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-semibold">{customerInfo.customer_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{customerInfo.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold">
                    {format(new Date(customerInfo.created_at), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Orders</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{customerInfo.totalPurchases}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Total Spent</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{customerInfo.totalSpent.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {customerInfo.averageRating > 0 ? customerInfo.averageRating.toFixed(1) : "N/A"}
                  </p>
                  {customerInfo.averageRating > 0 && (
                    <div className="flex">{renderStars(customerInfo.averageRating)}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Total Reviews</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{customerInfo.totalReviews}</p>
              </CardContent>
            </Card>
          </div>

          {/* Purchase History */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Recent orders and reviews from this customer</CardDescription>
            </CardHeader>
            <CardContent>
              {customerInfo.sales.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No purchase history found</p>
              ) : (
                <div className="space-y-4">
                  {customerInfo.sales.map((sale) => (
                    <div key={sale.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold">{sale.invoice_number}</p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(sale.sale_date), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <Badge variant={sale.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {sale.payment_status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">₹{Number(sale.total_amount).toLocaleString()}</p>
                          {sale.customer_rating && (
                            <div className="flex items-center gap-1">
                              {renderStars(sale.customer_rating)}
                              <span className="text-sm text-gray-600 ml-1">({sale.customer_rating})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {sale.rating_comment && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Review:</span> "{sale.rating_comment}"
                          </p>
                        </div>
                      )}

                      {sale.items && Array.isArray(sale.items) && sale.items.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {sale.items.map((item: any, index: number) => (
                              <div key={index} className="text-xs bg-white p-2 rounded border">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-600"> × {item.quantity}</span>
                                <span className="float-right">₹{item.total}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};