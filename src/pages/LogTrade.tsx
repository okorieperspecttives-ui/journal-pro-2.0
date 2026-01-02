import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import SymbolSelector from "../components/SymbolSelector";
import DirectionToggle from "../components/DirectionToggle";
import StatusDropdown from "../components/StatusDropdown";
import StrategyDropdown from "../components/StrategyDropdown";
import MoodSelector from "../components/MoodSelector";
import TradeNotes from "../components/TradeNotes";
import SaveButton from "../components/SaveButton";
import { useAuth } from "../hooks/useAuth";
import MotionWrapper from "../helpers/MotionWrapper";
import { LucideLoader } from "lucide-react";

export default function LogTrade() {
  const [symbol, setSymbol] = useState("");
  const [direction, setDirection] = useState("Long");
  const [status, setStatus] = useState("Pending");
  const [strategy, setStrategy] = useState("Breakout");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [riskUsd, setRiskUsd] = useState("");
  const [profitUsd, setProfitUsd] = useState("");
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

      // Parse numeric values
      const entry = entryPrice ? parseFloat(entryPrice) : null;
      const exit = exitPrice ? parseFloat(exitPrice) : null;
      const risk = riskUsd ? parseFloat(riskUsd) : null;
      const profit = profitUsd ? parseFloat(profitUsd) : null;

      // Auto-calc return_r if risk and profit are provided
      const returnR = risk && profit ? profit / risk : null;

      const { error } = await supabase.from("trade_entries").insert([
        {
          symbol,
          direction,
          status, // will be "Pending" unless explicitly changed
          strategy,
          entry_price: entry,
          exit_price: exit,
          risk_usd: risk,
          profit_usd: profit,
          return_r: returnR,
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
      setStatus("Pending"); // reset back to Pending
      setStrategy("Breakout");
      setEntryPrice("");
      setExitPrice("");
      setRiskUsd("");
      setProfitUsd("");
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

  if (loading)
    return (
      <MotionWrapper>
        <div className="w-full h-screen bg-gray-50 flex items-center dark:bg-background-dark justify-center">
          <LucideLoader className="animate-spin text-blue-600" size={32} />
        </div>
      </MotionWrapper>
    );

  if (!user) {
    return (
      <MotionWrapper>
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark">
          <div className="bg-card dark:bg-card-dark w-[95%] rounded-xl shadow-md p-6  max-w-sm text-center">
            <h1 className="text-xl  font-semibold mb-4 text-text dark:text-text-dark">
              Log New Trade
            </h1>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              You must be logged in to access this page.
            </p>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="px-4 py-2 bg-blue-600 dark:bg-background-dark text-white rounded-lg shadow hover:bg-blue-700 dark:hover:bg-card-dark transition"
            >
              Go to Auth Page
            </button>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper>
      <div className="p-4 pb-20 remove_scrollbar bg-gray-50 dark:bg-background-dark">
        <h1 className="text-xl font-semibold mb-4 dark:text-text-dark">
          Log New Trade
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-primary-dark rounded-lg shadow p-4"
        >
          <SymbolSelector value={symbol} onChange={setSymbol} required={true} />
          <DirectionToggle value={direction} onChange={setDirection} />
          <StatusDropdown value={status} onChange={setStatus} />
          <StrategyDropdown value={strategy} onChange={setStrategy} />

          {/* Entry Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
              Entry Price
            </label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="0.0000"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:placeholder-gray-300 h-10 dark:bg-background-dark p-2"
            />
          </div>

          {/* Exit Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
              Exit Price
            </label>
            <input
              type="number"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              placeholder="0.0000"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:placeholder-gray-300 h-10 dark:bg-background-dark p-2"
            />
          </div>

          {/* Risk USD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
              Risk (USD)
            </label>
            <input
              type="number"
              value={riskUsd}
              onChange={(e) => setRiskUsd(e.target.value)}
              placeholder="100"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:placeholder-gray-300 h-10 dark:bg-background-dark p-2"
            />
          </div>

          {/* Profit/Loss USD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
              Profit/Loss (USD)
            </label>
            <input
              type="number"
              value={profitUsd}
              onChange={(e) => setProfitUsd(e.target.value)}
              placeholder="150"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:placeholder-gray-300 h-10 dark:bg-background-dark p-2"
            />
          </div>

          <MoodSelector value={mood} onChange={setMood} />
          <TradeNotes value={notes} onChange={setNotes} />
          <SaveButton />

          {loading && <p className="text-sm text-gray-500">Saving trade...</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
        </form>
      </div>
    </MotionWrapper>
  );
}
