const strategies = ["Breakout", "Pullback", "Scalping", "Swing", "Day Trading"];

export default function StrategyDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Entry Strategy
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {strategies.map((strategy) => (
          <option key={strategy} value={strategy}>
            {strategy}
          </option>
        ))}
      </select>
    </div>
  );
}
