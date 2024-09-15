import React from 'react';

const InputElement = ({ input, index, removeInput }) => {
  return (
    <div className="bg-gradient-to-r from-zinc-800 to-zinc-950 p-4 rounded-lg shadow-md mb-4 relative border-2 text-center border-orange-600 w-40">
      <button
        onClick={() => removeInput(index)}
        className="absolute top-2 right-2 text-gray-500 hover:text-white"
      >
        ✕
      </button>
      <p className="text-white p-2">
        {input.value} sats
      </p>
    </div>
  );
};

export default InputElement;
