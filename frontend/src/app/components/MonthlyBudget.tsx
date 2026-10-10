import { useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import { CircularProgress } from './CircularProgress';

interface MonthlyBudgetProps {
  budget: number;
  onBudgetChange: (budget: number) => void;
  todaySpent: number;
  weekSpent: number;
  monthSpent: number;
}

export function MonthlyBudget({
  budget,
  onBudgetChange,
  todaySpent,
  weekSpent,
  monthSpent,
}: MonthlyBudgetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(budget.toString());

  const handleSave = () => {
    const newBudget = parseFloat(editValue);
    if (!isNaN(newBudget) && newBudget > 0) {
      onBudgetChange(newBudget);
    }
    setIsEditing(false);
  };

  const remaining = budget - monthSpent;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Amount
        </label>
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter budget"
            />
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
            <span className="text-lg font-semibold">₹{budget.toFixed(2)}</span>
            <button
              onClick={() => {
                setEditValue(budget.toString());
                setIsEditing(true);
              }}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Edit2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Remaining</span>
          <span
            className={`text-lg font-semibold ${
              remaining >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ₹{remaining.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Spending Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <CircularProgress
            percentage={(todaySpent / budget) * 100}
            spent={todaySpent}
            budget={budget}
            label="Today"
          />
          <CircularProgress
            percentage={(weekSpent / budget) * 100}
            spent={weekSpent}
            budget={budget}
            label="This Week"
          />
          <CircularProgress
            percentage={(monthSpent / budget) * 100}
            spent={monthSpent}
            budget={budget}
            label="This Month"
          />
        </div>
      </div>
    </div>
  );
}
