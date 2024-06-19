import React from 'react';

const Button = ({ onClick, title, className }) => {
  return (
    <button
      onClick={onClick}
      className={`font-bold ${className}`}
    >
      {title}
    </button>
  );
};

export default Button;