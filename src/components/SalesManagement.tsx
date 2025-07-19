import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, FileText, User, Calendar, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Sale {
  id: string;
  invoice_number: string;
  customer_id: string;
  total_amount: number;
  payment_status: string;
  sale_date: string;
  customer_rating?: number;
  rating_comment?: string;
  items: any;
}

export const SalesManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [comments, setComments] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (user?.id) {
      fetchSales();
    }
  }, [user?.id]);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('shop_owner_id', user?.id)
        .order('sale_date', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sales data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = async (saleId: string, newStatus: string) => {
    setUpdatingId(saleId);
    try {
      const { error } = await supabase
        .from('sales')
        .update({ payment_status: newStatus })
        .eq('id', saleId);

      if (error) throw error;

      setSales(sales.map(sale => 
        sale.id === saleId 
          ? { ...sale, payment_status: newStatus }
          : sale
      ));

      toast({
        title: "Success",
        description: `Payment status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const updateRating = async (saleId: string, rating: number, comment: string) => {
    setUpdatingId(saleId);
    try {
      const { error } = await supabase
        .from('sales')
        .update({ 
          customer_rating: rating,
          rating_comment: comment.trim() || null
        })
        .eq('id', saleId);

      if (error) throw error;

      setSales(sales.map(sale => 
        sale.id === saleId 
          ? { ...sale, customer_rating: rating, rating_comment: comment.trim() || undefined }
          : sale
      ));

      toast({
        title: "Success",
        description: "Customer rating updated successfully",
      });
    } catch (error) {
      console.error('Error updating rating:', error);
      toast({
        title: "Error",
        description: "Failed to update customer rating",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStars = (rating: number, onClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          i < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={() => onClick?.(i + 1)}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading sales...</div>;
  }

  if (sales.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-green-100">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No sales found. Create your first sale using the billing form.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Sales Management</h2>
        <p className="text-gray-600">Manage payment status and rate customers</p>
      </div>

      <div className="grid gap-6">
        {sales.map((sale) => {
          const currentRating = ratings[sale.id] ?? sale.customer_rating ?? 0;
          const currentComment = comments[sale.id] ?? sale.rating_comment ?? '';

          const setTempRating = (rating: number) => {
            setRatings(prev => ({ ...prev, [sale.id]: rating }));
          };

          const setTempComment = (comment: string) => {
            setComments(prev => ({ ...prev, [sale.id]: comment }));
          };

          return (
            <Card key={sale.id} className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      {sale.invoice_number}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {sale.customer_id}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ₹{sale.total_amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(sale.payment_status)}>
                    {sale.payment_status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Payment Status Section */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Payment Status</Label>
                  <Select
                    value={sale.payment_status}
                    onValueChange={(value) => updatePaymentStatus(sale.id, value)}
                    disabled={updatingId === sale.id}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Rating Section */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Customer Rating</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {renderStars(currentRating, setTempRating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {currentRating > 0 ? `${currentRating}/5 stars` : 'No rating'}
                      </span>
                    </div>
                    
                    <div>
                      <Textarea
                        placeholder="Add a comment about this customer (optional)"
                        value={currentComment}
                        onChange={(e) => setTempComment(e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>

                    {(currentRating !== (sale.customer_rating || 0) || currentComment !== (sale.rating_comment || '')) && (
                      <Button
                        onClick={() => updateRating(sale.id, currentRating, currentComment)}
                        disabled={updatingId === sale.id || currentRating === 0}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updatingId === sale.id ? "Updating..." : "Save Rating"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Items Summary */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Items</Label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {JSON.parse(sale.items).map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};