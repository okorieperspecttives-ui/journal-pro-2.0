import { LucideLoader } from "lucide-react";
import MotionWrapper from "../helpers/MotionWrapper";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading } = useAuth();

  const navigate = useNavigate();

  if (loading)
    return (
      <MotionWrapper>
        <div className="w-full h-full flex items-center justify-center">
          <LucideLoader className="animate-spin" />
        </div>
      </MotionWrapper>
    );

  //

  if (!user) {
    // Public dashboard: incentives
    return (
      <MotionWrapper>
        <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome to TradePilot
          </h1>

          <div className="grid gap-4 w-full max-w-md">
            {/* Incentive Card */}
            <div
              onClick={() => navigate("/auth")}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2">
                📈 Track Your Trades
              </h2>
              <p className="text-sm text-gray-600">
                Log every trade with precision and build your trading journal.
              </p>
            </div>

            <div
              onClick={() => navigate("/auth")}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2">
                📊 Analyze Performance
              </h2>
              <p className="text-sm text-gray-600">
                Visualize your win rate, PnL, and trading patterns over time.
              </p>
            </div>

            <div
              onClick={() => navigate("/auth")}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2">
                🧠 Learn From Mistakes
              </h2>
              <p className="text-sm text-gray-600">
                Review journal entries and refine your strategy with insights.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/auth")}
            className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </MotionWrapper>
    );
  }

  // Authenticated dashboard
  return (
    <MotionWrapper>
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
        {/* Header */}
        <div className="w-full max-w-md text-left mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md space-y-6">
          {/* Placeholder: Equity Section */}
          <div className="bg-gray-100 rounded-lg p-4 text-gray-500 text-center">
            📊 Equity section coming soon...
          </div>

          {/* Placeholder: Recent Activity */}
          <div className="bg-gray-100 rounded-lg p-4 text-gray-500 text-center">
            🕒 Recent activity will appear here.
          </div>

          {/* Placeholder: Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition">
              Trades
            </button>
            <button className="bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition">
              Journal
            </button>
            <button className="bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition">
              Analytics
            </button>
            <button className="bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition">
              Profile
            </button>
          </div>
        </div>
      </div>
    </MotionWrapper>
  );
}
