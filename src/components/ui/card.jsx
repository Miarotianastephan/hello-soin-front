import React from 'react';

export const Card = ({ children, className }) => {
  return <div className={`rounded-lg shadow-md p-4 bg-white ${className}`}>{children}</div>;
};

export const CardHeader = ({ children, className }) => {
  return <div className={`border-b pb-2 mb-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className }) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
};

export const CardContent = ({ children, className }) => {
  return <div className={`text-gray-700 ${className}`}>{children}</div>;
};
