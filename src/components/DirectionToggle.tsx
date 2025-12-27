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
      <label className="block text-sm font-medium text-gray-700">
        Direction
      </label>
      <div className="flex space-x-4 mt-1">
        <button
          type="button"
          onClick={() => onChange("Long")}
          className={`flex-1 flex items-center justify-center rounded-md border p-2 ${
            value === "Long"
              ? "border-green-500 bg-green-50 text-green-600"
              : "border-gray-300 text-gray-500"
          }`}
        >
          <ArrowUpCircle className="mr-2" size={20} /> Long
        </button>
        <button
          type="button"
          onClick={() => onChange("Short")}
          className={`flex-1 flex items-center justify-center rounded-md border p-2 ${
            value === "Short"
              ? "border-red-500 bg-red-50 text-red-600"
              : "border-gray-300 text-gray-500"
          }`}
        >
          <ArrowDownCircle className="mr-2" size={20} /> Short
        </button>
      </div>
    </div>
  );
}
