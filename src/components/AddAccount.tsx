import { useState } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../hooks/useAuth";

export default function AddAccount() {
  const { user } = useAuth();
  const [broker, setBroker] = useState("");
  const [accountName, setAccountName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("❌ You must be logged in.");
      return;
    }

    // 1. Insert into accounts table
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: user.id,
          broker,
          account_name: accountName,
        },
      ])
      .select()
      .single();

    if (accountError) {
      setMessage("❌ Error creating account");
      return;
    }

    // 2. Insert initial balance into balances table
    const { error: balanceError } = await supabase.from("balances").insert([
      {
        account_id: account.id,
        amount: parseFloat(initialBalance),
        currency,
      },
    ]);

    if (balanceError) {
      setMessage("❌ Error saving initial balance");
    } else {
      setMessage("✅ Account created successfully!");
      setBroker("");
      setAccountName("");
      setInitialBalance("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Add New Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Broker (e.g. Binance)"
          value={broker}
          onChange={(e) => setBroker(e.target.value)}
          className="w-full rounded-lg bg-gray-50 p-2 focus:outline-none border-none"
        />

        <input
          type="text"
          placeholder="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full rounded-lg bg-gray-50 p-2 focus:outline-none border-none"
        />

        <input
          type="number"
          placeholder="Initial Balance"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          className="w-full rounded-lg bg-gray-50 p-2 focus:outline-none border-none"
        />

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-lg bg-gray-50 p-2 focus:outline-none border-none"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="NGN">NGN</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Save Account
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </div>
  );
}
