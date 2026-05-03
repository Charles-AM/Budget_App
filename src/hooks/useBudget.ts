import { useCallback, useEffect, useMemo, useState } from "react";
import Dexie, { type Table } from "dexie";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Income",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Transaction = {
  id?: number;
  amount: number;
  category: Category;
  date: string;
  description: string;
};

export type CategoryBudget = {
  category: Category;
  amount: number;
};

type NewTransaction = Omit<Transaction, "id">;

class BudgetDatabase extends Dexie {
  transactions!: Table<Transaction, number>;
  budgets!: Table<CategoryBudget, Category>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      transactions: "++id, category, date",
      budgets: "category",
    });
  }
}

const defaultBudgets: CategoryBudget[] = CATEGORIES.map((category) => ({
  category,
  amount: category === "Income" ? 0 : 500,
}));

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const isSameMonth = (dateString: string, monthKey: string) =>
  dateString.slice(0, 7) === monthKey;

export function useBudget(userKey: string) {
  const safeKey = userKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const dbName = `personalBudgetDatabase_${safeKey || "guest"}`;
  const db = useMemo(() => new BudgetDatabase(dbName), [dbName]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(defaultBudgets);
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey(new Date()));
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [savedTransactions, savedBudgets] = await Promise.all([
      db.transactions.orderBy("date").reverse().toArray(),
      db.budgets.toArray(),
    ]);

    if (savedBudgets.length === 0) {
      await db.budgets.bulkPut(defaultBudgets);
      setBudgets(defaultBudgets);
    } else {
      const budgetMap = new Map(savedBudgets.map((item) => [item.category, item]));
      setBudgets(
        CATEGORIES.map((category) => budgetMap.get(category) ?? { category, amount: 0 }),
      );
    }

    setTransactions(savedTransactions);
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    setIsLoading(true);
    refresh();
    return () => {
      db.close();
    };
  }, [db, refresh]);

  const addTransaction = useCallback(
    async (transaction: NewTransaction) => {
      await db.transactions.add(transaction);
      await refresh();
    },
    [refresh],
  );

  const updateTransaction = useCallback(
    async (id: number, transaction: NewTransaction) => {
      await db.transactions.update(id, transaction);
      await refresh();
    },
    [refresh],
  );

  const deleteTransaction = useCallback(
    async (id: number) => {
      await db.transactions.delete(id);
      await refresh();
    },
    [refresh],
  );

  const setBudget = useCallback(
    async (category: Category, amount: number) => {
      await db.budgets.put({ category, amount });
      await refresh();
    },
    [refresh],
  );

  const clearMonth = useCallback(
    async (monthKey: string) => {
      await db.transaction("rw", db.transactions, db.budgets, async () => {
        await db.transactions.where("date").startsWith(monthKey).delete();
        await db.budgets.clear();
        await db.budgets.bulkPut(defaultBudgets);
      });
      await refresh();
    },
    [refresh],
  );

  const monthTransactions = useMemo(
    () => transactions.filter((transaction) => isSameMonth(transaction.date, selectedMonth)),
    [selectedMonth, transactions],
  );

  const spendingByCategory = useMemo(
    () =>
      CATEGORIES.map((category) => {
        const spent = monthTransactions
          .filter((transaction) => transaction.category === category && category !== "Income")
          .reduce((total, transaction) => total + transaction.amount, 0);
        const budget = budgets.find((item) => item.category === category)?.amount ?? 0;
        return { category, spent, budget };
      }),
    [budgets, monthTransactions],
  );

  const totalSpentThisMonth = useMemo(
    () =>
      monthTransactions
        .filter((transaction) => transaction.category !== "Income")
        .reduce((total, transaction) => total + transaction.amount, 0),
    [monthTransactions],
  );

  const totalIncomeThisMonth = useMemo(
    () =>
      monthTransactions
        .filter((transaction) => transaction.category === "Income")
        .reduce((total, transaction) => total + transaction.amount, 0),
    [monthTransactions],
  );

  const overallBudget = useMemo(
    () =>
      budgets
        .filter((budget) => budget.category !== "Income")
        .reduce((total, budget) => total + budget.amount, 0),
    [budgets],
  );

  const remainingBudgetOverall = overallBudget - totalSpentThisMonth;

  return {
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
  };
}
