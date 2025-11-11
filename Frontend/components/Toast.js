"use client"
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600';

  return (
    <div className={`flex items-center justify-between ${bgColor} text-white px-3 py-2 rounded shadow-lg min-w-[220px]`}>
      <div className="text-sm truncate">{message}</div>
      <button aria-label="close" onClick={onClose} className="ml-3 font-bold">×</button>
    </div>
  );
};

export default Toast;
