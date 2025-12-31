import type { TradeEntry } from "../types";

interface StrategyPerformanceProps {
  trades: TradeEntry[];
}

export default function StrategyPerformance({
  trades,
}: StrategyPerformanceProps) {
  const strategyStats: Record<string, { wins: number; total: number }> = {};
  trades.forEach((t) => {
    const strat = t.strategy ?? "Unknown";
    if (!strategyStats[strat]) strategyStats[strat] = { wins: 0, total: 0 };
    strategyStats[strat].total += 1;
    if ((t.profit_usd ?? 0) > 0) {
      strategyStats[strat].wins += 1;
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-6">
        Strategy Performance
      </h3>

      {/* Bars */}
      <div className="space-y-5">
        {Object.entries(strategyStats).map(([name, stat]) => {
          const rate = Math.round((stat.wins / stat.total) * 100);
          const color =
            name === "Breakout"
              ? "bg-blue-500"
              : name === "Reversal"
              ? "bg-red-500"
              : "bg-green-500";

          return (
            <div key={name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{name}</span>
                <span className="text-gray-600">{rate}% Win</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`${color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
