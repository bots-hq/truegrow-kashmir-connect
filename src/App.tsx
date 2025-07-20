
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
import StockManagementPage from "./pages/StockManagementPage";
import PaymentTrackingPage from "./pages/PaymentTrackingPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotesPage from "./pages/NotesPage";
import BillingPage from "./pages/BillingPage";
import CustomerReportsPage from "./pages/CustomerReportsPage";
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
            <Route path="/billing" element={
              <ProtectedRoute requiredRole="shop_owner">
                <BillingPage />
              </ProtectedRoute>
            } />
            <Route path="/stock" element={
              <ProtectedRoute requiredRole="shop_owner">
                <StockManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute requiredRole="shop_owner">
                <PaymentTrackingPage />
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute requiredRole="shop_owner">
                <CustomerReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute requiredRole="shop_owner">
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute requiredRole="shop_owner">
                <NotesPage />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
