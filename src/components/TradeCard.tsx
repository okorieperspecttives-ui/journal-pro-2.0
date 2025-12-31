import dayjs from "dayjs";
import type { TradeEntry } from "../types";

interface TradeCardProps {
  trade: TradeEntry;
  onClick: (id: string) => void;
  onHold?: (trade: TradeEntry) => void; // optional long-press handler
}

export default function TradeCard({ trade, onClick, onHold }: TradeCardProps) {
  let pressTimer: ReturnType<typeof setTimeout>;

  const handleMouseDown = () => {
    if (onHold) {
      pressTimer = setTimeout(() => {
        onHold(trade);
      }, 800); // 800ms hold
    }
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer);
  };

  return (
    <li
      key={trade.id}
      onClick={() => onClick(trade.id)} // normal click
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className={`flex justify-between bg-white p-3 pl-4 no-highlight-card cursor-pointer rounded-lg shadow-sm border-l-4 mb-3 ${
        trade.direction === "Long" ? "border-green-500" : "border-red-500"
      }`}
    >
      <div>
        <p className="font-semibold">{trade.symbol}</p>
        <p className="text-xs text-gray-500">
          {trade.strategy} • {dayjs(trade.executed_at).format("MMM D")}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold ${
            (trade.return_r ?? 0) > 0
              ? "text-green-600"
              : (trade.return_r ?? 0) < 0
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {trade.return_r !== null ? `${trade.return_r.toFixed(2)}R` : "—"}
        </p>
        <p
          className={`text-sm ${
            (trade.profit_usd ?? 0) > 0
              ? "text-green-600"
              : (trade.profit_usd ?? 0) < 0
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {trade.profit_usd !== null
            ? `$${trade.profit_usd.toFixed(2)}`
            : "$0.00"}
        </p>
      </div>
    </li>
  );
}
