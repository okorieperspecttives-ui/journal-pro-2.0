export interface TradeEntry {
  id: string; // assuming every trade has a unique id
  strategy: string | null;
  profit_usd: number;
  mood: string | null;
  finalized?: boolean; // optional since you filter by it
}
