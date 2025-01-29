import React from 'react';

export const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => {
  return <div className="border-b pb-2 mb-4">{children}</div>;
};

export const DialogTitle = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

export const DialogContent = ({ children }) => {
  return <div>{children}</div>;
};
