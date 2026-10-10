import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Calendar as CalendarIcon } from 'lucide-react';
import { AddExpense } from './components/AddExpense';
import { RecentExpenses, type Expense } from './components/RecentExpenses';
import { MonthlyBudget } from './components/MonthlyBudget';
import { Chatbot } from './components/Chatbot';
import { Calendar } from './components/Calendar';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';

interface ApiExpense {
  id: number;
  name: string;
  amount: number;
  notes?: string;
  createdAt: string;
}

const API_BASE = 'http://localhost:8080/api/expenses';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState(20000);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const loadExpenses = async () => {
    const response = await fetch(API_BASE);
    const data: ApiExpense[] = await response.json();
    setExpenses(
      data.map((exp) => ({
        id: exp.id,
        name: exp.name,
        amount: Number(exp.amount),
        notes: exp.notes ?? '',
        date: new Date(exp.createdAt),
      })),
    );
  };

  useEffect(() => {
    void loadExpenses();
  }, []);

  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newExpense.name,
        amount: newExpense.amount,
        notes: newExpense.notes,
      }),
    });
    const saved: ApiExpense = await response.json();
    setExpenses((prev) => [
      {
        id: saved.id,
        name: saved.name,
        amount: Number(saved.amount),
        notes: saved.notes ?? '',
        date: new Date(saved.createdAt),
      },
      ...prev,
    ]);
  };

  const handleDeleteExpense = async (id: number) => {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const { todaySpent, weekSpent, monthSpent } = useMemo(() => {
    const today = expenses.filter((exp) => isToday(exp.date)).reduce((sum, exp) => sum + exp.amount, 0);
    const week = expenses
      .filter((exp) => isThisWeek(exp.date, { weekStartsOn: 0 }))
      .reduce((sum, exp) => sum + exp.amount, 0);
    const month = expenses.filter((exp) => isThisMonth(exp.date)).reduce((sum, exp) => sum + exp.amount, 0);
    return { todaySpent: today, weekSpent: week, monthSpent: month };
  }, [expenses]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600 mt-1">Track and manage your daily expenses</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AddExpense onAddExpense={handleAddExpense} />
            <RecentExpenses expenses={expenses} onDeleteExpense={handleDeleteExpense} />
          </div>

          <div className="space-y-6">
            <MonthlyBudget
              budget={budget}
              onBudgetChange={setBudget}
              todaySpent={todaySpent}
              weekSpent={weekSpent}
              monthSpent={monthSpent}
            />
            <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => setIsCalendarOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          title="Open Calendar"
        >
          <CalendarIcon size={24} />
        </button>
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Open Chatbot"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      <Calendar isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} expenses={expenses} />
    </div>
  );
}
