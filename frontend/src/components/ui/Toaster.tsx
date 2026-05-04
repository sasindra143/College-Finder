'use client';

import { useState, useEffect } from 'react';
import styles from './Toaster.module.css';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let listeners: ((t: Toast) => void)[] = [];

// 🔹 Toast trigger functions
export const toast = {
  success: (message: string) =>
    emit({
      id: generateId(),
      message,
      type: 'success',
    }),

  error: (message: string) =>
    emit({
      id: generateId(),
      message,
      type: 'error',
    }),

  info: (message: string) =>
    emit({
      id: generateId(),
      message,
      type: 'info',
    }),
};

// 🔹 Emit toast
function emit(t: Toast) {
  listeners.forEach((l) => l(t));
}

// 🔹 Generate unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now();
}

// 🔹 Toaster Component
export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts((prev) => [...prev, t]);

      // auto remove after 3.5s
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3500);
    };

    listeners.push(handler);

    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toasterContainer}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${styles.toast} ${
            t.type === 'success'
              ? styles.success
              : t.type === 'error'
              ? styles.error
              : styles.info
          }`}
        >
          <span className={styles.icon}>
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}