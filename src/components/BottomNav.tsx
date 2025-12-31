import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  BarChart3,
  User,
} from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-blue-600 rounded-full flex justify-around items-center md:hidden safe-bottom z-50">
      {/* Dashboard */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex items-center justify-center h-10 px-4 transition-all duration-200 ${
            isActive
              ? "bg-white rounded-full text-blue-600 shadow-sm"
              : "text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <LayoutDashboard size={22} />
            {isActive && (
              <span className="ml-2 text-xs font-medium">Dashboard</span>
            )}
          </>
        )}
      </NavLink>

      {/* New Trade */}
      <NavLink
        to="/log-trade"
        className={({ isActive }) =>
          `flex items-center justify-center h-10 px-4 transition-all duration-200 ${
            isActive
              ? "bg-white rounded-full text-blue-600 shadow-sm"
              : "text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <PlusCircle size={22} />
            {isActive && <span className="ml-2 text-xs font-medium">New</span>}
          </>
        )}
      </NavLink>

      {/* Journal */}
      <NavLink
        to="/journal"
        className={({ isActive }) =>
          `flex items-center justify-center h-10 px-4 transition-all duration-200 ${
            isActive
              ? "bg-white rounded-full text-blue-600 shadow-sm"
              : "text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <BookOpen size={22} />
            {isActive && <span className="ml-2 text-xs font-medium">Logs</span>}
          </>
        )}
      </NavLink>

      {/* Analytics */}
      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          `flex items-center justify-center h-10 px-4 transition-all duration-200 ${
            isActive
              ? "bg-white rounded-full text-blue-600 shadow-sm"
              : "text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <BarChart3 size={22} />
            {isActive && (
              <span className="ml-2 text-xs font-medium">Analytics</span>
            )}
          </>
        )}
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex items-center justify-center h-10 px-4 transition-all duration-200 ${
            isActive
              ? "bg-white rounded-full text-blue-600 shadow-sm"
              : "text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <User size={22} />
            {isActive && <span className="ml-2 text-xs font-medium">User</span>}
          </>
        )}
      </NavLink>
    </nav>
  );
}
