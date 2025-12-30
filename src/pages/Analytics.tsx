import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import type { TradeEntry } from "../types";
import WinRateCard from "../components/WinRateCard";
import StrategyPerformance from "../components/StrategyPerformance";
import MoodImpact from "../components/MoodImpact";

export default function Analytics() {
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      const { data, error } = await supabase
        .from("trade_entries")
        .select("id, strategy, profit_usd, mood, finalized")
        .eq("finalized", true);

      if (error) {
        console.error("Error fetching trades:", error.message);
      } else {
        setTrades(data as TradeEntry[]);
      }
      setLoading(false);
    };

    fetchTrades();
  }, []);

  if (loading) return <div className="p-4">Loading analytics...</div>;

  return (
    <div className="p-4 pb-8">
      <h2 className="text-xl font-bold">Analytics</h2>
      <WinRateCard trades={trades} />
      <StrategyPerformance trades={trades} />
      <MoodImpact trades={trades} />
    </div>
  );
}
