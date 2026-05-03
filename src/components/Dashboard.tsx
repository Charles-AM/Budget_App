import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import type { Category, Transaction } from "../hooks/useBudget";

type CategoryProgress = {
  category: Category;
  spent: number;
  budget: number;
};

type DashboardProps = {
  overallBudget: number;
  recentTransactions: Transaction[];
  remainingBudgetOverall: number;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  spendingByCategory: CategoryProgress[];
  totalIncomeThisMonth: number;
  totalSpentThisMonth: number;
};

const colors = ["#38bdf8", "#60a5fa", "#818cf8", "#22d3ee", "#0ea5e9", "#1d4ed8"];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/95 px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-slate-100">{payload[0].name}</p>
      <p className="text-slate-400">{currency.format(payload[0].value ?? 0)}</p>
    </div>
  );
}

export function Dashboard({
  overallBudget,
  recentTransactions,
  remainingBudgetOverall,
  selectedMonth,
  setSelectedMonth,
  spendingByCategory,
  totalIncomeThisMonth,
  totalSpentThisMonth,
}: DashboardProps) {
  const spentPercent = overallBudget > 0 ? Math.min((totalSpentThisMonth / overallBudget) * 100, 100) : 0;
  const budgetHealth = spentPercent < 70 ? "Healthy" : spentPercent < 90 ? "Watchlist" : "At risk";
  const budgetHealthTone =
    spentPercent < 70 ? "text-emerald-300" : spentPercent < 90 ? "text-amber-300" : "text-rose-300";
  const chartData = spendingByCategory
    .filter((item) => item.category !== "Income" && item.spent > 0)
    .map((item) => ({ name: item.category, value: item.spent }));

  return (
    <section className="space-y-5">
      <div className="surface section-header glow-border flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Budget control center
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold text-slate-100">
            Personal Budget
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track spending, budgets, and income locally.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">Live insights</span>
            <span className="chip">Smart category view</span>
            <span className="chip">Instant edit</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span className="pulse-dot" />
            Live tracking
          </div>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-slate-300">Month</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="input-field"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-sm font-medium text-slate-400">Spent this month</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">
            {currency.format(totalSpentThisMonth)}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-medium text-slate-400">Remaining budget</p>
          <p
            className={`mt-2 text-3xl font-bold ${
              remainingBudgetOverall >= 0 ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {currency.format(remainingBudgetOverall)}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            of {currency.format(overallBudget)} planned
          </p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-medium text-slate-400">Income this month</p>
          <p className="mt-2 text-3xl font-bold text-sky-300">
            {currency.format(totalIncomeThisMonth)}
          </p>
        </div>
      </div>

      <div className="surface flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Budget health</p>
          <p className={`font-display mt-2 text-2xl ${budgetHealthTone}`}>{budgetHealth}</p>
          <p className="mt-1 text-sm text-slate-400">
            {Math.round(spentPercent)}% of plan spent this month
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#38bdf8 ${spentPercent}%, rgba(30,41,59,0.6) 0)`,
              }}
            />
            <div className="absolute inset-2 rounded-full bg-slate-900" />
            <span className="relative text-sm font-semibold text-slate-100">
              {Math.round(spentPercent)}%
            </span>
          </div>
          <div className="space-y-1 text-sm text-slate-300">
            <p>Plan: {currency.format(overallBudget)}</p>
            <p>Spent: {currency.format(totalSpentThisMonth)}</p>
            <p>Left: {currency.format(remainingBudgetOverall)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface p-5">
          <h2 className="text-lg font-semibold text-slate-100">Category progress</h2>
          <div className="mt-5 space-y-4">
            {spendingByCategory
              .filter((item) => item.category !== "Income")
              .map((item) => {
                const percent = item.budget > 0 ? Math.min((item.spent / item.budget) * 100, 100) : 0;
                const isOverBudget = item.budget > 0 && item.spent > item.budget;

                return (
                  <div key={item.category}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-200">{item.category}</span>
                      <span
                        className={
                          isOverBudget ? "font-semibold text-rose-300" : "text-slate-400"
                        }
                      >
                        {currency.format(item.spent)} / {currency.format(item.budget)}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${
                          isOverBudget ? "bg-rose-500" : "bg-sky-500"
                        } transition-[width] duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="surface-strong p-5">
          <h2 className="text-lg font-semibold text-slate-100">Spending by category</h2>
          <div className="mt-4 h-72">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-2xl bg-slate-900 text-sm text-slate-400">
                Add expenses to see the chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={3}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {chartData.map((item, index) => (
              <span key={item.name} className="flex items-center gap-2 text-sm text-slate-300">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="surface p-5">
        <h2 className="text-lg font-semibold text-slate-100">Recent transactions</h2>
        <div className="mt-4 divide-y divide-slate-800">
          {recentTransactions.length === 0 ? (
            <p className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-400">
              No recent transactions yet.
            </p>
          ) : (
            recentTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-slate-100">{transaction.description}</p>
                  <p className="text-sm text-slate-400">
                    {transaction.category} · {transaction.date}
                  </p>
                </div>
                <p
                  className={`font-semibold ${
                    transaction.category === "Income" ? "text-emerald-300" : "text-slate-100"
                  }`}
                >
                  {transaction.category === "Income" ? "+" : "-"}
                  {currency.format(transaction.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
