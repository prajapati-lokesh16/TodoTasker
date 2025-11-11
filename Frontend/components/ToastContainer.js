"use client"
import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts = [], removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;
