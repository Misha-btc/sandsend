import React, { useState, useEffect } from 'react';
import useFetchUtxos from '../Hooks/useFetchUtxos';
import AddressButton from './AddressButton';
import { useTransaction } from '../Contexts/TransactionContext';
import { useWallet } from '../Contexts/WalletContext';

function YourUtxo() {
    const { loading, transactionDetails, fetchAllData, setTransactionDetails } = useFetchUtxos();
    const { isConnected } = useWallet();
    const { updateInput, removeInput, input } = useTransaction();
    
    const [addressPurpose, setAddressPurpose] = useState('');

    useEffect(() => {
        const storedDetails = localStorage.getItem('transactionDetails');
        if (storedDetails) {
            try {
                const parsedDetails = JSON.parse(storedDetails);
                if (typeof parsedDetails === 'object' && parsedDetails !== null) {
                    setTransactionDetails(parsedDetails);
                }
            } catch (error) {
                console.error('Error parsing stored transaction details:', error);
            }
        } else if (isConnected) {
            fetchAllData();
        }
    }, [isConnected, fetchAllData, setTransactionDetails]);

    useEffect(() => {
        const addressType = Object.keys(transactionDetails);
        if (addressType.length > 0 && !addressPurpose) {
            setAddressPurpose(addressType[0]);
        }
    }, [transactionDetails, addressPurpose]);

    const isSelected = (key) => {
        return input.some(input => input.key === key);
    };

    const handleUtxoClick = (key, detail) => {
        const [txid, vout] = key.split(':');
        if (isSelected(key)) {
            removeInput(key);
        } else {
            updateInput({ ...detail, txid, vout, key });
        }
    };

    const filteredTransactionDetails = transactionDetails[addressPurpose] || {};
    const [, type] = addressPurpose !== '' ? addressPurpose.split(':') : ['', ''];

    const sortedTransactionDetails = Object.entries(filteredTransactionDetails)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const toggleAddressPurpose = () => {
        const purposes = Object.keys(transactionDetails);
        const currentIndex = purposes.indexOf(addressPurpose);
        const nextIndex = (currentIndex + 1) % purposes.length;
        setAddressPurpose(purposes[nextIndex]);
    };

    const handleRefresh = () => {
        if (isConnected) {
            fetchAllData();
        }
    };

    return (
        <div>
            <div className='flex items-center border-b p-2 bg-black text-white sticky top-0 z-10 font-black text-xl'>
                <button 
                    onClick={handleRefresh} 
                    className="mr-2 px-2 py-1 bg-orange-600 text-white rounded text-xs"
                    title="Refresh UTXOs"
                >
                    ↻
                </button>
                <div className='w-full text-center'>my UTXOs</div>
                <AddressButton addressType={type} onClick={toggleAddressPurpose} />
            </div>
            <div className="">
                {loading ? (
                    <p>Loading UTXOs...</p>
                ) : Object.keys(sortedTransactionDetails).length > 0 ? (
                    <div>
                        {Object.entries(sortedTransactionDetails).map(([key, detail]) => (
                            <div 
                                key={key} 
                                className={`border-b p-2 lowercase font-sans text-xs cursor-pointer ${isSelected(key) ? 'bg-green-100' : ''}`} 
                                onClick={() => handleUtxoClick(key, detail)}
                            >
                                <p className='text-xs'>utxo: {key}</p>
                                <p>Value: {detail?.value || 'N/A'}</p>
                                {detail?.sat_ranges && Array.isArray(detail.sat_ranges) && (
                                    <div className="mt-2">
                                        <p>Sat Ranges: {detail.sat_ranges.map((range, i) => (
                                            <span key={i}>[{range[0]}, {range[1]}]</span>
                                        ))}</p>
                                        <p>Inscriptions: {detail.inscriptions && Array.isArray(detail.inscriptions) ? detail.inscriptions.map((inscription, i) => (
                                            <li key={i}>[{inscription}]</li>
                                        )) : 'N/A'}</p>
                                        <p>runes: {detail.runes && Array.isArray(detail.runes) ? detail.runes.map((rune, i) => (
                                            <li key={i}>[{rune}]</li>
                                        )) : 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No UTXOs found. {isConnected ? 'Try refreshing the data.' : 'Please connect your wallet.'}</p>
                )}
            </div>
        </div>
    );
}

export default YourUtxo;