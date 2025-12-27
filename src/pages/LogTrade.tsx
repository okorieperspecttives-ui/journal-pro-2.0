import { useState, useEffect } from "react";
import { supabase } from "../config/supabase"; // make sure you have this configured
import SymbolSelector from "../components/SymbolSelector";
import DirectionToggle from "../components/DirectionToggle";
import StatusDropdown from "../components/StatusDropdown";
import StrategyDropdown from "../components/StrategyDropdown";
import MoodSelector from "../components/MoodSelector";
import TradeNotes from "../components/TradeNotes";
import SaveButton from "../components/SaveButton";
import { useAuth } from "../hooks/useAuth";

export default function LogTrade() {
  const [symbol, setSymbol] = useState("");
  const [direction, setDirection] = useState("Long");
  const [status, setStatus] = useState("Open");
  const [strategy, setStrategy] = useState("Breakout");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [mood, setMood] = useState("Neutral");
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");
  const { user, loading, setLoading, setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("trade_entries").insert([
        {
          symbol,
          direction,
          status,
          strategy,
          entry_price: entryPrice ? parseFloat(entryPrice) : null,
          exit_price: exitPrice ? parseFloat(exitPrice) : null,
          mood,
          notes,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setMessage("Trade saved successfully ✅");

      // reset form
      setSymbol("");
      setDirection("Long");
      setStatus("Open");
      setStrategy("Breakout");
      setEntryPrice("");
      setExitPrice("");
      setMood("Neutral");
      setNotes("");
    } catch (err: any) {
      console.error("Error saving trade:", err);
      setMessage(`Error: ${err.message || "Unexpected error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Log New Trade</h1>
        <p>You must be logged in to access this page.</p>
        <button
          onClick={() => (window.location.href = "/auth")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go to Auth Page
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Log New Trade</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-lg shadow p-4"
      >
        <SymbolSelector value={symbol} onChange={setSymbol} required={true} />
        <DirectionToggle value={direction} onChange={setDirection} />
        <StatusDropdown value={status} onChange={setStatus} />
        <StrategyDropdown value={strategy} onChange={setStrategy} />

        {/* Entry Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Entry Price
          </label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            placeholder="0.0000"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Exit Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Exit Price
          </label>
          <input
            type="number"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            placeholder="0.0000"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <MoodSelector value={mood} onChange={setMood} />
        <TradeNotes value={notes} onChange={setNotes} />
        <SaveButton />

        {loading && <p className="text-sm text-gray-500">Saving trade...</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
