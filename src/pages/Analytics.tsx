import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import type { TradeEntry } from "../types";
import WinRateCard from "../components/WinRateCard";
import StrategyPerformance from "../components/StrategyPerformance";
import MoodImpact from "../components/MoodImpact";
import MotionWrapper from "../helpers/MotionWrapper";
import { useAuth } from "../hooks/useAuth";
import { LucideLoader } from "lucide-react";

export default function Analytics() {
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchTrades = async () => {
      const { data, error } = await supabase
        .from("trade_entries")
        .select("*")
        .eq("finalized", true);

      if (!error && data) {
        setTrades(data as TradeEntry[]);
      }
      setLoading(false);
    };

    fetchTrades();
  }, []);

  if (!user)
    return (
      <MotionWrapper>
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark">
          <div className="bg-card dark:bg-card-dark w-[95%] rounded-xl shadow-md p-6  max-w-sm text-center">
            <h1 className="text-xl  font-semibold mb-4 text-text dark:text-text-dark">
              Analytics
            </h1>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              You must be logged in to access this page.
            </p>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="px-4 py-2 bg-blue-600 dark:bg-background-dark text-white rounded-lg shadow hover:bg-blue-700 dark:hover:bg-card-dark transition"
            >
              Go to Auth Page
            </button>
          </div>
        </div>
      </MotionWrapper>
    );

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

  return (
    <MotionWrapper>
      <div className="p-4 pb-20  bg-background dark:bg-background-dark flex flex-col gap-8">
        <h2 className="text-xl font-bold text-text dark:text-text-dark">
          Analytics
        </h2>
        <WinRateCard trades={trades} />
        <StrategyPerformance trades={trades} />
        <MoodImpact trades={trades} />
      </div>
    </MotionWrapper>
  );
}
