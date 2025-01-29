import React from 'react';

export const Button = ({ children, variant = 'default', size = 'base', className = '', ...props }) => {
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };

  const sizes = {
    base: 'px-4 py-2 text-sm',
    icon: 'p-2',
  };

  return (
    <button
      className={`rounded ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
