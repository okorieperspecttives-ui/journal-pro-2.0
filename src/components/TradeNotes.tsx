export default function TradeNotes({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="my-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
        Notes
      </label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Reasoning behind the trade..."
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:text-text-dark focus:border-blue-500 focus:ring-blue-500 dark:bg-background-dark p-2"
      />
    </div>
  );
}
