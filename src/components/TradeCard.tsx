export default TradeCard = ({ trade, onOpen, onLongPress }) => {
  const bind = useLongPress(
    () => {
      onLongPress(trade);
    },
    { threshold: 800 }
  );

  return (
    <li
      {...bind()}
      onClick={() => onOpen(trade.id)}
      className={`flex justify-between bg-white p-3 pl-4 rounded-lg shadow-sm border-l-4 mb-3 ${
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
};
