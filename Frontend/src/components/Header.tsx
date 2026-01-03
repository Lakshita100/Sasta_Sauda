import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CartDrawer, CartButton } from '@/components/CartDrawer';
import { Wheat, LogOut, User, ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const { userRole, setUserRole, currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
  <div className="container mx-auto flex h-16 items-center justify-between px-4">

    {/* LOGO */}
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => navigate("/")}
    >
      {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"> */}
      <div>
        {/* <Wheat className="h-5 w-5 text-primary-foreground" /> */}
      </div>
      <div>
        <h1 className="font-serif text-xl font-bold text-foreground">
          SastaSauda
        </h1>
        <p className="text-xs text-muted-foreground">
          Jaha Sasta Waha Sauda
        </p>
      </div>
    </div>

    {/* NAV LINKS */}
    {userRole && (
      <nav className="hidden md:flex items-center gap-1">

        {/* HOME */}
        <Button
          variant={isActive("/") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => navigate("/")}
        >
          Home
        </Button>

        {/* MARKET PRICES */}
        <Button
          variant={isActive("/market-prices") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => navigate("/market-prices")}
        >
          Market Prices
        </Button>

        {/* SELLER */}
        {userRole === "seller" && (
          <Button
            variant={isActive("/seller") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/seller")}
          >
            Sell Grain
          </Button>
        )}

      
          {/* BUYER / MARKETPLACE */}
        {userRole === "buyer" && (
           <Button
          variant={isActive("/marketplace") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => navigate("/marketplace")}
        >
          Buy Grains
        </Button>

        )}
   
       

        {/* ORDERS */}
        {userRole === "buyer" && (
          <Button
            variant={isActive("/orders") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/orders")}
            className="gap-1"
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Button>
        )}
      </nav>
    )}

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-3">
      {userRole === "buyer" && (
        <>
          <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)}>
            <CartButton />
          </Button>
          <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
        </>
      )}

      {userRole && currentUser && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:block">
              {currentUser.name}
            </span>
          </Button>

          <Badge variant={userRole === "seller" ? "gradeA" : "default"}>
            {userRole === "seller" ? "Seller" : "Buyer"}
          </Badge>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  </div>
</header>
  )}