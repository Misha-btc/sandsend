import React from 'react';

const ChangeOutput = ({ changeOutput, title }) => {
  return (
    <div className="bg-zinc-400 rounded-lg shadow-md mb-4 mt-4 relative border-2 text-center border-red-800 w-60">
      <h2 className="text-red-700 font-bold text-lg">
        {title}
      </h2>
      <p className="text-red-700 font-bold text-sm">
        {changeOutput} sats
      </p>
    </div>
  );
};

export default ChangeOutput;