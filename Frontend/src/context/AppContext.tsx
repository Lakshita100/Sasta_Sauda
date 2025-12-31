import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, GrainListing, Feedback, Order, CartItem } from '@/types';
import { MOCK_LISTINGS } from '@/data/mockData';
import axios from 'axios';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  logout: () => void;
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
  currentUser: UserData | null;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // App starts in loading state
  
  const [listings, setListings] = useState<GrainListing[]>(MOCK_LISTINGS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // FETCH REAL USER FROM DATABASE ON REFRESH
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // REPLACE THIS URL with your actual backend endpoint (e.g., http://localhost:5000/api/auth/me)
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userData = response.data; // Expecting { id, name, email, role }
        setCurrentUser(userData);
        setUserRoleState(userData.role);
      } catch (error) {
        console.error("Auth verification failed", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (!role) logout();
  };

  const logout = () => {
    setUserRoleState(null);
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  // --- CART & LISTING LOGIC ---
  const addListing = (listing: GrainListing) => setListings(prev => [listing, ...prev]);
  const addFeedback = (feedback: Feedback) => setFeedbacks(prev => [...prev, feedback]);
  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);

  const addToCart = (listing: GrainListing, quantity: number = 1) => {
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

  const removeFromCart = (listingId: string) => setCart(prev => prev.filter(item => item.listingId !== listingId));

  const updateCartQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(listingId);
      return;
    }
    setCart(prev => prev.map(item => item.listingId === listingId ? { ...item, quantity: Math.min(quantity, item.listing.quantity) } : item));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((total, item) => total + item.quantity * item.listing.pricePerQuintal, 0);

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      logout,
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
      isLoading
    }}>
      {/* Do not render children until authentication check is done */}
      {!isLoading && children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
}