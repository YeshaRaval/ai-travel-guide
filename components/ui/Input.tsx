'use client';

import { InputHTMLAttributes, forwardRef, useEffect, useState, useRef, useImperativeHandle } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', type, ...props }, ref) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose the input ref to parent components
    useImperativeHandle(ref, () => inputRef.current!);

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

    const handleContainerClick = () => {
      if (type === 'date' && inputRef.current) {
        inputRef.current.showPicker?.();
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div
          className="relative cursor-pointer"
          onClick={handleContainerClick}
        >
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none z-10">
              {icon}
            </div>
          )}
          <input
            ref={inputRef}
            type={type}
            className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 cursor-pointer ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
            style={{ colorScheme: theme }}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
