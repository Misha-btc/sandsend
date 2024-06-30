import React, { useState, useEffect } from 'react';
import useFetchUtxos from '../Hooks/useFetchUtxos'; // Импортируем кастомный хук для получения UTXO
import { useChoice } from '../Contexts/ChosenUtxo'; // Импортируем хук для использования контекста выбора UTXO
import AddressButton from './AddressButton';

function YourUtxo() {
    const url = 'https://mainnet.sandshrew.io/v1/8f32211e11c25c2f0b5084e41970347d';
    const [walletAddresses, setWalletAddresses] = useState({});
    const [addressPurpose, setAddressPurpose] = useState('ordinals');
    

    // Используем кастомный хук для получения UTXO и деталей транзакций
    const { loading, transactionDetails } = useFetchUtxos(url);

    // Используем контекст для управления выбранными UTXO
    const { choice, addToChoice, removeFromChoice } = useChoice();

    // Извлекаем адреса из localStorage при монтировании компонента
    useEffect(() => {
        const storedAddresses = JSON.parse(localStorage.getItem('walletAddresses')) || {};
        setWalletAddresses(storedAddresses);
    }, []);

    // Проверяем, выбран ли UTXO
    const isChosen = (key) => {
        return choice.hasOwnProperty(key); // Возвращает true, если ключ существует в объекте choice
    };

    // Обрабатываем клик на UTXO
    const handleUtxoClick = (key, detail) => {
        if (isChosen(key)) {
            removeFromChoice(key); // Удаляем UTXO из выбора, если он уже выбран
            removeFromLocalStorage(key);
        } else {
            addToChoice(key, detail); // Добавляем UTXO в выбор, если он не выбран
        }
    };
    const removeFromLocalStorage = (key) => {
        const savedData = localStorage.getItem('myData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData[key]) {
                delete parsedData[key];
                localStorage.setItem('myData', JSON.stringify(parsedData));
                console.log(`Data for key ${key} removed from localStorage`);
            }
        }
    };
    const filteredTransactionDetails = transactionDetails[addressPurpose] || {};

    const toggleAddressPurpose = () => {
        const purposes = Object.keys(walletAddresses);
        const currentIndex = purposes.indexOf(addressPurpose);
        const nextIndex = (currentIndex + 1) % purposes.length;
        setAddressPurpose(purposes[nextIndex]);
    };

    return (
        <div>
            {/* Заголовок */}
            <div className='flex items-center border-b p-2 bg-black text-white sticky top-0 z-10 font-black text-xl'>
                <div className='w-full text-center'>my UTXOs</div> {/* Заголовок по центру */}
                <AddressButton addressType={addressPurpose} onClick={toggleAddressPurpose} />
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
                                    className={`border-b p-2 lowercase font-sans text-xs cursor-pointer ${isChosen(key) ? 'bg-green-100' : ''}`} 
                                    onClick={() => handleUtxoClick(key, detail)} // Обработчик клика
                                >
                                    <p className='text-xs'>utxo: {key}</p> {/* Отображение ключа UTXO */}
                                    <p>Block: {detail?.status?.block_height || 'N/A'}</p> {/* Отображение блока */}
                                    <p>Confirmed: {detail?.status?.confirmed ? 'Yes' : 'No'}</p> {/* Отображение подтверждения */}
                                    <p>Value: {detail?.value || 'N/A'}</p> {/* Отображение значения */}
                                    {detail?.sat_ranges && Array.isArray(detail.sat_ranges) && ( /* Отображение диапазонов сатоши */
                                        <div className="mt-2">
                                            <p>Sat Ranges: {detail.sat_ranges.map((range, i) => (
                                                <span key={i}>[{range[0]}, {range[1]}]</span> /* Отображение диапазонов сатоши */
                                            ))}</p>
                                            <p>Inscriptions: {detail.inscriptions && Array.isArray(detail.inscriptions) ? detail.inscriptions.map((inscription, i) => (
                                                <li key={i}>[{inscription}]</li> /* Отображение подписей */
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