import React from 'react';
import SelectedUtxos from './SelectedUtxos';
import OutputsSpace from './OutputsSpace';

function TransactionCanvas() {
    return (
        <div className="mt-3 mb-1 flex h-full overflow-auto">
            <div className="w-1/2 h-full bg-gray-200">
                <SelectedUtxos />
            </div>
            <div className="w-1/2 h-full bg-neutral-900">
                <OutputsSpace />
            </div>
        </div>
    );
}

export default TransactionCanvas;