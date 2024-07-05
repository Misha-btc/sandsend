import React from 'react';
import SelectedUtxos from './SelectedUtxos';

function TransactionCanvas() {
  console.log('Rendering TransactionCanvas component'); // Debugging

  return (
    <div className="w-full min-h-screen h-full bg-zinc-900 relative">
      <div className="w-full h-full min-h-screen overflow-y-auto bg-zinc-900 p-20">
        <SelectedUtxos />
      </div>
    </div>
  );
}

export default TransactionCanvas;