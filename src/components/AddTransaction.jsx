'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AddTransaction({ onAdd }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Expense');
  const [category, setCategory] = useState('Food');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'Food', 'Rent', 'Shopping', 'Travel', 'Job', 'Other'
  ];

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount || !date) {
      setError('Please fill in all required fields.');
      return;
    }

    const selectedCategory = category === 'Other' ? customCategory.trim() : category;

    if (category === 'Other' && !customCategory.trim()) {
      setError('Please enter a custom category.');
      return;
    }

    try {
      const transactionAmount =
        type === 'Expense' ? -Math.abs(+amount) : +Math.abs(+amount);

      onAdd({ title, amount: transactionAmount, type, category: selectedCategory, date });

      toast.success('Transaction added successfully!');
      setError('');
      setTitle('');
      setAmount('');
      setCategory('Food');
      setCustomCategory('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="add-transaction"
      className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-4 space-y-3"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Add Transaction
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium dark:text-gray-300">
            Title
          </label>
          <input
            id="title"
            autoFocus
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="amount" className="text-sm font-medium dark:text-gray-300">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="type" className="text-sm font-medium dark:text-gray-300">
            Type
          </label>
          <select
            id="type"
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Income</option>
            <option>Expense</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="text-sm font-medium dark:text-gray-300">
            Category
          </label>
          <select
            id="category"
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Show text input if "Other" is selected */}
          {category === 'Other' && (
            <input
              type="text"
              className="mt-2 w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="date" className="text-sm font-medium dark:text-gray-300">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <button
        className="w-full bg-blue-500 dark:bg-blue-600 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-all mt-2"
        type="submit"
      >
        Add
      </button>
    </form>
  );
}
