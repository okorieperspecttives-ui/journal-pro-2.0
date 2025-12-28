import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../hooks/useAuth";
import MotionWrapper from "../helpers/MotionWrapper";
import { Check, LucideLoader, Save, Trash, X } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

// Define the trade entry type
interface TradeEntry {
  id: string;
  user_id: string;
  symbol: string;
  direction: "Long" | "Short";
  status: string;
  strategy: string;
  entry_price: number | null;
  exit_price: number | null;
  risk_usd: number | null;
  profit_usd: number | null;
  return_r: number | null;
  mood: string;
  notes: string | null;
  executed_at: string; // ISO timestamp
  created_at: string;
}

type GroupedTrades = Record<string, TradeEntry[]>;
type ConfirmModalType = "delete" | "saveall" | null;

export default function RecentTrades() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  // inside your component
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "All" | "Winning" | "Losing" | "Long" | "Short"
  >("All");
  const [search, setSearch] = useState("");
  const [selectedTrade, setSelectedTrade] = useState<TradeEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    type: ConfirmModalType;
    open: boolean;
  }>({
    type: null,
    open: false,
  });

  const openModal = async (tradeId: string) => {
    const { data, error } = await supabase
      .from("trade_entries")
      .select("*")
      .eq("id", tradeId)
      .single();

    if (!error && data) {
      setSelectedTrade(data as TradeEntry);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedTrade(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    console.log("Pretend deleting trade with id:", id);
    setConfirmModal({ type: null, open: false });
    setActionModalOpen(false);
  };

  const handleSaveAll = async () => {
    if (!selectedTrade) return;

    setSaving(true);
    setErrorMsg(null);

    const num = (v: unknown): number | null => {
      if (v === null || v === undefined || v === "") return null;
      const n = typeof v === "string" ? Number(v.trim()) : (v as number);
      return Number.isFinite(n) ? n : null;
    };
    const str = (v: unknown): string =>
      typeof v === "string" ? v.trim() : (v as string) ?? "";

    const symbol = str(selectedTrade.symbol);
    const executedAt = selectedTrade.executed_at ?? null;
    const direction: "Long" | "Short" =
      selectedTrade.direction === "Short" ? "Short" : "Long";

    const entry = num(selectedTrade.entry_price);
    const exit = num(selectedTrade.exit_price);
    const risk = num(selectedTrade.risk_usd);
    const profit = num(selectedTrade.profit_usd);

    const isSettled = entry !== null && exit !== null;

    // ✅ Settlement required for finalization
    if (!isSettled) {
      toast.error(
        "Cannot finalize: trade must have both entry and exit prices."
      );
      setConfirmModal({ type: null, open: false });
      setActionModalOpen(false);
      setSaving(false);
      return;
    }

    // ✅ Required field checks
    if (!symbol || !executedAt || !direction) {
      toast.error("Cannot finalize: missing required fields.");
      setConfirmModal({ type: null, open: false });
      setActionModalOpen(false);
      setSaving(false);
      return;
    }

    // ✅ Safe return in R calculation
    const returnR =
      risk !== null && risk > 0 && profit !== null ? profit / risk : null;

    const payload = {
      ...selectedTrade,
      symbol,
      entry_price: entry,
      exit_price: exit,
      risk_usd: risk,
      profit_usd: profit,
      notes: str(selectedTrade.notes),
      direction,
      return_r: returnR,
      finalized: true,
    };

    try {
      const { error } = await supabase
        .from("trade_entries")
        .update(payload)
        .eq("id", selectedTrade.id);

      if (error) {
        toast.error(error.message);
      } else {
        setTrades((prev) =>
          prev.map((t) =>
            t.id === selectedTrade.id ? ({ ...t, ...payload } as TradeEntry) : t
          )
        );
        toast.success("Trade finalized successfully");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Unexpected error occurred");
    } finally {
      setConfirmModal({ type: null, open: false });
      setActionModalOpen(false);
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTrade) return;

    setSaving(true);
    setErrorMsg(null);

    const entry = selectedTrade.entry_price ?? null;
    const exit = selectedTrade.exit_price ?? null;
    const risk = selectedTrade.risk_usd ?? null;
    let profit = selectedTrade.profit_usd ?? null;

    // ✅ Explicit check: profit requires both entry and exit
    if (profit !== null && (entry === null || exit === null)) {
      setErrorMsg("Profit cannot be saved without both entry and exit prices.");
      setSaving(false);
      return;
    }

    // Derive return in R only if risk and profit are valid
    const returnR =
      risk !== null && risk > 0 && profit !== null ? profit / risk : null;

    const payload = {
      symbol: selectedTrade.symbol ?? "",
      entry_price: entry,
      exit_price: exit,
      risk_usd: risk,
      profit_usd: profit,
      notes: selectedTrade.notes ?? "",
      direction: selectedTrade.direction === "Short" ? "Short" : "Long",
      return_r: returnR,
    };

    try {
      const { error } = await supabase
        .from("trade_entries")
        .update(payload)
        .eq("id", selectedTrade.id);

      if (error) {
        setErrorMsg(error.message);
      } else {
        setTrades((prev) =>
          prev.map((t) =>
            t.id === selectedTrade.id ? ({ ...t, ...payload } as TradeEntry) : t
          )
        );
        closeModal();
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? "Unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchTrades = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("trade_entries")
          .select("*")
          .eq("user_id", user?.id)
          .order("executed_at", { ascending: false });

        if (!error && data) setTrades(data as TradeEntry[]);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTrades();
  }, [user]);

  // Apply filters first
  const applyFilters = (trades: TradeEntry[]): TradeEntry[] => {
    let filtered = trades;
    if (filter === "Winning")
      filtered = filtered.filter((t) => (t.return_r ?? 0) > 0);
    if (filter === "Losing")
      filtered = filtered.filter((t) => (t.return_r ?? 0) < 0);
    if (filter === "Long")
      filtered = filtered.filter((t) => t.direction === "Long");
    if (filter === "Short")
      filtered = filtered.filter((t) => t.direction === "Short");
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.strategy.toLowerCase().includes(q)
      );
    }
    return filtered;
  };

  const filteredTrades = applyFilters(trades);

  // Group by month/year
  const groupedTrades: GroupedTrades = filteredTrades.reduce((acc, trade) => {
    const monthKey = dayjs(trade.executed_at).format("MMMM YYYY");
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(trade);
    return acc;
  }, {} as GroupedTrades);

  if (!user) {
    return (
      <MotionWrapper>
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm text-center">
            <h1 className="text-xl font-semibold mb-4">Log New Trade</h1>
            <p className="mb-4 text-gray-600">
              You must be logged in to access this page.
            </p>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Go to Auth Page
            </button>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  if (loading) {
    return (
      <MotionWrapper>
        <div className="flex justify-center items-center h-full">
          <LucideLoader className="animate-spin" />
        </div>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Recent Trades</h1>

        {/* Search + Filters */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search symbol or strategy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2  rounded border-gray-300 shadow-sm 
                focus:border-none focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 ">
            {["All", "Winning", "Losing", "Long", "Short"].map((f) => {
              const colors: Record<string, string> = {
                All: "bg-gray-200 text-gray-700",
                Winning: "bg-green-200 text-green-700",
                Losing: "bg-red-200 text-red-700",
                Long: "bg-teal-200 text-teal-700",
                Short: "bg-orange-200 text-orange-700",
              };
              const activeColors: Record<string, string> = {
                All: "bg-blue-600 text-white",
                Winning: "bg-green-600 text-white",
                Losing: "bg-red-600 text-white",
                Long: "bg-teal-600 text-white",
                Short: "bg-orange-600 text-white",
              };
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    filter === f ? activeColors[f] : colors[f]
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trades grouped by month */}
        {Object.entries(groupedTrades).map(([month, trades]) => (
          <div key={month} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{month}</h2>
            {trades.length === 0 ? (
              <p className="text-sm text-gray-500">
                No trades match this filter.
              </p>
            ) : (
              <ul className="space-y-2">
                {trades.map((trade) => {
                  let pressTimer: ReturnType<typeof setTimeout>;

                  const handleMouseDown = () => {
                    pressTimer = setTimeout(() => {
                      setSelectedTrade(trade);
                      setActionModalOpen(true);
                    }, 800); // 800ms hold
                  };

                  const handleMouseUp = () => {
                    clearTimeout(pressTimer);
                  };

                  return (
                    <li
                      key={trade.id}
                      onClick={() => openModal(trade.id)} // normal click
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleMouseDown}
                      onTouchEnd={handleMouseUp}
                      className={`flex justify-between bg-white p-3 pl-4 rounded-lg shadow-sm border-l-4 mb-3 ${
                        trade.direction === "Long"
                          ? "border-green-500"
                          : "border-red-500"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{trade.symbol}</p>
                        <p className="text-xs text-gray-500">
                          {trade.strategy} •{" "}
                          {dayjs(trade.executed_at).format("MMM D")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            (trade.return_r ?? 0) > 0
                              ? "text-green-600"
                              : (trade.return_r ?? 0) < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {trade.return_r !== null
                            ? `${trade.return_r.toFixed(2)}R`
                            : "—"}
                        </p>
                        <p
                          className={`text-sm ${
                            (trade.profit_usd ?? 0) > 0
                              ? "text-green-600"
                              : (trade.profit_usd ?? 0) < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {trade.profit_usd !== null
                            ? `$${trade.profit_usd.toFixed(2)}`
                            : "$0.00"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
        {isModalOpen && selectedTrade && (
          <MotionWrapper>
            <div className="fixed inset-0 transition-colors duration-500 ease-in-out bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-100 rounded-lg shadow-lg p-6 max-w-md w-[90%]">
                <h2 className="text-lg font-semibold mb-4">Edit Trade</h2>

                {/* Editable fields */}
                <div className="space-y-4">
                  {/* Symbol */}
                  <input
                    type="text"
                    value={selectedTrade?.symbol ?? ""}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade!,
                        symbol: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-2"
                    placeholder="Symbol"
                  />

                  {/* Entry Price */}
                  <input
                    type="number"
                    value={selectedTrade?.entry_price ?? ""}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade!,
                        entry_price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-2"
                    placeholder="Entry Price"
                  />

                  {/* Exit Price */}
                  <input
                    type="number"
                    value={selectedTrade?.exit_price ?? ""}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade!,
                        exit_price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-2"
                    placeholder="Exit Price"
                  />

                  {/* Risk USD */}
                  <input
                    type="number"
                    value={selectedTrade?.risk_usd ?? ""}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade!,
                        risk_usd: parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-2"
                    placeholder="Risk (USD)"
                  />

                  {/* Profit/Loss USD */}
                  <input
                    type="number"
                    value={selectedTrade?.profit_usd ?? ""}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade!,
                        profit_usd: parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-2"
                    placeholder="Profit/Loss (USD)"
                  />

                  {/* Direction */}
                  <select
                    value={selectedTrade?.direction ?? "Long"}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade!,
                        direction: e.target.value as "Long" | "Short",
                      })
                    }
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-2"
                  >
                    <option value="Long">Long</option>
                    <option value="Short">Short</option>
                  </select>

                  {/* Status */}
                  <select
                    value={selectedTrade?.status ?? "Pending"}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade!,
                        status: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {/* Notes */}
                  <textarea
                    value={selectedTrade?.notes ?? ""}
                    onChange={(e) =>
                      setSelectedTrade({
                        ...selectedTrade!,
                        notes: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-2 whitespace-pre-wrap"
                    placeholder="Notes"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    <X className="w-7 h-7" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    disabled={saving}
                  >
                    {saving ? (
                      <LucideLoader className="w-7 h-7 animate-spin" />
                    ) : (
                      <Save className="w-7 h-7" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </MotionWrapper>
        )}

        {actionModalOpen && selectedTrade && (
          <MotionWrapper>
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-100 rounded-lg shadow-lg p-6 max-w-sm w-[90%] text-center">
                <h2 className="text-lg font-semibold mb-4">Choose Action</h2>

                {/* Action buttons */}
                <div className="flex justify-center gap-6">
                  {/* Delete */}
                  <button
                    onClick={() =>
                      setConfirmModal({ type: "delete", open: true })
                    }
                    className="p-4 bg-red-600 text-white rounded-full"
                  >
                    <Trash className="w-8 h-8" />
                  </button>

                  {/* Save All */}
                  <button
                    onClick={() =>
                      setConfirmModal({ type: "saveall", open: true })
                    }
                    className="p-4 bg-blue-600 text-white rounded-full"
                  >
                    <Save className="w-8 h-8" />
                  </button>
                </div>

                {/* Cancel */}
                <button
                  onClick={() => setActionModalOpen(false)}
                  className="mt-6 p-3 bg-gray-300 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </MotionWrapper>
        )}

        {confirmModal.open && selectedTrade && (
          <MotionWrapper>
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-[90%] text-center">
                <h2 className="text-lg font-semibold mb-4">
                  {confirmModal.type === "delete"
                    ? "Confirm Delete?"
                    : "Confirm Save All?"}
                </h2>

                <div className="flex justify-center gap-6">
                  {/* Confirm */}
                  <button
                    onClick={() =>
                      confirmModal.type === "delete"
                        ? handleDelete(selectedTrade.id)
                        : handleSaveAll()
                    }
                    className="p-4 bg-green-600 text-white rounded-full"
                  >
                    <Check className="w-8 h-8" />
                  </button>

                  {/* Cancel */}
                  <button
                    onClick={() => setConfirmModal({ type: null, open: false })}
                    className="p-4 bg-gray-300 rounded-full"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
          </MotionWrapper>
        )}
      </div>
    </MotionWrapper>
  );
}
