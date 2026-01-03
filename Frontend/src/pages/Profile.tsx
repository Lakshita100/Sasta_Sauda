import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  UserCircle,
  Package,
  Mail,
  Calendar,
  Loader2,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, userRole, orders, isLoading, logout } = useApp();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="animate-spin h-10 w-10 text-green-600" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center mt-20 space-y-4">
        <h2 className="text-xl font-bold">Please login</h2>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const myOrders = orders.filter((order) =>
    userRole === "buyer"
      ? order.buyerId === currentUser.id
      : order.sellerId === currentUser.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">

        {/* BACK BUTTON */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="grid md:grid-cols-3 gap-8">

          {/* ================= USER INFO ================= */}
          <Card className="bg-white/90 rounded-2xl shadow-md">
            <CardContent className="text-center p-8 space-y-4">
              <UserCircle size={88} className="mx-auto text-green-600" />

              <div className="space-y-1">
                <h2 className="text-2xl font-bold">
                  {currentUser.name}
                </h2>
                <p className="text-sm text-muted-foreground flex justify-center gap-1 items-center">
                  <Mail size={14} />
                  {currentUser.email}
                </p>
              </div>

              <Badge
                className="capitalize px-4 py-1"
                variant={userRole === "seller" ? "gradeA" : "default"}
              >
                {currentUser.role}
              </Badge>

              <Button
                onClick={logout}
                variant="destructive"
                className="w-full mt-6 flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </CardContent>
          </Card>

          {/* ================= ORDER HISTORY ================= */}
          <Card className="md:col-span-2 bg-white/90 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-green-600" />
                Order History
              </CardTitle>
            </CardHeader>

            <CardContent>
              {myOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">
                  No orders found
                </p>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-xl p-4 flex items-center justify-between hover:bg-muted/40 transition"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold">
                          Order #{order.id.slice(-6)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(order.createdAt).toDateString()}
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="font-bold text-green-700">
                          ₹{order.totalAmount}
                        </p>
                        <Badge variant="secondary">
                          {order.status}
                        </Badge>
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
