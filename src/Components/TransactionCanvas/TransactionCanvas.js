import React from 'react';
import SelectedUtxos from './SelectedUtxos';
import OutputsSpace from './OutputsSpace';
import Lines from './Lines';

function TransactionCanvas() {
    return (
        <div className="mt-3 mb-1 flex h-full overflow-auto">
            <Lines />
            <div className="w-1/2 h-full bg-zinc-900">
                <SelectedUtxos />
            </div>
            <div className="w-1/2 h-full bg-zinc-900">
                <OutputsSpace />
            </div>
        </div>
    );
}

export default TransactionCanvas;