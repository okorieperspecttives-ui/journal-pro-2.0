import type { TradeEntry } from "../types";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface WinRateCardProps {
  trades: TradeEntry[];
}

export default function WinRateCard({ trades }: WinRateCardProps) {
  const wins = trades.filter((t) => t.profit_usd > 0);
  const losses = trades.filter((t) => t.profit_usd <= 0);
  const winRate = trades.length
    ? Math.round((wins.length / trades.length) * 100)
    : 0;

  return (
    <section>
      <h3 className="text-lg font-semibold  text-center mb-2">Win Rate</h3>
      <div className="flex items-center flex-col gap-2 justify-center space-x-6 space-y-4">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={winRate}
            text={`${winRate}%`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: "#3b82f6",
              textColor: "#111827",
              trailColor: "#e5e7eb",
            })}
          />
        </div>
        <div className="text-sm text-gray-600">
          <p>Wins: {wins.length}</p>
          <p>Losses: {losses.length}</p>
        </div>
      </div>
    </section>
  );
}
