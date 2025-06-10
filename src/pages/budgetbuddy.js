'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AddTransaction from '../components/AddTransaction';
import TransactionList from '../components/TransactionList';
import SummaryCard from '../components/SummaryCard';
import BalanceChart from '../components/BalanceChart';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
      applyFilters();
    }
  }, [transactions, mounted, search, filterType]);

  const applyFilters = () => {
    let result = transactions;
    if (filterType !== 'All') {
      result = result.filter((t) => t.type === filterType);
    }
    if (search.trim()) {
      result = result.filter((t) => t.description.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredTransactions(result);
  };

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions([...transactions, newTransaction]);
    toast.success('Transaction added!');
  };

  const deleteTransaction = (id) => {
    try {
      setTransactions(transactions.filter((t) => t.id !== id));
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = 'Date,Description,Amount,Type\n';
    const rows = transactions.map(t => `${t.date},${t.description},${t.amount},${t.type}`).join('\n');
    const csv = headers + rows;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Transaction Report', 20, 20);

    let y = 30;
    filteredTransactions.forEach((t, index) => {
      doc.text(`${index + 1}. ${t.date} - ${t.title} - Rs${t.amount} - ${t.type}`, 20, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('transactions_report.pdf');
  };

  const budgetingTips = [
    "Pay yourself first – put savings before spending.",
    "Use cash instead of cards to control expenses.",
    "Set savings goals and track them monthly.",
    "Cut down on subscriptions you rarely use.",
    "Automate bill payments to avoid late fees."
  ];
  const randomTip = budgetingTips[Math.floor(Math.random() * budgetingTips.length)];

  if (!mounted) return null;

  const totalIncome = filteredTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const largestIncome = Math.max(0, ...filteredTransactions.filter(t => t.type === 'Income').map(t => t.amount));
  const largestExpense = Math.max(...transactions.filter(t => t.type === 'Expense').map(t => Math.abs(t.amount)), 0);

  return (
    <>
      <Head>
        <title>Budget Buddy</title>
      </Head>
      <Toaster />
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4">💰 Budget Buddy</h1>

          <section id="summary">
            <SummaryCard transactions={filteredTransactions} />
          </section>

          <section id="add-transaction" className="scroll-mt-20">
            <AddTransaction onAdd={addTransaction} />
          </section>

          <section id="chart" className="scroll-mt-20">
            <BalanceChart transactions={filteredTransactions} />
          </section>

          <section id="transaction-list" className="scroll-mt-20">
            <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
          </section>

          <section id="analytics" className="mt-8 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-2">📊 Quick Analytics</h2>
            <p>Total Transactions: {filteredTransactions.length}</p>
            <p>Total Income: Rs {totalIncome}</p>
            <p>Total Expenses: Rs {totalExpense}</p>
            <p>Net Balance: Rs {netBalance}</p>
            <p>Largest Income: Rs {largestIncome}</p>
            <p>Largest Expense: Rs {largestExpense}</p>
          </section>

          <section id="export" className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-2">🧾 Export</h2>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={downloadJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                Download JSON
              </button>
              <button
                onClick={downloadCSV}
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition"
              >
                Download CSV
              </button>
              <button
                onClick={downloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
              >
                Download PDF
              </button>
            </div>
          </section>

          <section id="tips" className="mt-6 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-2">💡 Budgeting Tips</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Track all your expenses regularly.</li>
              <li>Set a monthly budget goal.</li>
              <li>Use the 50/30/20 rule: Needs/Wants/Savings.</li>
              <li>Review your spending weekly.</li>
              <li>Avoid impulse purchases.</li>
            </ul>
            <p className="italic text-sm text-green-600 mt-2">✨ Tip of the Day: {randomTip}</p>
          </section>
        </div>
      </main>
    </>
  );
}
