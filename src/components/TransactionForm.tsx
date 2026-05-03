import { type FormEvent, useEffect, useState } from "react";
import { CATEGORIES, type Category, type Transaction } from "../hooks/useBudget";

type TransactionFormProps = {
  editingTransaction?: Transaction | null;
  onCancelEdit: () => void;
  onSubmit: (transaction: Omit<Transaction, "id">) => Promise<void>;
};

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
  amount: "",
  category: "Food" as Category,
  date: today(),
  description: "",
};

export function TransactionForm({
  editingTransaction,
  onCancelEdit,
  onSubmit,
}: TransactionFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        date: editingTransaction.date,
        description: editingTransaction.description,
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    await onSubmit({
      amount: Math.abs(Number(form.amount)),
      category: form.category,
      date: form.date,
      description: form.description.trim() || form.category,
    });

    setForm(emptyForm);
    setIsSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="surface p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-100">
          {editingTransaction ? "Edit transaction" : "Add transaction"}
        </h2>
        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="ghost-button"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Amount</span>
          <input
            required
            min="0.01"
            step="0.01"
            type="number"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
            className="input-field"
            placeholder="42.00"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Category</span>
          <select
            value={form.category}
            onChange={(event) =>
              setForm({ ...form, category: event.target.value as Category })
            }
            className="select-field"
          >
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Date</span>
          <input
            required
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
            className="input-field"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-slate-300">Description</span>
          <input
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className="input-field"
            placeholder="Groceries, rent, salary..."
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="glow-button mt-5"
      >
        {isSaving ? "Saving..." : editingTransaction ? "Save changes" : "Add transaction"}
      </button>
    </form>
  );
}
