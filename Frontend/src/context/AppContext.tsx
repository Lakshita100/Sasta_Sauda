import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, GrainListing, Feedback, Order, CartItem } from '@/types';
import { MOCK_LISTINGS } from '@/data/mockData';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  listings: GrainListing[];
  addListing: (listing: GrainListing) => void;
  feedbacks: Feedback[];
  addFeedback: (feedback: Feedback) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  cart: CartItem[];
  addToCart: (listing: GrainListing, quantity?: number) => void;
  removeFromCart: (listingId: string) => void;
  updateCartQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  currentUser: { id: string; name: string } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [listings, setListings] = useState<GrainListing[]>(MOCK_LISTINGS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Mock current user based on role
  const currentUser = userRole 
    ? { id: userRole === 'seller' ? 'seller-demo' : 'buyer-demo', name: userRole === 'seller' ? 'Demo Seller' : 'Demo Buyer' }
    : null;

  const addListing = (listing: GrainListing) => {
    setListings(prev => [listing, ...prev]);
  };

  const addFeedback = (feedback: Feedback) => {
    setFeedbacks(prev => [...prev, feedback]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addToCart = (listing: GrainListing, quantity: number = listing.quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.listingId === listing.id);
      if (existing) {
        return prev.map(item =>
          item.listingId === listing.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, listing.quantity) }
            : item
        );
      }
      return [...prev, { listingId: listing.id, quantity, listing }];
    });
  };

  const removeFromCart = (listingId: string) => {
    setCart(prev => prev.filter(item => item.listingId !== listingId));
  };

  const updateCartQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(listingId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.listingId === listingId
          ? { ...item, quantity: Math.min(quantity, item.listing.quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.quantity * item.listing.pricePerQuintal,
    0
  );

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      listings,
      addListing,
      feedbacks,
      addFeedback,
      orders,
      addOrder,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      currentUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
