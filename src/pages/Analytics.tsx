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

  if (!user) {
    return (
      <MotionWrapper>
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm text-center">
            <h1 className="text-xl font-semibold mb-4">Log New Trade</h1>
            <p className="mb-4 text-gray-600">
              You must be logged in to access this page.
            </p>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Go to Auth Page
            </button>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  if (loading)
    return (
      <MotionWrapper>
        <div className="w-full h-full flex items-center justify-center">
          <LucideLoader className="animate-spin text-blue-600" size={32} />
        </div>
      </MotionWrapper>
    );

  return (
    <MotionWrapper>
      <div className="p-4 pb-20 flex flex-col gap-8">
        <h2 className="text-xl font-bold">Analytics</h2>
        <WinRateCard trades={trades} />
        <StrategyPerformance trades={trades} />
        <MoodImpact trades={trades} />
      </div>
    </MotionWrapper>
  );
}
