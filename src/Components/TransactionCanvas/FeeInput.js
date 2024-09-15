import React from 'react';

const FeeInput = ({ input, index }) => {
  return (
    <div className="bg-zinc-300 rounded-lg shadow-md mb-4 relative border-2 text-center border-orange-600 w-40">
      <h2 className="text-zinc-500 font-bold text-lg">
        Fee
      </h2>
      <p className="text-zinc-500 font-bold text-sm">
        {input.value} sats
      </p>
    </div>
  );
};

export default FeeInput;