import type { Category } from "../hooks/useBudget";

type CategoryProgress = {
  category: Category;
  spent: number;
  budget: number;
};

type AssistantWidgetProps = {
  overallBudget: number;
  remainingBudgetOverall: number;
  spendingByCategory: CategoryProgress[];
  onQuickAdd: (data: { amount: number; category: Category; description: string }) => void;
  onJumpToCurrentMonth: () => void;
  onClearMonth: () => void;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function AssistantWidget({
  overallBudget,
  remainingBudgetOverall,
  spendingByCategory,
  onQuickAdd,
  onJumpToCurrentMonth,
  onClearMonth,
}: AssistantWidgetProps) {
  const overBudget = spendingByCategory
    .filter((item) => item.category !== "Income" && item.budget > 0 && item.spent > item.budget)
    .sort((a, b) => b.spent / b.budget - a.spent / a.budget)
    .slice(0, 2);

  const lowRunway = overallBudget > 0 && remainingBudgetOverall / overallBudget < 0.2;

  return (
    <section className="surface glow-border p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Budget assistant
          </p>
          <h3 className="font-display mt-2 text-lg text-slate-100">Focus alerts</h3>
          <p className="mt-1 text-sm text-slate-400">
            Quick signals and shortcuts to keep you on track.
          </p>
        </div>
        <span className="pulse-dot" />
      </div>

      <div className="mt-4 space-y-3">
        {remainingBudgetOverall < 0 ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            You are {currency.format(Math.abs(remainingBudgetOverall))} over budget this month.
          </div>
        ) : lowRunway ? (
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
            Less than 20% of your budget remains. Consider slowing spend.
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
            Budget runway looks solid. Keep the pace.
          </div>
        )}

        {overBudget.length > 0 ? (
          <div className="rounded-xl border border-slate-700/80 bg-slate-900/60 p-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Over budget</p>
            <div className="mt-2 space-y-1">
              {overBudget.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-slate-200">{item.category}</span>
                  <span className="text-rose-300">
                    {currency.format(item.spent - item.budget)} over
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-700/80 bg-slate-900/60 p-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">No overspend</p>
            <p className="mt-2">All categories are within their limits.</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Quick actions
        </p>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            className="mini-button"
            onClick={() =>
              onQuickAdd({ amount: 250, category: "Income", description: "Quick deposit" })
            }
          >
            Add $250 income
          </button>
          <button
            type="button"
            className="mini-button"
            onClick={() =>
              onQuickAdd({ amount: 45, category: "Food", description: "Quick meal" })
            }
          >
            Log $45 food spend
          </button>
          <button type="button" className="mini-ghost" onClick={onJumpToCurrentMonth}>
            Jump to current month
          </button>
          <button type="button" className="mini-danger" onClick={onClearMonth}>
            Clear this month
          </button>
        </div>
      </div>
    </section>
  );
}
