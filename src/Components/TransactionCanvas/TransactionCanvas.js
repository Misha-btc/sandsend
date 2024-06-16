import React from 'react';
import SelectedUtxos from './SelectedUtxos';

function TransactionCanvas() {
    return (
        <div className="mt-3 mb-1 flex h-full overflow-auto">
            <div className="w-1/2 h-full bg-gray-200">
                <SelectedUtxos />
            </div>
            <div className="w-1/2 h-full bg-neutral-900">
                
            </div>
        </div>
    );
}

export default TransactionCanvas;