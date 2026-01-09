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
  "SPX500",
  "NAS100",
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
      <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
        Symbol
      </label>
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full dark:text-gray-300 rounded-md remove_scrolbar  border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 dark:bg-background-dark p-2"
      >
        <option
          value=""
          className="dark:text-text-dark dark:bg-background-dark w-full"
        >
          Select a pair
        </option>
        {symbols.sort().map((symbol) => (
          <option
            key={symbol}
            value={symbol}
            className="dark:text-text-dark dark:bg-background-dark w-full"
          >
            {symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
