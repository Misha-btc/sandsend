import React from 'react';
import useFetchUtxos from '../Hooks/useFetchUtxos'; // Импортируем кастомный хук для получения UTXO
import { useChoice } from '../Contexts/ChosenUtxo'; // Импортируем хук для использования контекста выбора UTXO
import useConnectWallet from '../Hooks/useConnectWallet';
import AddressButton from './AddressButton';

function YourUtxo() {
    // URL и адрес для получения данных UTXO
    const url = 'https://mainnet.sandshrew.io/v1/8f32211e11c25c2f0b5084e41970347d';
    const address = 'bc1pf2am4sfm3ja4tluxxwxzr68s68xg8z8ww5qr4ljrep9vmcwkes6sldjq6h';

    // Используем кастомный хук для получения UTXO и деталей транзакций
    const { loading, fetchUtxos, transactionDetails } = useFetchUtxos(url, address);

    // Используем контекст для управления выбранными UTXO
    const { choice, addToChoice, removeFromChoice } = useChoice();

    // Проверяем, выбран ли UTXO
    const isChosen = (key) => {
        return choice.hasOwnProperty(key); // Возвращает true, если ключ существует в объекте choice
    };

    // Обрабатываем клик на UTXO
    const handleUtxoClick = (key, detail) => {
        if (isChosen(key)) {
            removeFromChoice(key); // Удаляем UTXO из выбора, если он уже выбран
        } else {
            addToChoice(key, detail); // Добавляем UTXO в выбор, если он не выбран
        }
    };

    return (
        <div>
            {/* Заголовок */}
        <div className='flex items-center border-b p-2 bg-black text-white sticky top-0 z-10 font-black text-xl'>
            <button onClick={fetchUtxos} className="absolute text-xs">refresh</button> {/* Кнопка обновления */}
            <div className='w-full text-center'>my UTXOs</div> {/* Заголовок по центру */}
            <AddressButton/>
        </div>
            {/* Список UTXO */}
            <div className="">
                {loading ? (
                    <p>Loading UTXOs...</p>
                ) : (
                    Object.keys(transactionDetails).length > 0 ? (
                        <div>
                            {/* Перебираем и отображаем каждую транзакцию */}
                            {Object.entries(transactionDetails).map(([key, detail]) => (
                                <div 
                                    key={key} 
                                    className={`border-b p-2 lowercase font-sans text-xs cursor-pointer ${isChosen(key) ? 'bg-green-100' : ''}`} 
                                    onClick={() => handleUtxoClick(key, detail)} // Обработчик клика
                                >
                                    <p className='text-xs'>utxo: {key}</p> {/* Отображение ключа UTXO */}
                                    <p>Block: {detail.status.block_height}</p> {/* Отображение блока */}
                                    <p>Confirmed: {detail.status.confirmed ? 'Yes' : 'No'}</p> {/* Отображение подтверждения */}
                                    <p>Value: {detail.value}</p> {/* Отображение значения */}
                                    {detail.sat_ranges && Array.isArray(detail.sat_ranges) && ( /* Отображение диапазонов сатоши */
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