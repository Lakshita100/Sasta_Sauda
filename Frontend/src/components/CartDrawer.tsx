import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { GrainType } from '@/types';

const grainEmojis: Record<GrainType, string> = {
  wheat: '🌾',
  rice: '🍚',
  corn: '🌽',
  barley: '🌿',
  soybean: '🫘',
  millet: '🌱',
};

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, cartTotal, removeFromCart, updateCartQuantity, clearCart, addOrder, currentUser } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!currentUser || cart.length === 0) return;

    // Create orders for each cart item
    cart.forEach(item => {
      addOrder({
        id: `order-${Date.now()}-${item.listingId}`,
        listingId: item.listingId,
        buyerId: currentUser.id,
        grainType: item.listing.grainType,
        quantity: item.quantity,
        pricePerQuintal: item.listing.pricePerQuintal,
        totalAmount: item.quantity * item.listing.pricePerQuintal,
        sellerName: item.listing.sellerName,
        location: item.listing.location,
        qualityGrade: item.listing.qualityGrade,
        status: 'confirmed',
        createdAt: new Date(),
      });
    });

    clearCart();
    onOpenChange(false);
    
    toast({
      title: 'Order Placed Successfully!',
      description: `${cart.length} item(s) ordered. Check your order history for details.`,
    });

    navigate('/orders');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map(item => (
                <div
                  key={item.listingId}
                  className="flex gap-3 p-3 rounded-lg bg-secondary/50 animate-fade-in"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-background text-2xl">
                    {grainEmojis[item.listing.grainType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium capitalize truncate">
                      {item.listing.grainType}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.listing.sellerName}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      ₹{item.listing.pricePerQuintal.toLocaleString()}/qtl
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.listingId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateCartQuantity(item.listingId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateCartQuantity(item.listingId, item.quantity + 1)}
                        disabled={item.quantity >= item.listing.quantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      max: {item.listing.quantity} qtl
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Add items from the marketplace
              </p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="border-t pt-4 flex-col gap-3">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Checkout ({cart.length} item{cart.length !== 1 ? 's' : ''})
            </Button>
            <Button variant="outline" className="w-full" onClick={clearCart}>
              Clear Cart
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function CartButton() {
  const { cart } = useApp();

  return (
    <div className="relative">
      <ShoppingCart className="h-5 w-5" />
      {cart.length > 0 && (
        <Badge
          variant="default"
          className="absolute -top-2 -right-2 h-5 w-5 p-0 justify-center text-xs"
        >
          {cart.length}
        </Badge>
      )}
    </div>
  );
}
