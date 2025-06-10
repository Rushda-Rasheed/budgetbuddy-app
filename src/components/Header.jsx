'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from 'react-icons/fi';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const localDark = localStorage.getItem('darkMode');
    if (localDark) setDarkMode(localDark === 'true');
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  if (!mounted) return null;

  // Section anchors for internal navigation
  const sections = [
    { href: '#summary', label: 'Summary' },
    { href: '#add-transaction', label: 'Add Transaction' },
    { href: '#chart', label: 'Chart' },
    { href: '#transaction-list', label: 'Transactions' },
    { href: '#analytics', label: 'Analytics' },
    { href: '#export', label: 'Export' },
    { href: '#tips', label: 'Tips' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 dark:text-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="Logo" width={44} height={44} className="rounded-full shadow-sm" />
        <h1 className="text-2xl font-extrabold tracking-tight">BudgetBuddy by Rushda</h1>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6 items-center">
        {sections.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {label}
          </a>
        ))}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 text-xl text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </nav>

      {/* Mobile Toggle */}
      <button
        className="md:hidden text-2xl text-gray-700 dark:text-gray-300"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-4 flex flex-col gap-4 w-56 md:hidden">
          {sections.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setMenuOpen(false);
            }}
            className="mt-2 text-xl text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      )}
    </header>
  );
}

