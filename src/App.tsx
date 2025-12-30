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

export default function App() {
  return (
    <Router>
      {/* Mobile-first app shell */}
      <div className="h-screen max-w-sm md:max-w-screen mx-auto bg-gray-50 flex flex-co safe-area">
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

        {/* Bottom nav pinned at bottom (mobile only) */}
        <BottomNav />
      </div>
    </Router>
  );
}
