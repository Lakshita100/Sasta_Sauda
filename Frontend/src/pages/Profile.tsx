import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  UserCircle, 
  Package, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Calendar,
  Loader2,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { currentUser, userRole, orders, isLoading, logout } = useApp();

  // 1. LOADING STATE: This is the most important part.
  // While the AppContext is fetching your data from the DB, show a loader.
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Fetching your profile from database...</p>
      </div>
    );
  }

  // 2. UNAUTHORIZED STATE: If loading finished and no user was found.
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-red-50 p-6 rounded-full mb-4">
          <UserCircle size={60} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
        <p className="text-muted-foreground mb-6">We couldn't find your session. Please log in again.</p>
        <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
      </div>
    );
  }

  // Filter orders based on the real ID from your DB
  const myOrders = orders.filter(order => 
    userRole === 'buyer' ? order.buyerId === currentUser.id : order.sellerId === currentUser.id
  );

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 animate-in fade-in zoom-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: REAL DATABASE USER INFO */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-500 w-full" />
            <CardContent className="pt-0 -mt-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-32 w-32 rounded-full border-8 border-background bg-white flex items-center justify-center shadow-md">
                  <UserCircle size={80} className="text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{currentUser.name}</h2>
              <Badge variant="secondary" className="mt-2 capitalize px-4 py-1">
                {currentUser.role || userRole} Account
              </Badge>
            </CardContent>
            
            <div className="border-t p-6 space-y-4 bg-slate-50/50">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <Mail className="text-primary" size={16} />
                </div>
                <span className="truncate font-medium">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <Phone className="text-primary" size={16} />
                </div>
                <span>+91 Verified Member</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <MapPin className="text-primary" size={16} />
                </div>
                <span>Registered Location</span>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full mt-4 gap-2" 
                onClick={logout}
              >
                <LogOut size={16} /> Logout
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: DATABASE ORDER HISTORY */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-white">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Package className="text-primary" size={20} /> 
                {userRole === 'seller' ? 'My Sales' : 'My Purchases'}
              </CardTitle>
              <Badge variant="outline" className="font-bold">
                {myOrders.length} Records
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              {myOrders.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground bg-slate-50 rounded-xl border-2 border-dashed">
                  <ShoppingBag size={64} className="mx-auto mb-4 opacity-10" />
                  <p className="text-lg font-medium">No activity yet</p>
                  <p className="text-sm">When you trade grains, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-lg">ID: {order.id.slice(-6).toUpperCase()}</span>
                          <Badge className={order.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-blue-100 text-blue-700 hover:bg-blue-100'}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                            <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 text-left sm:text-right">
                        <p className="text-2xl font-black text-primary">₹{order.totalAmount.toLocaleString()}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Secure Transaction</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Profile;