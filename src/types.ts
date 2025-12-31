export interface TradeEntry {
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
