import React from 'react';

export const RadioGroup = ({ children, value, onValueChange, className }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { checked: child.props.value === value, onChange: () => onValueChange(child.props.value) })
      )}
    </div>
  );
};

export const RadioGroupItem = ({ value, checked, onChange, id, className }) => {
  return (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className={`form-radio ${className}`}
      />
      <span>{value}</span>
    </label>
  );
};
