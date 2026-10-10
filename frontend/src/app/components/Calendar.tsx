import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import type { Expense } from './RecentExpenses';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export function Calendar({ isOpen, onClose, expenses }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getExpensesForDay = (day: Date) => {
    return expenses.filter((expense) => isSameDay(expense.date, day));
  };

  const getTotalForDay = (day: Date) => {
    const dayExpenses = getExpensesForDay(day);
    return dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const isCurrentMonthView = isSameMonth(currentMonth, today);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={goToPreviousMonth}
                  className="hover:bg-blue-700 rounded-full p-2 transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft size={24} />
                </button>
                <h3 className="text-xl font-semibold min-w-[200px] text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  onClick={goToNextMonth}
                  className="hover:bg-blue-700 rounded-full p-2 transition-colors"
                  title="Next Month"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-blue-700 rounded-full p-1 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold text-gray-700 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const dayExpenses = getExpensesForDay(day);
                  const total = getTotalForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isToday = isSameDay(day, today);

                  return (
                    <div
                      key={idx}
                      className={`min-h-24 p-2 border rounded-lg ${
                        !isCurrentMonth
                          ? 'bg-gray-50 text-gray-400'
                          : isToday
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`text-sm font-medium ${
                            isToday ? 'text-blue-600 font-semibold' : ''
                          }`}
                        >
                          {format(day, 'd')}
                        </span>
                        {dayExpenses.length > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                            {dayExpenses.length}
                          </span>
                        )}
                      </div>
                      {total > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-700">
                            ₹{total.toFixed(0)}
                          </div>
                          <div className="space-y-0.5 max-h-16 overflow-y-auto">
                            {dayExpenses.slice(0, 3).map((expense) => (
                              <div
                                key={expense.id}
                                className="text-xs text-gray-600 truncate"
                                title={`${expense.name} - ₹${expense.amount}`}
                              >
                                {expense.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
