import { useEffect, useState } from "react";
import { LucideLoader } from "lucide-react";
import MotionWrapper from "../helpers/MotionWrapper";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import dayjs from "dayjs";
import { supabase } from "../config/supabase"; // adjust path
import type { TradeEntry } from "../types";
import ThemeToggle from "../components/ThemeToggle";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { user, loading, setLoading, theme } = useAuth();
  const navigate = useNavigate();

  // Local state for dashboard data
  const [recentEntries, setRecentEntries] = useState<TradeEntry[]>([]);
  const [weeklyTrades, setWeeklyTrades] = useState<TradeEntry[]>([]);
  const [moodData, setMoodData] = useState<any>(null);
  const [pnl, setPnl] = useState<number>(0);

  //tooltip colors
  const tooltipColors =
    theme === "dark"
      ? {
          backgroundColor: "var(--color-card-dark)",
          titleColor: "var(--color-text-dark)",
          bodyColor: "var(--color-text-dark)",
          borderColor: "var(--color-border-dark)",
        }
      : {
          backgroundColor: "var(--color-card)",
          titleColor: "var(--color-text)",
          bodyColor: "var(--color-text)",
          borderColor: "var(--color-border)",
        };

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color:
            theme === "dark" ? "var(--color-text-dark)" : "var(--color-text)",
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        ...tooltipColors,
        borderWidth: 1,
      },
    },
  };

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      const startOfWeek = dayjs().startOf("week").toISOString();
      const endOfWeek = dayjs().endOf("week").toISOString();

      // 1. Recent entries (last 2 trades)
      const { data: recent, error: recentErr } = await supabase
        .from("trade_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("executed_at", { ascending: false })
        .limit(2);
      if (!recentErr && recent) setRecentEntries(recent);

      // 2. Weekly trades
      const { data: weekly, error: weeklyErr } = await supabase
        .from("trade_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("executed_at", startOfWeek)
        .lte("executed_at", endOfWeek);
      if (!weeklyErr && weekly) setWeeklyTrades(weekly);

      // 3. Mood stats for weekly trades
      if (weekly) {
        const moodStats: Record<string, number> = {};
        weekly.forEach((t) => {
          const mood = t.mood ?? "Unknown";
          moodStats[mood] = (moodStats[mood] ?? 0) + 1;
        });
        setMoodData({
          labels: Object.keys(moodStats),
          datasets: [
            {
              data: Object.values(moodStats),
              backgroundColor: [
                "#3b82f6",
                "#ef4444",
                "#10b981",
                "#f59e0b",
                "#8b5cf6",
              ],
            },
          ],
        });
      }

      // 4. Equity summary (PnL aggregation)
      const { data: allTrades, error: allErr } = await supabase
        .from("trade_entries")
        .select("profit_usd")
        .eq("user_id", user.id);
      if (!allErr && allTrades) {
        const totalPnl = allTrades.reduce(
          (acc, t) => acc + (t.profit_usd ?? 0),
          0
        );
        setPnl(totalPnl);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <MotionWrapper>
        <div className="w-full h-screen dark:bg-background-dark  flex items-center justify-center">
          <LucideLoader
            className="animate-spin text-blue-600 dark:text-text-dark"
            size={32}
          />
        </div>
      </MotionWrapper>
    );
  }

  if (!user) {
    return (
      <MotionWrapper>
        <div className="h-screen bg-gray-50 dark:bg-background-dark flex flex-col items-center justify-center p-6 remove-scrollbar">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-text-dark mb-6">
            Welcome to TradePilot
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {/* Card 1 */}
            <Link
              to="/auth"
              className="bg-card dark:bg-card-dark  rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
                Track Your Trades
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Log every trade with notes, strategies, and outcomes to improve
                your performance.
              </p>
            </Link>

            {/* Card 2 */}
            <Link
              to="/auth"
              className="bg-card dark:bg-card-dark  rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
                Analyze Performance
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get win rates, strategy insights, and mood impact analytics to
                sharpen your edge.
              </p>
            </Link>

            {/* Card 3 */}
            <Link
              to="/auth"
              className="bg-card dark:bg-card-dark  rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
                Stay Accountable
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Build discipline with journaling and track your growth over
                time.
              </p>
            </Link>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  // Weekly stats
  const wins = weeklyTrades.filter((t) => (t.profit_usd ?? 0) > 0).length;
  const losses = weeklyTrades.filter((t) => (t.profit_usd ?? 0) < 0).length;

  return (
    <MotionWrapper>
      <div className="h-screen w-full  bg-gray-50 dark:bg-background-dark p-6 overflow-y-auto remove-scrollbar relative">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-text-dark mb-6">
          Dashboard
        </h1>
        <ThemeToggle />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Equity & Account Summary */}
          <div className="bg-white dark:bg-card-dark rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-text dark:text-text-dark mb-4">
              Equity & Account Summary
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 my-4 font-semibold">
              Balance: ${user.balance ?? 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 my-4 font-semibold">
              Equity: ${(user.balance ?? 0) + pnl}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 my-4 font-semibold">
              PnL: ${pnl}
            </p>
          </div>

          {/* 2. Current Week Performance */}
          <div className="bg-white rounded-xl shadow-md p-6 dark:bg-card-dark">
            <h2 className="text-lg dark:text-text-dark font-semibold text-text mb-4">
              This Week
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 rounded-lg p-3 text-center dark:bg-card-dark dark:border-gray-300">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Trades
                </p>
                <p className="text-blue-600 font-bold">{weeklyTrades.length}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center dark:bg-card-dark dark:border-gray-300">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Wins
                </p>
                <p className="text-green-600 font-bold">{wins}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center dark:bg-card-dark dark:border-gray-300">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Losses
                </p>
                <p className="text-red-600 font-bold">{losses}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center dark:bg-card-dark dark:border-gray-300">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Win Rate
                </p>
                <p className="text-blue-600 font-bold">
                  {weeklyTrades.length
                    ? Math.round((wins / weeklyTrades.length) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* 3. Recent Journal Entries */}
          <div className="bg-white rounded-xl shadow-md p-6 dark:bg-card-dark">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-blue-500 dark:text-text-dark">
                Recents
              </h2>
              <button
                onClick={() => navigate("/journal")}
                className="text-sm text-blue-500 font-semibold underline hover:underline dark:text-text-dark"
              >
                View All
              </button>
            </div>
            {recentEntries.length === 0 ? (
              <p className="text-sm dark:bg-background-dark dark:text-text-dark text-gray-500">
                No entries yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => navigate(`/journal/${entry.id}`)}
                    className="bg-blue-50 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition dark:bg-card-dark dark:border-gray-400 dark:border"
                  >
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300 ">
                      {entry.symbol} — {entry.strategy}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-200 truncate font-[dm-sans]">
                      {entry.notes ?? "No notes"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Mood Impact */}
          <div className="bg-white dark:bg-card-dark rounded-xl shadow-md mb-14 p-6">
            <h2 className="text-lg font-semibold text-text dark:text-text-dark mb-4">
              Mood Impact
            </h2>
            <div className="w-full h-64">
              {moodData ? (
                <Pie data={moodData} options={pieOptions} />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 my-4 font-semibold">
                  No mood data
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MotionWrapper>
  );
}
