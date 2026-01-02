const statuses = ["Open", "Closed", "Pending"];

export default function StatusDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
        Status
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border-gray-300 h-10 dark:bg-background-dark dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 remove_scrollbar p-2"
      >
        {statuses.map((status) => (
          <option
            key={status}
            value={status}
            className="mt-1 w-full rounded-md border-gray-300 h-10 dark:text-gray-300 shadow-sm dark:bg-background-dark  focus:border-blue-500 focus:ring-blue-500"
          >
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
