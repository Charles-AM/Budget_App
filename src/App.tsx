import { useState } from "react";
import { AssistantWidget } from "./components/AssistantWidget";
import { CategoryBudget } from "./components/CategoryBudget";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { type Transaction, useBudget } from "./hooks/useBudget";

type UserProfile = {
  name: string;
  email: string;
};

const storageKey = "budgetUserProfile";

type BudgetShellProps = {
  user: UserProfile;
  onLogout: () => void;
};

function BudgetShell({ user, onLogout }: BudgetShellProps) {
  const {
    addTransaction,
    budgets,
    deleteTransaction,
    isLoading,
    monthTransactions,
    overallBudget,
    remainingBudgetOverall,
    selectedMonth,
    clearMonth,
    error,
    reload,
    resetDatabase,
    setBudget,
    setSelectedMonth,
    spendingByCategory,
    totalIncomeThisMonth,
    totalSpentThisMonth,
    transactions,
    updateTransaction,
  } = useBudget(user.email);

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleSubmit = async (transaction: Omit<Transaction, "id">) => {
    if (editingTransaction?.id) {
      await updateTransaction(editingTransaction.id, transaction);
      setEditingTransaction(null);
      return;
    }

    await addTransaction(transaction);
  };

  const handleQuickAdd = (data: { amount: number; category: Transaction["category"]; description: string }) => {
    const today = new Date().toISOString().slice(0, 10);
    void addTransaction({
      amount: Math.abs(data.amount),
      category: data.category,
      date: today,
      description: data.description,
    });
  };

  const handleJumpToCurrentMonth = () => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(monthKey);
  };

  const handleClearMonth = async () => {
    const confirmed = window.confirm(
      "Clear all transactions and reset budgets for this month? This cannot be undone.",
    );
    if (!confirmed) return;
    await clearMonth(selectedMonth);
  };

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="surface glow-border w-full max-w-lg p-6 text-center">
          <h2 className="font-display text-2xl text-slate-100">Budget load failed</h2>
          <p className="mt-2 text-sm text-slate-400">
            {error}. Try again, or reset local data if storage is blocked.
          </p>
          <div className="mt-5 grid gap-3">
            <button type="button" className="glow-button" onClick={reload}>
              Try again
            </button>
            <button type="button" className="mini-danger" onClick={resetDatabase}>
              Reset local data
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="surface px-5 py-4 text-sm font-medium text-slate-300">
          Loading budget...
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto mb-6 flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Signed in
          </p>
          <h1 className="font-display mt-2 text-2xl text-slate-100">
            Welcome, {user.name}
          </h1>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
        <button type="button" onClick={onLogout} className="ghost-button">
          Sign out
        </button>
      </div>

      <div className="mx-auto grid max-w-7xl gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-7">
          <Dashboard
            overallBudget={overallBudget}
            recentTransactions={monthTransactions}
            remainingBudgetOverall={remainingBudgetOverall}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            spendingByCategory={spendingByCategory}
            totalIncomeThisMonth={totalIncomeThisMonth}
            totalSpentThisMonth={totalSpentThisMonth}
          />
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            onEdit={setEditingTransaction}
          />
        </div>

        <aside className="space-y-7 xl:sticky xl:top-8 xl:self-start">
          <AssistantWidget
            overallBudget={overallBudget}
            remainingBudgetOverall={remainingBudgetOverall}
            spendingByCategory={spendingByCategory}
            onQuickAdd={handleQuickAdd}
            onJumpToCurrentMonth={handleJumpToCurrentMonth}
            onClearMonth={handleClearMonth}
          />
          <TransactionForm
            editingTransaction={editingTransaction}
            onCancelEdit={() => setEditingTransaction(null)}
            onSubmit={handleSubmit}
          />
          <CategoryBudget budgets={budgets} onSetBudget={setBudget} />
        </aside>
      </div>

      <footer className="mx-auto mt-10 max-w-7xl pb-6 text-center text-xs text-slate-500">
        Built by Charles Appiah Manu
      </footer>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (profile: UserProfile) => {
    localStorage.setItem(storageKey, JSON.stringify(profile));
    setUser(profile);
  };

  const handleLogout = () => {
    setUser(null);
  };
  if (!user) {
    return <Login onLogin={handleLogin} initialProfile={savedProfile} />;
  }

  return <BudgetShell user={user} onLogout={handleLogout} />;
}
