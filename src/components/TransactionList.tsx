import { useMemo, useState } from "react";
import { CATEGORIES, type Category, type Transaction } from "../hooks/useBudget";

type TransactionListProps = {
  transactions: Transaction[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (transaction: Transaction) => void;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");
  const [dateFilter, setDateFilter] = useState("");

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesCategory =
          categoryFilter === "All" || transaction.category === categoryFilter;
        const matchesDate = !dateFilter || transaction.date === dateFilter;
        return matchesCategory && matchesDate;
      }),
    [categoryFilter, dateFilter, transactions],
  );

  return (
    <section className="surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Transactions</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as Category | "All")}
            className="select-field"
          >
            <option>All</option>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/70">
        {filteredTransactions.length === 0 ? (
          <div className="bg-slate-900/80 p-6 text-center text-sm text-slate-400">
            No transactions match the current filters.
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {filteredTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="grid gap-3 bg-slate-900/70 p-4 transition hover:bg-slate-900 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-100">{transaction.description}</p>
                    <span className="chip">{transaction.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{transaction.date}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p
                    className={`text-base font-semibold ${
                      transaction.category === "Income" ? "text-emerald-300" : "text-slate-100"
                    }`}
                  >
                    {transaction.category === "Income" ? "+" : "-"}
                    {currency.format(transaction.amount)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onEdit(transaction)}
                    className="ghost-button"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => transaction.id && onDelete(transaction.id)}
                    className="danger-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
