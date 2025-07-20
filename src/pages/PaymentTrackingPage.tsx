import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PaymentTracking } from "@/components/PaymentTracking";

export default function PaymentTrackingPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <AppSidebar userRole="shop-owner" />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center mb-6">
            <SidebarTrigger />
          </div>
          <PaymentTracking />
        </div>
      </div>
    </SidebarProvider>
  );
}