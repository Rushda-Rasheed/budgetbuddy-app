'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SummaryCard({ transactions }) {
  let income = 0,
    expense = 0;

  try {
    income = transactions
      .filter((t) => t.type === 'Income')
      .reduce((acc, cur) => acc + cur.amount, 0);

    expense = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((acc, cur) => acc + Math.abs(cur.amount), 0);
  } catch (error) {
    toast.error('Error calculating summary values');
    console.error(error);
  }

  const balance = income - expense;

  useEffect(() => {
    if (balance < 0) {
      toast.error('⚠️ Your expenses exceed your income. Please control your budget.');
    }
  }, [balance]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-4 grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
        <p className="text-green-600 font-bold text-lg">Rs {income}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Expense</p>
        <p className="text-red-500 font-bold text-lg">Rs {expense}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
        <p className={`font-bold text-lg ${balance < 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
          Rs {balance}
        </p>
      </div>
    </div>
  );
}
