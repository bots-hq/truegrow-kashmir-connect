
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RoleSelection from "./pages/RoleSelection";
import RegisterShopOwner from "./pages/RegisterShopOwner";
import RegisterCustomer from "./pages/RegisterCustomer";
import ShopOwnerDashboard from "./pages/ShopOwnerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CommunityFeed from "./pages/CommunityFeed";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/register/shop-owner" element={<RegisterShopOwner />} />
            <Route path="/register/customer" element={<RegisterCustomer />} />
            <Route path="/dashboard/shop-owner" element={
              <ProtectedRoute requiredRole="shop_owner">
                <ShopOwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/customer" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/community" element={<CommunityFeed />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
