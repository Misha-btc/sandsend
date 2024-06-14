import { useState, useEffect, useCallback } from 'react'; // Импортируем хуки useState, useEffect и useCallback из React
import axios from 'axios'; // Импортируем axios для выполнения HTTP-запросов

const useFetchUtxos = (url, address) => { // Определяем кастомный хук useFetchUtxos, принимающий url и address в качестве параметров
    const [utxos, setUtxos] = useState([]); // Состояние для хранения списка UTXO
    const [loading, setLoading] = useState(false); // Состояние для отслеживания загрузки данных
    const [transactionDetails, setTransactionDetails] = useState({}); // Состояние для хранения деталей транзакций

    const fetchUtxos = useCallback(() => { // Функция для получения UTXO, мемоизированная с помощью useCallback
        setLoading(true); // Устанавливаем состояние загрузки
        axios.post(url, { // Выполняем POST-запрос с помощью axios
            jsonrpc: "2.0",
            id: 1,
            method: "esplora_address::utxo",
            params: [address]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => { // Обрабатываем успешный ответ
            if (response.data && Array.isArray(response.data.result)) { // Проверяем, является ли результат массивом
                setUtxos(response.data.result); // Обновляем состояние UTXO
                localStorage.setItem('utxos', JSON.stringify(response.data.result)); // Сохраняем UTXO в localStorage
            } else {
                setUtxos([]); // Если результат не массив, устанавливаем пустой массив
                localStorage.setItem('utxos', JSON.stringify([])); // Сохраняем пустой массив в localStorage
            }
            setLoading(false); // Останавливаем состояние загрузки
        })
        .catch(error => { // Обрабатываем ошибку запроса
            console.error('Error fetching UTXOs:', error); // Выводим ошибку в консоль
            setLoading(false); // Останавливаем состояние загрузки
        });
    }, [url, address]); // useCallback зависит от url и address

    const fetchTransactionDetails = useCallback(async (utxos) => { // Асинхронная функция для получения деталей транзакций, мемоизированная с помощью useCallback
        if (utxos.length === 0) return; // Если нет UTXO, выходим из функции
        const txidVoutArray = utxos.map(utxo => ["ord_output", [`${utxo.txid}:${utxo.vout}`]]); // Формируем массив параметров для запроса
        try {
            const response = await axios.post(url, { // Выполняем POST-запрос с помощью axios
                jsonrpc: "2.0",
                id: 1,
                method: "sandshrew_multicall",
                params: txidVoutArray
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data && Array.isArray(response.data.result)) { // Проверяем, является ли результат массивом
                const details = {};
                response.data.result.forEach((res, index) => {
                    if (res.result) {
                        // Создаем объект с ключами из res.result и utxos[index] на разных уровнях вложенности
                        details[`${utxos[index].txid}:${utxos[index].vout}`] = {
                            ...utxos[index] ,
                            ...res.result
                        };
                    }
                });
                console.log(details); 
                setTransactionDetails(details); // Обновляем состояние деталей транзакций
                localStorage.setItem('transactionDetails', JSON.stringify(details)); // Сохраняем детали транзакций в localStorage
            }
        } catch (error) { // Обрабатываем ошибку запроса
            console.error('Error fetching transaction details:', error); // Выводим ошибку в консоль
        }
    }, [url]); // useCallback зависит от url

    useEffect(() => { // useEffect для начальной загрузки данных из localStorage и выполнения fetchUtxos
        const storedUtxos = localStorage.getItem('utxos'); // Получаем UTXO из localStorage
        const storedDetails = localStorage.getItem('transactionDetails'); // Получаем детали транзакций из localStorage
        if (storedUtxos) { // Если есть сохраненные UTXO
            try {
                const parsedUtxos = JSON.parse(storedUtxos); // Парсим сохраненные UTXO
                if (Array.isArray(parsedUtxos)) {
                    setUtxos(parsedUtxos); // Обновляем состояние UTXO
                } else {
                    fetchUtxos(); // Выполняем fetchUtxos, если данные некорректны
                }
            } catch (e) {
                console.error('Error parsing stored UTXOs', e); // Выводим ошибку в консоль
                fetchUtxos(); // Выполняем fetchUtxos в случае ошибки
            }
        } else {
            fetchUtxos(); // Выполняем fetchUtxos, если данных нет в localStorage
        }

        if (storedDetails) { // Если есть сохраненные детали транзакций
            try {
                const parsedDetails = JSON.parse(storedDetails); // Парсим сохраненные детали транзакций
                if (typeof parsedDetails === 'object' && parsedDetails !== null) {
                    setTransactionDetails(parsedDetails); // Обновляем состояние деталей транзакций
                }
            } catch (e) {
                console.error('Error parsing stored transaction details', e); // Выводим ошибку в консоль
            }
        }
    }, [fetchUtxos]); // useEffect зависит от fetchUtxos

    useEffect(() => { // useEffect для загрузки деталей транзакций при обновлении списка UTXO
        if (utxos.length > 0) {
            fetchTransactionDetails(utxos); // Выполняем fetchTransactionDetails, если есть UTXO
        }
    }, [utxos, fetchTransactionDetails]); // useEffect зависит от utxos и fetchTransactionDetails

    return { utxos, loading, fetchUtxos, transactionDetails }; // Возвращаем необходимые данные и функции
};

export default useFetchUtxos; // Экспортируем хук