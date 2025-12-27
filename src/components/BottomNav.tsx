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
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white flex justify-around items-center shadow-md  md:hidden safe-bottom">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`
        }
      >
        <LayoutDashboard size={22} />
        <span className="text-xs">Dashboard</span>
      </NavLink>

      <NavLink
        to="/log-trade"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`
        }
      >
        <PlusCircle size={22} />
        <span className="text-xs">New</span>
      </NavLink>

      <NavLink
        to="/journal"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`
        }
      >
        <BookOpen size={22} />
        <span className="text-xs">Logs</span>
      </NavLink>

      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`
        }
      >
        <BarChart3 size={22} />
        <span className="text-xs">Analytics</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`
        }
      >
        <User size={22} />
        <span className="text-xs">User</span>
      </NavLink>
    </nav>
  );
}
