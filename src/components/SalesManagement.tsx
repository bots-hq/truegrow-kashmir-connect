import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, FileText, User, Calendar, DollarSign, Edit, Download, Plus, Trash2, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Sale {
  id: string;
  invoice_number: string;
  customer_id: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  payment_status: string;
  sale_date: string;
  customer_rating?: number;
  rating_comment?: string;
  items: any;
}

interface SaleItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export const SalesManagement = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [comments, setComments] = useState<{[key: string]: string}>({});
  const [editingSale, setEditingSale] = useState<string | null>(null);
  const [editedSales, setEditedSales] = useState<{[key: string]: Partial<Sale>}>({});
  const [editedItems, setEditedItems] = useState<{[key: string]: SaleItem[]}>({});

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

  const startEditing = (saleId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (sale) {
      setEditingSale(saleId);
      setEditedSales(prev => ({ ...prev, [saleId]: { ...sale } }));
      setEditedItems(prev => ({ ...prev, [saleId]: JSON.parse(sale.items) }));
    }
  };

  const cancelEditing = (saleId: string) => {
    setEditingSale(null);
    setEditedSales(prev => {
      const newState = { ...prev };
      delete newState[saleId];
      return newState;
    });
    setEditedItems(prev => {
      const newState = { ...prev };
      delete newState[saleId];
      return newState;
    });
  };

  const updateEditedSale = (saleId: string, field: string, value: any) => {
    setEditedSales(prev => ({
      ...prev,
      [saleId]: { ...prev[saleId], [field]: value }
    }));
  };

  const addItem = (saleId: string) => {
    const newItem: SaleItem = { name: '', quantity: 1, price: 0, total: 0 };
    setEditedItems(prev => ({
      ...prev,
      [saleId]: [...(prev[saleId] || []), newItem]
    }));
  };

  const updateItem = (saleId: string, itemIndex: number, field: string, value: any) => {
    setEditedItems(prev => {
      const items = [...(prev[saleId] || [])];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      
      // Calculate total for this item
      if (field === 'quantity' || field === 'price') {
        items[itemIndex].total = items[itemIndex].quantity * items[itemIndex].price;
      }
      
      return { ...prev, [saleId]: items };
    });
  };

  const removeItem = (saleId: string, itemIndex: number) => {
    setEditedItems(prev => ({
      ...prev,
      [saleId]: prev[saleId]?.filter((_, index) => index !== itemIndex) || []
    }));
  };

  const calculateTotals = (items: SaleItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * 0.18; // 18% tax
    const totalAmount = subtotal + taxAmount;
    return { subtotal, taxAmount, totalAmount };
  };

  const saveSale = async (saleId: string) => {
    setUpdatingId(saleId);
    try {
      const editedSale = editedSales[saleId];
      const items = editedItems[saleId];
      
      if (!editedSale || !items) return;

      const { subtotal, taxAmount, totalAmount } = calculateTotals(items);
      
      const updateData = {
        ...editedSale,
        items: JSON.stringify(items),
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount
      };

      const { error } = await supabase
        .from('sales')
        .update(updateData)
        .eq('id', saleId);

      if (error) throw error;

      // Update local state
      setSales(sales.map(sale => 
        sale.id === saleId 
          ? { ...sale, ...updateData, items: JSON.stringify(items) }
          : sale
      ));

      setEditingSale(null);
      cancelEditing(saleId);

      toast({
        title: "Success",
        description: "Sale updated successfully",
      });
    } catch (error) {
      console.error('Error updating sale:', error);
      toast({
        title: "Error",
        description: "Failed to update sale",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const generatePDF = (sale: Sale) => {
    const doc = new jsPDF();
    const items = JSON.parse(sale.items);
    const pageWidth = doc.internal.pageSize.width;
    
    // Set colors
    const primaryColor = '#22c55e'; // Green
    const textColor = '#374151'; // Gray
    const lightGray = '#f3f4f6';
    
    // Header background
    doc.setFillColor(34, 197, 94); // Green background
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Company name in header
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(profile?.business_name || 'SHOP NAME', 20, 30);
    
    // Invoice title
    doc.setFontSize(16);
    doc.text('INVOICE', pageWidth - 60, 30);
    
    // Reset text color for body
    doc.setTextColor(55, 65, 81); // Dark gray
    
    // Company details section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let yPos = 80;
    
    // Business address
    if (profile?.business_address) {
      doc.text('Address:', 20, yPos);
      doc.text(profile.business_address, 20, yPos + 8);
      yPos += 20;
    }
    
    // Contact information
    if (profile?.phone) {
      doc.text('Phone:', 20, yPos);
      doc.text(profile.phone, 20, yPos + 8);
      yPos += 20;
    }
    
    // Invoice details box
    const invoiceBoxY = 80;
    doc.setFillColor(243, 244, 246); // Light gray background
    doc.rect(pageWidth - 90, invoiceBoxY, 80, 60, 'F');
    
    // Invoice details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Invoice Details', pageWidth - 85, invoiceBoxY + 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Invoice #: ${sale.invoice_number}`, pageWidth - 85, invoiceBoxY + 25);
    doc.text(`Date: ${new Date(sale.sale_date).toLocaleDateString()}`, pageWidth - 85, invoiceBoxY + 35);
    doc.text(`Customer: ${sale.customer_id}`, pageWidth - 85, invoiceBoxY + 45);
    
    // Payment status badge
    const statusY = invoiceBoxY + 55;
    const statusColor = sale.payment_status === 'paid' ? [34, 197, 94] : [249, 115, 22]; // Green or Orange
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.rect(pageWidth - 85, statusY, 35, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(sale.payment_status.toUpperCase(), pageWidth - 82, statusY + 5);
    
    // Reset text color
    doc.setTextColor(55, 65, 81);
    
    // Items table
    const tableStartY = Math.max(yPos + 20, 160);
    
    // Table headers
    const tableData = items.map((item: SaleItem, index: number) => [
      (index + 1).toString(),
      item.name,
      item.quantity.toString(),
      `₹${item.price.toFixed(2)}`,
      `₹${item.total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [['#', 'Item Description', 'Qty', 'Unit Price', 'Amount']],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 8,
        textColor: [55, 65, 81]
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { cellWidth: 80 },
        2: { halign: 'center', cellWidth: 20 },
        3: { halign: 'right', cellWidth: 30 },
        4: { halign: 'right', cellWidth: 35 }
      },
      margin: { left: 20, right: 20 }
    });

    // Totals section
    const finalY = (doc as any).previousAutoTable.finalY + 20;
    const totalsX = pageWidth - 80;
    
    // Totals background
    doc.setFillColor(249, 250, 251);
    doc.rect(totalsX - 10, finalY - 5, 70, 45, 'F');
    
    // Totals text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Subtotal:`, totalsX - 5, finalY + 5);
    doc.text(`₹${sale.subtotal.toFixed(2)}`, totalsX + 40, finalY + 5);
    
    doc.text(`Tax (18%):`, totalsX - 5, finalY + 15);
    doc.text(`₹${sale.tax_amount.toFixed(2)}`, totalsX + 40, finalY + 15);
    
    // Total amount (highlighted)
    doc.setFillColor(34, 197, 94);
    doc.rect(totalsX - 10, finalY + 20, 70, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`TOTAL:`, totalsX - 5, finalY + 28);
    doc.text(`₹${sale.total_amount.toFixed(2)}`, totalsX + 40, finalY + 28);
    
    // Footer
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const footerY = doc.internal.pageSize.height - 30;
    doc.text('Thank you for your business!', 20, footerY);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - 80, footerY);

    return doc;
  };

  const downloadInvoice = (sale: Sale) => {
    try {
      console.log('Starting PDF generation for sale:', sale.id);
      const doc = generatePDF(sale);
      console.log('PDF generated successfully, starting download...');
      doc.save(`Invoice-${sale.invoice_number}.pdf`);
      console.log('Download initiated');
      
      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: "Error",
        description: "Failed to download invoice. Please try again.",
        variant: "destructive",
      });
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
          const isEditing = editingSale === sale.id;
          const editedSale = editedSales[sale.id] || sale;
          const items = isEditing ? (editedItems[sale.id] || []) : JSON.parse(sale.items);

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
                  <div className="flex-1">
                    <CardTitle className="flex items-center mb-3">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      {isEditing ? (
                        <Input
                          value={editedSale.invoice_number}
                          onChange={(e) => updateEditedSale(sale.id, 'invoice_number', e.target.value)}
                          className="w-48 h-8"
                        />
                      ) : (
                        sale.invoice_number
                      )}
                    </CardTitle>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs">Customer ID</Label>
                          <Input
                            value={editedSale.customer_id}
                            onChange={(e) => updateEditedSale(sale.id, 'customer_id', e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Sale Date</Label>
                          <Input
                            type="date"
                            value={editedSale.sale_date?.split('T')[0]}
                            onChange={(e) => updateEditedSale(sale.id, 'sale_date', e.target.value)}
                            className="h-8"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 text-sm text-gray-600">
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
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(sale.payment_status)}>
                      {sale.payment_status}
                    </Badge>
                    
                    {!isEditing ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadInvoice(sale)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(sale.id)}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveSale(sale.id)}
                          disabled={updatingId === sale.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelEditing(sale.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Payment Status Section */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Payment Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedSale.payment_status}
                      onValueChange={(value) => updateEditedSale(sale.id, 'payment_status', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
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
                  )}
                </div>

                {/* Items Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Items</Label>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addItem(sale.id)}
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Item
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {items.map((item: SaleItem, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        {isEditing ? (
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-4">
                              <Input
                                placeholder="Item name"
                                value={item.name}
                                onChange={(e) => updateItem(sale.id, index, 'name', e.target.value)}
                                className="h-8"
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={(e) => updateItem(sale.id, index, 'quantity', Number(e.target.value))}
                                className="h-8"
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => updateItem(sale.id, index, 'price', Number(e.target.value))}
                                className="h-8"
                              />
                            </div>
                            <div className="col-span-2">
                              <span className="text-sm font-medium">₹{item.total.toFixed(2)}</span>
                            </div>
                            <div className="col-span-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeItem(sale.id, index)}
                                className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between text-sm">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>₹{item.total.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  {isEditing && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{calculateTotals(items).subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (18%):</span>
                          <span>₹{calculateTotals(items).taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>₹{calculateTotals(items).totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Rating Section */}
                {!isEditing && (
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
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};