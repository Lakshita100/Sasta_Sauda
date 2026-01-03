import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import { UserCircle, LogOut, LayoutDashboard, ShoppingCart, Tag, BarChart3 } from "lucide-react";

// 1. IMPORT YOUR PAGES
import Home from "./pages/Home";
import Login from "./pages/RoleSelection";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import Marketplace from "./pages/Marketplace";
import MarketPrices from "./pages/MarketPrices";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

// /**
//  * NAVBAR COMPONENT
//  * Dynamically changes based on userRole
//  */
// const Navbar = () => {
//   const { userRole, logout } = useApp();

//   // Don't show navbar if user is not logged in
//   if (!userRole) return null;

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//       <div className="container flex h-16 items-center justify-between">
//         <div className="flex items-center gap-6 md:gap-10">
//           <Link to="/" className="flex items-center space-x-2">
//             <span className="inline-block font-bold text-xl text-primary">AgriTrade</span>
//           </Link>
          
//           <nav className="flex gap-6">
//             {/* SHARED LINKS */}
//             <Link to="/market-prices" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
//               <BarChart3 className="mr-1 h-4 w-4" /> Market Price
//             </Link>

//             {/* SELLER ONLY LINKS */}
//             {userRole === 'seller' && (
//               <>
//                 <Link to="/seller" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
//                   <Tag className="mr-1 h-4 w-4" /> Sell Grains
//                 </Link>
//                 <Link to="/marketplace" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
//                   <LayoutDashboard className="mr-1 h-4 w-4" /> Marketplace
//                 </Link>
//               </>
//             )}

//             {/* BUYER ONLY LINKS */}
//             {userRole === 'buyer' && (
//               <>
//                 <Link to="/marketplace" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
//                   <ShoppingCart className="mr-1 h-4 w-4" /> Marketplace
//                 </Link>
//                 <Link to="/orders" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
//                   <Tag className="mr-1 h-4 w-4" /> Buy Grains
//                 </Link>
//               </>
//             )}
//           </nav>
//         </div>

//         {/* RIGHT SIDE: PROFILE & LOGOUT */}
//         <div className="flex items-center gap-4">
//           <Link to="/profile" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
//             <UserCircle className="h-6 w-6" />
//             <span className="hidden md:inline capitalize">{userRole} Profile</span>
//           </Link>
//           <button 
//             onClick={logout} 
//             className="p-2 text-muted-foreground hover:text-destructive transition-colors"
//           >
//             <LogOut className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

/**
 * PROTECTED ROUTE COMPONENT
 */
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'seller' | 'buyer' }) {
  const { userRole } = useApp();
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
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
    <div className="min-h-screen bg-background">
     
      <main className="container py-6">
        <Routes>
          {/* AUTH ROUTES */}
          <Route 
            path="/login" 
            element={userRole ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={userRole ? <Navigate to="/" replace /> : <Register />} 
          />

          {/* SHARED HOME PAGE */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* SHARED DATA */}
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

          {/* PROFILE PAGE ROUTE */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
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
      </main>
    </div>
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