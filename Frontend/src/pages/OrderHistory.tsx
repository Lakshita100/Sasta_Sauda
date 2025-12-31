import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { GrainType } from '@/types';

const grainEmojis: Record<GrainType, string> = {
  wheat: '🌾',
  rice: '🍚',
  corn: '🌽',
  barley: '🌿',
  soybean: '🫘',
  millet: '🌱',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-grade-a/20 text-grade-a',
};

export default function OrderHistory() {
  const { orders } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-serif text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-1">
            Track your past purchases and order status
          </p>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <Card 
                key={order.id} 
                className="overflow-hidden animate-slide-up hover:shadow-soft-lg transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Grain Icon */}
                    <div className="flex items-center justify-center w-full sm:w-32 h-24 sm:h-auto bg-secondary text-4xl">
                      {grainEmojis[order.grainType]}
                    </div>
                    
                    {/* Order Details */}
                    <div className="flex-1 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-serif font-semibold text-lg capitalize">
                            {order.grainType} - {order.quantity} quintals
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            From {order.sellerName}
                          </p>
                        </div>
                        <Badge className={statusColors[order.status]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{order.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(order.createdAt, 'MMM dd, yyyy')}</span>
                        </div>
                        <Badge variant={`grade${order.qualityGrade}` as any}>
                          Grade {order.qualityGrade}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Amount</p>
                          <p className="text-xl font-bold text-primary">
                            ₹{order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ₹{order.pricePerQuintal.toLocaleString()}/qtl × {order.quantity} qtl
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center animate-fade-in">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">
              Start shopping in the marketplace to see your orders here
            </p>
            <Button onClick={() => navigate('/marketplace')} className="gap-2">
              Browse Marketplace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
