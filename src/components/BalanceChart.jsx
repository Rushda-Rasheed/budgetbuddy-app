import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

const COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa'];

export default function BalanceChart({ transactions }) {
  const [data, setData] = useState([]);


  useEffect(() => {
  const expenseData = transactions
    .filter(t => t.type === 'Expense' && t.category && !isNaN(t.amount))
    .reduce((acc, curr) => {
      const found = acc.find(item => item.name === curr.category);
      const amt = Math.abs(Number(curr.amount));
      if (found) {
        found.value += amt;
      } else {
        acc.push({ name: curr.category, value: amt });
      }
      return acc;
    }, []);
  setData(expenseData);
}, [transactions]);


  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Expenses by Category</h2>

      {data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No expense data available to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`₹${value}`, name]}
              contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff' }}
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}

      {data.length > 0 && (
        <p className="text-center mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Total Expenses: RS: {total}
        </p>
      )}
    </div>
  );
}
