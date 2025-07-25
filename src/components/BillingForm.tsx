import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, FileDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BillingItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export const BillingForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<BillingItem[]>([
    { name: "", quantity: 1, unit: "Package", price: 0, total: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, unit: "Package", price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof BillingItem, value: string | number) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const generatePDF = (saleData: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${saleData.invoice_number}`, 20, 40);
    doc.text(`Date: ${new Date(saleData.sale_date).toLocaleDateString()}`, 20, 50);
    doc.text(`Customer ID: ${saleData.customer_id}`, 20, 60);
    
    // Items table
    const tableData = items.map(item => [
      item.name,
      `${item.quantity} ${item.unit}`,
      `₹${item.price.toFixed(2)}`,
      `₹${item.total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 80,
      head: [['Item', 'Qty & Unit', 'Price', 'Total']],
      body: tableData,
    });

    const finalY = (doc as any).lastAutoTable.finalY || 120;
    
    // Totals
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal();
    
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 140, finalY + 20);
    doc.text(`Tax (18%): ₹${tax.toFixed(2)}`, 140, finalY + 30);
    doc.text(`Total: ₹${total.toFixed(2)}`, 140, finalY + 40);
    
    // Download PDF
    doc.save(`invoice-${saleData.invoice_number}.pdf`);
  };

  const handleSaveSale = async () => {
    if (!customerId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a customer ID",
        variant: "destructive",
      });
      return;
    }

    if (items.some(item => !item.name.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all item names",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if customer ID exists (can be customer or shop owner with customer ID)
      console.log('Searching for customer ID:', customerId);
      
      const { data: customer, error: customerError } = await supabase
        .from('profiles')
        .select('customer_id, full_name, role')
        .eq('customer_id', customerId)
        .maybeSingle();

      console.log('Database query result:', { customer, customerError });

      if (customerError) {
        console.error('Database error:', customerError);
        toast({
          title: "Error",
          description: `Database error: ${customerError.message}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!customer) {
        console.log('No customer found with ID:', customerId);
        toast({
          title: "Error",
          description: `Customer ID ${customerId} not found`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('Found customer:', customer);

      const subtotal = calculateSubtotal();
      const tax = calculateTax(subtotal);
      const total = calculateTotal();

      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
          shop_owner_id: user?.id,
          customer_id: customerId,
          items: JSON.stringify(items),
          subtotal: subtotal,
          tax_amount: tax,
          total_amount: total,
          payment_status: 'pending',
          invoice_number: '' // Will be auto-generated by trigger
        }])
        .select()
        .single();

      if (saleError) {
        toast({
          title: "Error",
          description: "Failed to save sale record",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Sale record saved successfully",
      });

      // Generate PDF
      generatePDF(sale);

      // Reset form
      setCustomerId("");
      setItems([{ name: "", quantity: 1, unit: "Package", price: 0, total: 0 }]);

    } catch (error) {
      console.error('Error saving sale:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileDown className="w-5 h-5 mr-2 text-green-600" />
          Create New Sale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer ID Input */}
        <div>
          <Label htmlFor="customerId">Customer ID</Label>
          <Input
            id="customerId"
            placeholder="Enter customer ID (e.g., CU123456)"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
          />
        </div>

        {/* Items Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Items</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 border rounded-lg">
                <div className="sm:col-span-4">
                  <Label>Item Name</Label>
                  <Input
                    placeholder="Enter item name"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Unit</Label>
                  <Select 
                    value={item.unit} 
                    onValueChange={(value) => updateItem(index, 'unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Package">Package</SelectItem>
                      <SelectItem value="Bottle">Bottle</SelectItem>
                      <SelectItem value="KGs">KGs</SelectItem>
                      <SelectItem value="Ltrs">Ltrs</SelectItem>
                      <SelectItem value="Pieces">Pieces</SelectItem>
                      <SelectItem value="Boxes">Boxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="sm:col-span-1 sm:col-start-11">
                  <Label>Total (₹)</Label>
                  <Input
                    value={item.total.toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="sm:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-end space-x-8 text-right">
            <div>
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="font-medium">₹{calculateSubtotal().toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tax (18%)</p>
              <p className="font-medium">₹{calculateTax(calculateSubtotal()).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-bold">₹{calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            onClick={handleSaveSale}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Saving..." : "Save & Generate Invoice"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};