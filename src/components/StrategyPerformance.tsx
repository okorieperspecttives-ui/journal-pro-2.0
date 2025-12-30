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
    if (t.profit_usd > 0) strategyStats[strat].wins += 1;
  });

  return (
    <section className="space-y-10">
      <h3 className="text-lg  text-center font-semibold mb-2">
        Strategy Performance
      </h3>
      {Object.entries(strategyStats).map(([name, stat]) => {
        const rate = Math.round((stat.wins / stat.total) * 100);
        const color =
          name === "Breakout"
            ? "bg-blue-500"
            : name === "Reversal"
            ? "bg-red-500"
            : "bg-green-500";

        return (
          <div key={name} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{name}</span>
              <span>{rate}% Win</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className={`${color} h-2 rounded`}
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
