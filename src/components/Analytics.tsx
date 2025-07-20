import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Users, 
  Package,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SalesData {
  date: string;
  sales: number;
  customers: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface ProductSalesData {
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  averagePrice: number;
  salesCount: number;
}

export function Analytics() {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [productSalesData, setProductSalesData] = useState<ProductSalesData[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    growthRate: 0,
    totalProducts: 0,
    totalItemsSold: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [user]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch sales data
      const { data: salesDataRaw, error: salesError } = await supabase
        .from('sales')
        .select('total_amount, sale_date, customer_id, items')
        .eq('shop_owner_id', user.id)
        .order('sale_date', { ascending: true });

      if (salesError) throw salesError;

      // Process data for charts
      const processedSalesData = processSalesDataForChart(salesDataRaw || []);
      setSalesData(processedSalesData);

      // Process product sales data
      const productSales = processProductSalesData(salesDataRaw || []);
      setProductSalesData(productSales);

      // Calculate stats
      const totalRevenue = salesDataRaw?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      const uniqueCustomers = new Set(salesDataRaw?.map(sale => sale.customer_id)).size;
      const avgOrderValue = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0;
      
      // Calculate total items sold
      const totalItemsSold = salesDataRaw?.reduce((sum, sale) => {
        if (sale.items && Array.isArray(sale.items)) {
          return sum + sale.items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0);
        }
        return sum;
      }, 0) || 0;

      // Get unique product count
      const uniqueProducts = new Set();
      salesDataRaw?.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
          sale.items.forEach((item: any) => {
            if (item.name) uniqueProducts.add(item.name.toLowerCase());
          });
        }
      });

      setStats({
        totalRevenue,
        totalCustomers: uniqueCustomers,
        avgOrderValue,
        growthRate: 12.5, // Mock growth rate
        totalProducts: uniqueProducts.size,
        totalItemsSold
      });

      // Process category data
      const categories = processCategoryData(salesDataRaw || []);
      setCategoryData(categories);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processSalesDataForChart = (data: any[]) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayData = data.filter(sale => 
        sale.sale_date.split('T')[0] === dateString
      );
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: dayData.reduce((sum, sale) => sum + Number(sale.total_amount), 0),
        customers: new Set(dayData.map(sale => sale.customer_id)).size
      });
    }
    return last7Days;
  };

  const processCategoryData = (data: any[]) => {
    const categories: { [key: string]: number } = {};
    
    data.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach((item: any) => {
          const category = item.category || 'Other';
          categories[category] = (categories[category] || 0) + (item.quantity * item.price);
        });
      }
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };

  const processProductSalesData = (data: any[]): ProductSalesData[] => {
    const productStats: { [key: string]: { quantity: number; revenue: number; prices: number[]; sales: number } } = {};
    
    data.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach((item: any) => {
          const name = item.name || 'Unknown Product';
          if (!productStats[name]) {
            productStats[name] = { quantity: 0, revenue: 0, prices: [], sales: 0 };
          }
          
          productStats[name].quantity += item.quantity || 0;
          productStats[name].revenue += item.total || 0;
          productStats[name].prices.push(item.price || 0);
          productStats[name].sales += 1;
        });
      }
    });

    return Object.entries(productStats)
      .map(([name, stats]) => ({
        name,
        totalQuantity: stats.quantity,
        totalRevenue: stats.revenue,
        averagePrice: stats.prices.length > 0 
          ? stats.prices.reduce((sum, price) => sum + price, 0) / stats.prices.length 
          : 0,
        salesCount: stats.sales
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue); // Sort by revenue desc
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <div className={`flex items-center mt-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="p-6">Loading analytics data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into your business performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          trend={stats.growthRate}
          color="text-green-500"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend={8.2}
          color="text-blue-500"
        />
        <StatCard
          title="Avg Order Value"
          value={`₹${Math.round(stats.avgOrderValue).toLocaleString()}`}
          icon={Package}
          trend={-2.1}
          color="text-purple-500"
        />
        <StatCard
          title="Growth Rate"
          value={`${stats.growthRate}%`}
          icon={TrendingUp}
          color="text-orange-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="text-indigo-500"
        />
        <StatCard
          title="Items Sold"
          value={stats.totalItemsSold}
          icon={Package}
          color="text-pink-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
            <CardDescription>Daily sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`₹${value}`, 'Sales']}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Activity</CardTitle>
            <CardDescription>Daily customer visits</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [value, 'Customers']}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Bar dataKey="customers" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={(entry) => `${entry.name}: ₹${entry.value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${value}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Revenue Growth</span>
              <span className="text-green-600 font-bold">+12.5%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Customer Retention</span>
              <span className="text-blue-600 font-bold">78%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">Avg Items per Sale</span>
              <span className="text-purple-600 font-bold">3.2</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">Profit Margin</span>
              <span className="text-orange-600 font-bold">24%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Analytics</h2>
            <p className="text-gray-600">Detailed insights into individual product performance</p>
          </div>
        </div>

        {/* Top Products Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
            <CardDescription>Best performing products based on total revenue generated</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={productSalesData.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip 
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                  labelFormatter={(label) => `Product: ${label}`}
                />
                <Bar dataKey="totalRevenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Sales Details</CardTitle>
            <CardDescription>Complete breakdown of all product sales and performance</CardDescription>
          </CardHeader>
          <CardContent>
            {productSalesData.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No product sales found</p>
                <p className="text-gray-400 text-sm">Start making sales to see product analytics here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-semibold">Product Name</th>
                      <th className="text-center p-4 font-semibold">Total Quantity</th>
                      <th className="text-center p-4 font-semibold">Total Revenue</th>
                      <th className="text-center p-4 font-semibold">Average Price</th>
                      <th className="text-center p-4 font-semibold">Sales Count</th>
                      <th className="text-center p-4 font-semibold">Revenue per Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSalesData.map((product, index) => (
                      <tr key={product.name} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">Rank #{index + 1}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center p-4 font-medium">{product.totalQuantity}</td>
                        <td className="text-center p-4 font-medium text-green-600">
                          ₹{product.totalRevenue.toLocaleString()}
                        </td>
                        <td className="text-center p-4">₹{Math.round(product.averagePrice).toLocaleString()}</td>
                        <td className="text-center p-4">{product.salesCount}</td>
                        <td className="text-center p-4 font-medium text-blue-600">
                          ₹{Math.round(product.totalRevenue / product.totalQuantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Quantity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Quantity Sold</CardTitle>
            <CardDescription>Total quantities sold for each product</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={productSalesData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [value, 'Quantity Sold']}
                  labelFormatter={(label) => `Product: ${label}`}
                />
                <Bar dataKey="totalQuantity" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}