const symbols = [
  "AUD/CAD",
  "AUD/CHF",
  "AUD/JPY",
  "AUD/NZD",
  "AUD/USD",
  "CAD/CHF",
  "CAD/JPY",
  "CHF/JPY",
  "EUR/AUD",
  "EUR/CAD",
  "EUR/CHF",
  "EUR/GBP",
  "EUR/JPY",
  "EUR/USD",
  "GBP/AUD",
  "GBP/CAD",
  "GBP/CHF",
  "GBP/JPY",
  "GBP/USD",
  "NZD/CAD",
  "NZD/CHF",
  "NZD/JPY",
  "NZD/USD",
  "USD/CAD",
  "USD/CHF",
  "USD/JPY",
];

export default function SymbolSelector({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (val: string) => void;
  required: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Symbol</label>
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Select a pair</option>
        {symbols.sort().map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
