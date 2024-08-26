import React from 'react';

const InputElement = ({ input, index, removeInput }) => {
  return (
    <div className="bg-zinc-800 p-4 rounded-lg shadow-md mb-4 relative border-2 border-orange-600">
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
