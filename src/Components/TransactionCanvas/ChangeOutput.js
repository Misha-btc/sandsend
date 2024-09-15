import React from 'react';

const ChangeOutput = ({ changeOutput, title }) => {
  return (
    <div className="bg-orange-600 rounded-lg shadow-md mb-4 mt-4 relative border-2 text-center border-zinc-300 w-60">
      <h2 className="text-zinc-300 font-bold text-lg">
        {title}
      </h2>
      <p className="text-zinc-300 font-bold text-sm">
        {changeOutput} sats
      </p>
    </div>
  );
};

export default ChangeOutput;