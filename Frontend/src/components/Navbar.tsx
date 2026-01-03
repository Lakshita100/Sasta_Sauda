// import { Link } from "react-router-dom";
// import { useApp } from "@/context/AppContext";
// import { UserCircle, LogOut } from "lucide-react"; // Icons for profile

// const Navbar = () => {
//   const { userRole, logout } = useApp();

//   // If not logged in, don't show the navbar
//   if (!userRole) return null;

//   return (
//     <nav className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
//       <div className="flex items-center gap-8">
//         <Link to="/" className="text-xl font-bold text-green-700">SastaSauda</Link>
        
//         <div className="flex items-center gap-6 text-sm font-medium">
//           {/* SHARED LINKS */}
//           <Link to="/market-prices" className="hover:text-green-600">Market Price</Link>

//           {/* SELLER SPECIFIC LINKS */}
//           {userRole === 'seller' && (
//             <>
//               <Link to="/seller" className="hover:text-green-600">Sell Grains</Link>
//               <Link to="/seller-marketplace" className="hover:text-green-600">MarketPlace</Link>
//             </>
//           )}

//           {/* BUYER SPECIFIC LINKS */}
//           {userRole === 'buyer' && (
//             <>
//               <Link to="/marketplace" className="hover:text-green-600">Marketplace</Link>
//               <Link to="/orders" className="hover:text-green-600">Orders</Link>
//             </>
//           )}
//         </div>
//       </div>

//       {/* RIGHT SIDE: PROFILE & LOGOUT */}
//       <div className="flex items-center gap-4">
//         <Link to="/profile" className="flex items-center gap-2 hover:text-green-600">
//           <UserCircle size={24} />
//           <span className="capitalize">{userRole} Profile</span>
//         </Link>
//         <button 
//           onClick={logout} 
//           className="p-2 text-gray-500 hover:text-red-500 transition-colors"
//           title="Logout"
//         >
//           <LogOut size={20} />
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;