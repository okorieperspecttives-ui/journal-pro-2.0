import type { TradeEntry } from "../types";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useAuth } from "../hooks/useAuth";

interface WinRateCardProps {
  trades: TradeEntry[];
}

export default function WinRateCard({ trades }: WinRateCardProps) {
  const wins = trades.filter((t) => (t.profit_usd ?? 0) > 0);
  const losses = trades.filter((t) => (t.profit_usd ?? 0) <= 0);
  const winRate = trades.length
    ? Math.round((wins.length / trades.length) * 100)
    : 0;

  const { theme } = useAuth();
  return (
    <div className="bg-white rounded-xl dark:bg-card-dark space-y-10 shadow-md p-6 border border-gray-100">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-text-dark text-center mb-4">
        Win Rate
      </h3>

      {/* Content */}
      <div className="flex flex-col items-center gap-4">
        {/* Circular chart */}
        <div className="w-28 h-28">
          <CircularProgressbar
            value={winRate}
            text={`${winRate}%`}
            styles={buildStyles({
              textSize: "18px",
              pathColor: theme === "dark" ? "#fff" : "#000",
              textColor:
                theme === "dark"
                  ? "var(--color-text-dark)" // light text for dark mode
                  : "var(--color-text)", // dark text for light mode
              trailColor:
                theme === "dark"
                  ? "var(--color-border-dark)"
                  : "var(--color-border)",
            })}
          />
        </div>

        {/* Stats */}
        <div className="flex flex-col items-center text-sm space-y-1">
          <p className="text-green-600 font-medium">Wins: {wins.length}</p>
          <p className="text-red-500 font-medium">Losses: {losses.length}</p>
        </div>
      </div>
    </div>
  );
}
