import React from 'react'; // Импортируем React для создания компонентов
import useFetchUtxos from '../Hooks/useFetchUtxos'; // Импортируем кастомный хук для получения UTXO
import { useChoice } from '../Contexts/ChosenUtxo'; // Импортируем контекст для управления выбранными UTXO

function YourUtxo() { // Определяем функциональный компонент YourUtxo
    const url = 'https://mainnet.sandshrew.io/v1/8f32211e11c25c2f0b5084e41970347d'; // URL для запроса UTXO
    const address = 'bc1pf2am4sfm3ja4tluxxwxzr68s68xg8z8ww5qr4ljrep9vmcwkes6sldjq6h'; // Bitcoin-адрес для запроса UTXO
    const { utxos, loading, fetchUtxos, transactionDetails } = useFetchUtxos(url, address); // Используем хук для получения UTXO и связанных данных
    const { choice, addToChoice, removeFromChoice } = useChoice(); // Используем контекст для управления выбором UTXO

    const isChosen = (utxo) => { // Функция для проверки, выбран ли данный UTXO
        return choice.some(item => item.txid === utxo.txid && item.vout === utxo.vout); // Проверяем, есть ли UTXO в списке выбранных
    };

    const handleUtxoClick = (utxo) => { // Обработчик клика по UTXO
        const detailedUtxo = { // Создаем детализированный объект UTXO
            ...utxo, // Копируем свойства UTXO
            sat_ranges: transactionDetails[`${utxo.txid}:${utxo.vout}`]?.sat_ranges || 'N/A', // Добавляем диапазоны сатоши
            inscriptions: transactionDetails[`${utxo.txid}:${utxo.vout}`]?.inscriptions || 'N/A' // Добавляем инскрипции
        };
        if (isChosen(utxo)) { // Проверяем, выбран ли UTXO
            removeFromChoice(detailedUtxo); // Убираем UTXO из выбора, если он уже выбран
        } else {
            addToChoice(detailedUtxo); // Добавляем UTXO в выбор, если он еще не выбран
        }
    };

    return (
        <div>
            <div className='flex items-center border-b p-2 bg-black text-white sticky top-0 z-10 font-black text-xl'>
                <button onClick={fetchUtxos} className="absolute text-xs">refresh</button> {/* Кнопка для обновления списка UTXO */}
                <div className='w-full text-center'>my UTXO</div> {/* Заголовок */}
            </div>
            <div className="">
                {loading ? (
                    <p>Loading UTXOs...</p> // Сообщение о загрузке данных
                ) : (
                    utxos.length > 0 ? ( // Если UTXO найдены
                        <div>
                            {utxos.map((utxo) => ( // Проходим по списку UTXO
                                <div 
                                    key={`${utxo.txid}:${utxo.vout}`} 
                                    className={`border-b p-2 lowercase font-sans text-xs cursor-pointer ${isChosen(utxo) ? 'bg-green-100' : ''}`} // Выделяем выбранные UTXO цветом
                                    onClick={() => handleUtxoClick(utxo)} // Обработчик клика по UTXO
                                >
                                    <p className='text-xs'>utxo: {utxo.txid}:{utxo.vout}</p> {/* Информация о UTXO */}
                                    <p>Block: {utxo.status.block_height}</p>
                                    <p>Confirmed: {utxo.status.confirmed ? 'Yes' : 'No'}</p>
                                    <p>Value: {utxo.value}</p>
                                    {transactionDetails[`${utxo.txid}:${utxo.vout}`] && ( // Если есть дополнительные данные о транзакции
                                        <div className="mt-2">
                                            <p>Sat Ranges: {transactionDetails[`${utxo.txid}:${utxo.vout}`].sat_ranges && Array.isArray(transactionDetails[`${utxo.txid}:${utxo.vout}`].sat_ranges) ? transactionDetails[`${utxo.txid}:${utxo.vout}`].sat_ranges.map((range, i) => (
                                                <span key={i}>[{range[0]}, {range[1]}]</span>
                                            )) : 'N/A'}</p> {/* Диапазоны сатоши */}
                                            <p>Inscriptions: {transactionDetails[`${utxo.txid}:${utxo.vout}`].inscriptions && Array.isArray(transactionDetails[`${utxo.txid}:${utxo.vout}`].inscriptions) ? transactionDetails[`${utxo.txid}:${utxo.vout}`].inscriptions.map((inscription, i) => (
                                                <li key={i}>[{inscription}]</li>
                                            )) : 'N/A'}</p> {/* Инскрипции */}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No UTXOs found.</p> // Сообщение, если UTXO не найдены
                    )
                )}
            </div>
        </div>
    );
}

export default YourUtxo; // Экспортируем компонент