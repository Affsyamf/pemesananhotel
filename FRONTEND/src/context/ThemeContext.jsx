// frontend/src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Ambil tema dari localStorage atau default ke 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement; // Ini adalah tag <html>
    
    // Hapus class lama dan tambahkan class baru
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Simpan pilihan tema di localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Custom hook untuk mempermudah penggunaan context
export const useTheme = () => {
  return useContext(ThemeContext);
};