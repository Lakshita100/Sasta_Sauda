import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { UserRole, GrainListing, Feedback, Order, CartItem } from "@/types";

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
  const [isLoading, setIsLoading] = useState(true);

  const [listings, setListings] = useState<GrainListing[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  /* =========================
     FETCH REAL LISTINGS
     ========================= */
useEffect(() => {
  if (userRole === "buyer") {
    fetch("http://localhost:5000/api/listings/verified")
      .then(res => res.json())
      .then(data => {
        console.log("✅ VERIFIED LISTINGS:", data);
        setListings(data);
      })
      .catch(err => console.error("❌ Buyer listings error:", err));
  }
}, [userRole]);


  
  /* =========================
   AUTH PROFILE CHECK
   ========================= */
useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
  "http://localhost:5000/api/auth/me",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

 console.log("PROFILE API RESPONSE:", response.data); // 👈 ADD

      const user = response.data.user; // 👈 MUST MATCH BACKEND

      console.log("USER OBJECT:", user); // 👈 ADD

setCurrentUser({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

setUserRoleState(user.role);

    } catch (error) {
      console.error("Auth verification failed", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  fetchUser();
}, []);


  /* =========================
     AUTH ACTIONS
     ========================= */
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (!role) logout();
  };

  const logout = () => {
    setUserRoleState(null);
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  /* =========================
     CART & LISTING LOGIC
     ========================= */
  const addListing = (listing: GrainListing) =>
    setListings((prev) => [listing, ...prev]);

  const addFeedback = (feedback: Feedback) =>
    setFeedbacks((prev) => [...prev, feedback]);

  const addOrder = (order: Order) =>
    setOrders((prev) => [...prev, order]);

  const addToCart = (listing: GrainListing, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.listingId === listing.id
      );

      if (existing) {
        return prev.map((item) =>
          item.listingId === listing.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  listing.quantity
                ),
              }
            : item
        );
      }

      return [...prev, { listingId: listing.id, quantity, listing }];
    });
  };

  const removeFromCart = (listingId: string) =>
    setCart((prev) =>
      prev.filter((item) => item.listingId !== listingId)
    );

  const updateCartQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(listingId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.listingId === listingId
          ? {
              ...item,
              quantity: Math.min(quantity, item.listing.quantity),
            }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.quantity * item.listing.pricePerQuintal,
    0
  );

  return (
    <AppContext.Provider
      value={{
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
        isLoading,
      }}
    >
      {!isLoading && children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useApp must be used within AppProvider");
  return context;
}
