import React, { useEffect, useState } from 'react'; // Импортируем React и необходимые хуки useEffect и useState.
import Modal from './Modal/Modal'; // Импортируем компонент Modal из локального файла.
import Button from './Button'; // Импортируем компонент Button из локального файла.
import { generateSecretKey, getPublicKey, Relay } from 'nostr-tools'; // Импортируем функции generateSecretKey, getPublicKey и класс Relay из библиотеки nostr-tools.

const Nostr = () => { // Объявляем функциональный компонент Nostr.
  const [showUtxo, setShowUtxo] = useState(false); // Создаем состояние showUtxo для управления отображением модального окна, по умолчанию оно скрыто.
  const [sk, setSk] = useState(generateSecretKey()); // Создаем состояние sk для хранения сгенерированного секретного ключа.
  const [pk, setpk] = useState(getPublicKey(sk)); // Создаем состояние pk для хранения публичного ключа, полученного на основе секретного ключа.
  const [relay, setRelay] = useState(null); // Создаем состояние relay для хранения объекта подключения к реле.

  useEffect(() => { // Используем хук useEffect для выполнения побочных эффектов, таких как подключение к реле.
    const connectRelay = async () => { // Объявляем асинхронную функцию для подключения к реле.
      try {
        const relay = await Relay.connect('wss://purplerelay.com'); // Подключаемся к реле по указанному URL.
        console.log(`Connected to ${relay.url}`); // Логируем успешное подключение.
        setRelay(relay); // Обновляем состояние relay с объектом подключения.

        relay.onclose = () => { // Устанавливаем обработчик события закрытия соединения.
          console.log('Connection closed'); // Логируем сообщение о закрытии соединения.
          setRelay(null); // Сбрасываем состояние relay.
        };
        
        relay.onerror = (err) => { // Устанавливаем обработчик события ошибки соединения.
          console.error('Relay error:', err); // Логируем сообщение об ошибке.
          setRelay(null); // Сбрасываем состояние relay.
        };
      } catch (err) { // Обрабатываем ошибки при подключении.
        console.error('Failed to connect to relay:', err); // Логируем сообщение о неудачном подключении.
      }
    };

    connectRelay(); // Вызываем функцию подключения к реле.
  }, []); // Передаем пустой массив зависимостей, чтобы useEffect выполнялся только один раз при монтировании компонента.

  return ( // Возвращаем JSX-разметку компонента.
    <div>
      <Button onClick={() => setShowUtxo(!showUtxo)} title="Nostr" // Добавляем кнопку для управления отображением модального окна.
        className='fixed text-white bg-black p-2 top-20 right-2 bg-black hover:bg-zinc-900 z-10 transform -translate-x-1/2'
      />
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)}> 
        <div>
            <p>sk: {sk}</p> 
            <p>pk: {pk}</p> 
            { relay ? <p>Connected to {relay.url}</p> : <p>Could not connect</p>} 
        </div>
      </Modal>
    </div>
  );
};

export default Nostr; // Экспортируем компонент Nostr по умолчанию.