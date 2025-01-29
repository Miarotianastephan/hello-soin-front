import React from 'react';

export const Label = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="block mb-2 text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};
