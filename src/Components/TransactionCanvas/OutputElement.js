import React from 'react';

const OutputElement = ({ output, index, removeOutput }) => {
  return (
    <div className="bg-zinc-800 p-4 rounded-lg shadow-md mb-4 relative border-2 border-orange-600">
      <button
        onClick={() => removeOutput(index)}
        className="absolute top-2 right-2 text-gray-500 hover:text-white"
      >
        ✕
      </button>
      <p className="text-white mb-2">Адрес: {output.address}</p>
      <p className="text-white">
        Сумма: {output.amount} {output.satsFormat}
      </p>
    </div>
  );
};

export default OutputElement;
