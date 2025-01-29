import React from 'react';

export const Input = React.forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
      {...props}
    />
  );
});

Input.displayName = 'Input';
