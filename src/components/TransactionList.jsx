import { useState, useMemo } from 'react';
import { FiTrash } from 'react-icons/fi';
import { format } from 'date-fns';

export default function TransactionList({ transactions, onDelete }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const categories = [...new Set(transactions.map(t => t.category))];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t =>
      (t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterType ? t.type === filterType : true) &&
      (filterCategory ? t.category === filterCategory : true)
    );
  }, [transactions, searchQuery, filterType, filterCategory]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Transactions</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <input
          type="text"
          placeholder="🔍 Search by title, type, or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
      )}

      <ul className="space-y-2">
        {filteredTransactions.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center border-b pb-1 border-gray-200 dark:border-gray-700"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{t.title}</p>
              <small className="text-gray-500 dark:text-gray-400">
                {t.category} - {format(new Date(t.date), 'dd MMM yyyy')}
              </small>
            </div>
            <div className="flex items-center gap-2">
              
              <span className={`font-semibold ${t.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
              {t.type === 'Income' ? '+' : '-'}RS{Math.abs(t.amount)}
              </span>

              <FiTrash
                onClick={() => onDelete(t.id)}
                className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-red-600"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
