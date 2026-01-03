import React from "react";
import { useApp } from "@/context/AppContext";
import {
  UserCircle,
  Package,
  Mail,
  Calendar,
  Loader2,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { currentUser, userRole, orders, isLoading, logout } = useApp();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold">Please login</h2>
      </div>
    );
  }

  const myOrders = orders.filter((order) =>
    userRole === "buyer"
      ? order.buyerId === currentUser.id
      : order.sellerId === currentUser.id
  );

  return (
    <div className="container max-w-5xl mx-auto py-8 grid md:grid-cols-3 gap-6">
      {/* USER INFO */}
      <Card>
        <CardContent className="text-center p-6">
          <UserCircle size={80} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold">{currentUser.name}</h2>
          <p className="text-muted-foreground">{currentUser.email}</p>
          <Badge className="mt-2 capitalize">{currentUser.role}</Badge>

          <Button
            onClick={logout}
            variant="destructive"
            className="w-full mt-6"
          >
            <LogOut size={16} /> Logout
          </Button>
        </CardContent>
      </Card>

      {/* ORDER HISTORY */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package /> Order History
          </CardTitle>
        </CardHeader>

        <CardContent>
          {myOrders.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No orders found
            </p>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 flex justify-between"
                >
                  <div>
                    <p className="font-bold">
                      Order #{order.id.slice(-6)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Calendar size={12} />{" "}
                      {new Date(order.createdAt).toDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.totalAmount}</p>
                    <Badge>{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
