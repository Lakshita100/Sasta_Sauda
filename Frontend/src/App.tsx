import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";

// 1. IMPORT YOUR PAGES
import Home from "./pages/Home"; // Your new shared Home Page
import Login from "./pages/RoleSelection";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import Marketplace from "./pages/Marketplace";
import MarketPrices from "./pages/MarketPrices";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * PROTECTED ROUTE COMPONENT
 */
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'seller' | 'buyer' }) {
  const { userRole } = useApp();
  
  // If not logged in, go to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  // If role doesn't match the page requirement, kick them back to shared Home
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

/**
 * MAIN ROUTE CONFIGURATION
 */
function AppRoutes() {
  const { userRole } = useApp();

  return (
    <Routes>
      {/* AUTH ROUTES - Redirect to Home if already logged in */}
      <Route 
        path="/login" 
        element={userRole ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={userRole ? <Navigate to="/" replace /> : <Register />} 
      />

      {/* SHARED HOME PAGE - The main dashboard for everyone */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />

      {/* SHARED DATA - Market Prices */}
      <Route 
        path="/market-prices" 
        element={
          <ProtectedRoute>
            <MarketPrices />
          </ProtectedRoute>
        } 
      />

      {/* SELLER ONLY ROUTES */}
      <Route 
        path="/seller" 
        element={
          <ProtectedRoute allowedRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } 
      />

      {/* BUYER ONLY ROUTES */}
      <Route 
        path="/marketplace" 
        element={
          <ProtectedRoute allowedRole="buyer">
            <Marketplace />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute allowedRole="buyer">
            <OrderHistory />
          </ProtectedRoute>
        } 
      />

      {/* 404 CATCH-ALL */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;