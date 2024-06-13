import React from 'react';

const Button = ({ onClick, title }) => {
  return (
    <button
      onClick={onClick}
      className='font-bold bg-black text-white p-2 hover:bg-zinc-900 relative z-10'
    >
      {title}
    </button>
  );
};

export default Button; 