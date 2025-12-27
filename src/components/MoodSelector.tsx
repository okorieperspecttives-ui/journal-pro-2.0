import { Smile, Meh, Frown, Target, Angry } from "lucide-react";

const moods = [
  { label: "Happy", icon: Smile, color: "text-yellow-500" },
  { label: "Neutral", icon: Meh, color: "text-blue-500" },
  { label: "Focused", icon: Target, color: "text-green-500" },
  { label: "Sad", icon: Frown, color: "text-gray-500" },
  { label: "Angry", icon: Angry, color: "text-red-500" },
];

export default function MoodSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Mood / Psychology
      </label>
      <div className="flex space-x-4 mt-1">
        {moods.map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            className={`p-2 rounded-md ${
              value === label ? color : "text-gray-400"
            }`}
          >
            <Icon size={24} />
          </button>
        ))}
      </div>
    </div>
  );
}
