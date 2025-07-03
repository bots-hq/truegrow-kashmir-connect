
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RoleSelection from "./pages/RoleSelection";
import RegisterShopOwner from "./pages/RegisterShopOwner";
import RegisterCustomer from "./pages/RegisterCustomer";
import ShopOwnerDashboard from "./pages/ShopOwnerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CommunityFeed from "./pages/CommunityFeed";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/register/shop-owner" element={<RegisterShopOwner />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/dashboard/shop-owner" element={<ShopOwnerDashboard />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/community" element={<CommunityFeed />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
