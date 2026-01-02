import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function DirectionToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium dark:text-text-dark text-gray-700">
        Direction
      </label>
      <div className="flex space-x-4 mt-1 dark:bg-background-dark p-2 rounded">
        <button
          type="button"
          onClick={() => onChange("Long")}
          className={`flex-1 flex items-center justify-center rounded-md border p-2 ${
            value === "Long"
              ? "border-green-500  bg-green-50 dark:bg-success-dark dark:text-white text-green-600"
              : "border-gray-300 dark:border-green-500 dark:text-green-600 dark:bg-white text-gray-500"
          }`}
        >
          <ArrowUpCircle className="mr-2" size={20} /> Long
        </button>
        <button
          type="button"
          onClick={() => onChange("Short")}
          className={`flex-1 flex items-center justify-center rounded-md border p-2 ${
            value === "Short"
              ? "border-red-500 dark:bg-red-600 dark:text-white bg-red-50 text-red-600"
              : "border-gray-300 text-gray-500 dark:border-red-500 dark:text-red-600 dark:bg-white"
          }`}
        >
          <ArrowDownCircle className="mr-2" size={20} /> Short
        </button>
      </div>
    </div>
  );
}
