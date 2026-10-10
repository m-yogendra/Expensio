import { useState, useMemo } from "react";
import { Search, Trash2 } from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameWeek,
  isSameMonth,
} from "date-fns";

export interface Expense {
  id: number;
  name: string;
  amount: number;
  date: Date;
  notes?: string;
}

interface RecentExpensesProps {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
}

export function RecentExpenses({
  expenses,
  onDeleteExpense,
}: RecentExpensesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState<"month" | "week">(
    "month",
  );

  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        expense.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        expense.notes
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [expenses, searchTerm]);

  const groupedExpenses = useMemo(() => {
    const groups: { [key: string]: Expense[] } = {};

    filteredExpenses.forEach((expense) => {
      let key: string;
      if (groupBy === "month") {
        key = format(expense.date, "MMMM yyyy");
      } else {
        const weekStart = startOfWeek(expense.date);
        const weekEnd = endOfWeek(expense.date);
        key = `${format(weekStart, "MMM dd")} - ${format(weekEnd, "MMM dd, yyyy")}`;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(expense);
    });

    return groups;
  }, [filteredExpenses, groupBy]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        Recent Expenses
      </h2>

      <div className="mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search expenses..."
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setGroupBy("month")}
          className={`px-4 py-2 rounded-md transition-colors ${
            groupBy === "month"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          By Month
        </button>
        <button
          onClick={() => setGroupBy("week")}
          className={`px-4 py-2 rounded-md transition-colors ${
            groupBy === "week"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          By Week
        </button>
      </div>

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
        {Object.entries(groupedExpenses).map(
          ([period, periodExpenses]) => (
            <div key={period}>
              <h3 className="font-semibold text-gray-700 mb-3 sticky top-0 bg-white py-1">
                {period}
              </h3>
              <div className="space-y-2">
                {periodExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">
                          {expense.name}
                        </h4>
                        <span className="font-semibold text-blue-600">
                          ₹{expense.amount.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(
                          expense.date,
                          "MMM dd, yyyy • hh:mm a",
                        )}
                      </p>
                      {expense.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {expense.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        onDeleteExpense(expense.id)
                      }
                      className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
        {Object.keys(groupedExpenses).length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No expenses found
          </p>
        )}
      </div>
    </div>
  );
}
