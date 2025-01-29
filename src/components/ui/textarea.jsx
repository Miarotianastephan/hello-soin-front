import React from 'react';

export const Textarea = React.forwardRef((props, ref) => {
  return (
    <textarea
      ref={ref}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
