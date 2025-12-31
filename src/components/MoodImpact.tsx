import type { TradeEntry } from "../types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface MoodImpactProps {
  trades: TradeEntry[];
}

export default function MoodImpact({ trades }: MoodImpactProps) {
  const moodStats: Record<string, { wins: number; total: number }> = {};

  trades.forEach((t) => {
    const mood = t.mood ?? "Unknown";
    if (!moodStats[mood]) moodStats[mood] = { wins: 0, total: 0 };
    moodStats[mood].total += 1;
    if (t.profit_usd !== null && t.profit_usd > 0) {
      moodStats[mood].wins += 1;
    }
  });

  const labels = Object.keys(moodStats);
  const winRates = labels.map((mood) =>
    Math.round((moodStats[mood].wins / moodStats[mood].total) * 100)
  );

  const moodData = {
    labels,
    datasets: [
      {
        label: "Win Rate (%)",
        data: winRates,
        backgroundColor: [
          "#3b82f6", // blue
          "#ef4444", // red
          "#10b981", // green
          "#f59e0b", // yellow
          "#8b5cf6", // purple
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-10">
        Mood Impact on Performance
      </h3>
      <div className="w-full h-72">
        <Bar
          data={moodData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
      <div className="mt-6 space-y-2 text-sm text-gray-600">
        {labels.map((mood, idx) => (
          <p key={mood}>
            {mood}: {winRates[idx]}% win rate ({moodStats[mood].wins}/
            {moodStats[mood].total} wins)
          </p>
        ))}
      </div>
    </div>
  );
}
