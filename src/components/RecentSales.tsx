import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Sale {
  id: string;
  customer_id: string;
  invoice_number: string;
  total_amount: number;
  payment_status: string;
  sale_date: string;
}

export const RecentSales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSales();
  }, [user]);

  const fetchRecentSales = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('shop_owner_id', user.id)
        .order('sale_date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching sales:', error);
        return;
      }

      setSales(data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-600" />
            Recent Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-green-600" />
          Recent Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <p className="text-gray-500">No sales recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{sale.invoice_number}</p>
                  <p className="text-sm text-gray-600">Customer: {sale.customer_id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{sale.total_amount.toFixed(2)}</p>
                  <Badge variant={
                    sale.payment_status === 'paid' ? 'default' :
                    sale.payment_status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {sale.payment_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};