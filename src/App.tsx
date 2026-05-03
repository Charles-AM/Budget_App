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

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as UserProfile) : null;
    } catch {
      return null;
    }
  });

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
    setBudget,
    setSelectedMonth,
    spendingByCategory,
    totalIncomeThisMonth,
    totalSpentThisMonth,
    transactions,
    updateTransaction,
  } = useBudget(user?.email ?? "guest");

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleSubmit = async (transaction: Omit<Transaction, "id">) => {
    if (editingTransaction?.id) {
      await updateTransaction(editingTransaction.id, transaction);
      setEditingTransaction(null);
      return;
    }

    await addTransaction(transaction);
  };

  const handleLogin = (profile: UserProfile) => {
    localStorage.setItem(storageKey, JSON.stringify(profile));
    setUser(profile);
  };

  const handleLogout = () => {
    localStorage.removeItem(storageKey);
    setUser(null);
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

  if (!user) {
    return <Login onLogin={handleLogin} />;
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
        <button type="button" onClick={handleLogout} className="ghost-button">
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
    </main>
  );
}
