import { CATEGORIES, type Category, type CategoryBudget as Budget } from "../hooks/useBudget";

type CategoryBudgetProps = {
  budgets: Budget[];
  onSetBudget: (category: Category, amount: number) => Promise<void>;
};

export function CategoryBudget({ budgets, onSetBudget }: CategoryBudgetProps) {
  return (
    <section className="surface p-5">
      <h2 className="text-lg font-semibold text-slate-100">Monthly budgets</h2>
      <div className="mt-4 space-y-3">
        {CATEGORIES.filter((category) => category !== "Income").map((category) => {
          const value = budgets.find((budget) => budget.category === category)?.amount ?? 0;

          return (
            <label key={category} className="grid grid-cols-[1fr_140px] items-center gap-3">
              <span className="text-sm font-medium text-slate-300">{category}</span>
              <input
                min="0"
                step="1"
                type="number"
                value={value}
                onChange={(event) => onSetBudget(category, Number(event.target.value))}
                className="input-field text-right"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
