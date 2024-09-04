import React, { useState, useEffect } from 'react';
import useFetchUtxos from '../Hooks/useFetchUtxos'; // Импортируем кастомный хук для получения UTXO
import AddressButton from './AddressButton';
import { useTransaction } from '../Contexts/TransactionContext';

function YourUtxo() {
    const url = 'https://signet.sandshrew./v1/8f32211e11c25c2f0b5084e41970347d';

    // Используем кастомный хук для получения UTXO и деталей транзакций
    const { loading, transactionDetails } = useFetchUtxos(url);
    
    const [addressPurpose, setAddressPurpose] = useState('');

    const { updateInput, removeInput, input } = useTransaction();

    useEffect(() => {
        const addressType = Object.keys(transactionDetails);
        if (addressType.length > 0 && !addressPurpose) {
            setAddressPurpose(addressType[0]);
        }
    }, [transactionDetails, addressPurpose]);

    const isSelected = (key) => {
        return input.some(input => input.key === key);
    };
    // Обрабатываем клик на UTXO
    const handleUtxoClick = (key, detail) => {
        const [txid, vout] = key.split(':');

        // Убираем логику выбора
        if (isSelected(key)) {
            removeInput(key);
        } else {
            // Если UTXO не выбран, добавляем его в input
            updateInput({ ...detail, txid, vout, key });
        }
    };

    const filteredTransactionDetails = transactionDetails[addressPurpose] || {};
    const [, type] = addressPurpose !== '' ? addressPurpose.split(':') : ['', ''];

    const toggleAddressPurpose = () => {
        const purposes = Object.keys(transactionDetails);
        const currentIndex = purposes.indexOf(addressPurpose);
        const nextIndex = (currentIndex + 1) % purposes.length;
        setAddressPurpose(purposes[nextIndex]);
    };

    return (
        <div>
            {/* Заголовок */}
            <div className='flex items-center border-b p-2 bg-black text-white sticky top-0 z-10 font-black text-xl'>
                <div className='w-full text-center'>my UTXOs</div> {/* Заголовок по центру */}
                <AddressButton addressType={type} onClick={toggleAddressPurpose} />
            </div>
            {/* Список UTXO */}
            <div className="">
                {loading ? (
                    <p>Loading UTXOs...</p>
                ) : (
                    Object.keys(filteredTransactionDetails).length > 0 ? (
                        <div>
                            {/* Перебираем и отображаем каждую транзакцию */}
                            {Object.entries(filteredTransactionDetails).map(([key, detail]) => (
                                <div 
                                    key={key} 
                                    className={`border-b p-2 lowercase font-sans text-xs cursor-pointer ${isSelected(key) ? 'bg-green-100' : ''}`} 
                                    onClick={() => handleUtxoClick(key, detail)} // Обработчик клика
                                >
                                    <p className='text-xs'>utxo: {key}</p> {/* Отображение ключа UTXO */}
                                    <p>Value: {detail?.value || 'N/A'}</p> {/* Отображение значения */}
                                    {detail?.sat_ranges && Array.isArray(detail.sat_ranges) && ( /* Отображение диапазонов сатоши */
                                        <div className="mt-2">
                                            <p>Sat Ranges: {detail.sat_ranges.map((range, i) => (
                                                <span key={i}>[{range[0]}, {range[1]}]</span> /* Отображение диапазонов сатоши */
                                            ))}</p>
                                            <p>Inscriptions: {detail.inscriptions && Array.isArray(detail.inscriptions) ? detail.inscriptions.map((inscription, i) => (
                                                <li key={i}>[{inscription}]</li> /* Отображение подписей */
                                            )) : 'N/A'}</p>
                                            <p>runes: {detail.runes && Array.isArray(detail.runes) ? detail.runes.map((rune, i) => (
                                                <li key={i}>[{rune}]</li> /* Отображение подписей */
                                            )) : 'N/A'}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No UTXOs found.</p> /* Отображение сообщения, если UTXO не найдены */
                    )
                )}
            </div>
        </div>
    );
}

export default YourUtxo;