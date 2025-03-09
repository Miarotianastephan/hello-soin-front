// src/components/TimeInput.jsx
import React from 'react';

const TimeInput = ({ value, onChange, onBlur, hasError }) => (
  <input
    type="time"
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    className={`border p-2 rounded ${hasError ? 'border-red-500' : 'border-gray-300'}`}
  />
);

export default TimeInput;
