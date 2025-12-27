import { useState } from "react";
import { supabase } from "../config/supabase";

export default function LogTrade() {
  const [symbol, setSymbol] = useState("");
  const [direction, setDirection] = useState("Long");
  const [status, setStatus] = useState("Open");
  const [entryPrice, setEntryPrice] = useState("");
  const [strategy, setStrategy] = useState("");
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [settlement, setSettlement] = useState("");
  const [buysideLiquidity, setBuysideLiquidity] = useState<string[]>([]);
  const [sellsideLiquidity, setSellsideLiquidity] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      symbol,
      direction,
      status,
      entry_price: parseFloat(entryPrice),
      strategy,
      mood,
      notes,
      settlement,
      buyside_liquidity: buysideLiquidity,
      sellside_liquidity: sellsideLiquidity,
      created_at: new Date().toISOString(), // auto timestamp
    };

    const { error } = await supabase.from("trades").insert([payload]);

    if (error) {
      console.error("Error saving trade:", error.message);
    } else {
      console.log("Trade saved!");
      // reset form
      setSymbol("");
      setDirection("Long");
      setStatus("Open");
      setEntryPrice("");
      setStrategy("");
      setMood("");
      setNotes("");
      setSettlement("");
      setBuysideLiquidity([]);
      setSellsideLiquidity([]);
    }

    setSaving(false);
  };

  return (
    <div className="log-trade">
      <h1>Log New Trade</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Symbol (e.g. EURUSD)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />

        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option>Long</option>
          <option>Short</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Open</option>
          <option>Closed</option>
        </select>

        <input
          type="number"
          placeholder="Entry Price"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Strategy"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        />

        <input
          type="text"
          placeholder="Mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <select
          value={settlement}
          onChange={(e) => setSettlement(e.target.value)}
        >
          <option value="">Settlement</option>
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
          <option value="BreakEven">Break Even</option>
        </select>

        {/* Liquidity notes (basic text input for now) */}
        <input
          type="text"
          placeholder="Buyside Liquidity"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setBuysideLiquidity([
                ...buysideLiquidity,
                (e.target as HTMLInputElement).value,
              ]);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <input
          type="text"
          placeholder="Sellside Liquidity"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setSellsideLiquidity([
                ...sellsideLiquidity,
                (e.target as HTMLInputElement).value,
              ]);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Trade"}
        </button>
      </form>
    </div>
  );
}
