'use client';

import { SelectHTMLAttributes, forwardRef, useEffect, useState } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
      // Get current theme from document
      const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      setTheme(currentTheme);

      // Watch for theme changes
      const observer = new MutationObserver(() => {
        const newTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
        setTheme(newTheme);
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      return () => observer.disconnect();
    }, []);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 appearance-none cursor-pointer ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
            style={{ colorScheme: theme }}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-surface text-foreground">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
