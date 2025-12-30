import type { TradeEntry } from "../types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MoodImpactProps {
  trades: TradeEntry[];
}

export default function MoodImpact({ trades }: MoodImpactProps) {
  const moodStats: Record<string, number> = {};
  trades.forEach((t) => {
    const mood = t.mood ?? "Unknown";
    moodStats[mood] = (moodStats[mood] ?? 0) + 1;
  });

  const moodData = {
    labels: Object.keys(moodStats),
    datasets: [
      {
        data: Object.values(moodStats),
        backgroundColor: [
          "#3b82f6", // blue
          "#ef4444", // red
          "#10b981", // green
          "#f59e0b", // yellow
          "#8b5cf6", // purple
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section>
      <h3 className="text-lg font-semibold mb-2">Mood Impact</h3>
      <div className="w-64 h-64 mx-auto">
        <Pie data={moodData} />
      </div>
    </section>
  );
}
