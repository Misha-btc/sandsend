import React from 'react';

const FeeInput = ({ input, index }) => {
  return (
    <div className="bg-gradient-to-r from-zinc-800 to-zinc-950 rounded-lg shadow-md mb-4 relative border-2 text-center border-zinc-100 w-40">
      <h2 className="text-zinc-100 font-bold text-lg">
        fee
      </h2>
      <p className="text-zinc-100 font-bold text-sm">
        {input.value} sats
      </p>
    </div>
  );
};

export default FeeInput;