import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LogTrade from "./pages/LogTrade";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import BottomNav from "./components/BottomNav";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { theme } = useAuth();
  return (
    <Router>
      {/* Mobile-first app shell */}
      <div
        className={
          theme === "dark"
            ? "dark h-full w-full  mx-auto bg-gray-50 dark:bg-background-dark flex  safe-area font-[montserrat] remove-scrollbar"
            : "h-full w-full   mx-auto bg-gray-50 flex  safe-area font-[montserrat] remove-scrollbar"
        }
      >
        <div className="mx-auto w-sm flex remove_scrollbar items-center justify-center remove-scrollbar">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto remove-scrollbar">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/log-trade" element={<LogTrade />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          {/*Toast Container */}
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
        {/* Bottom nav pinned at bottom (mobile only) */}
        <BottomNav />
      </div>
    </Router>
  );
}
