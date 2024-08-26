import { useState, useCallback } from 'react';
import { request, AddressPurpose, RpcErrorCode } from 'sats-connect';

// Кастомный хук для подключения кошелька
const useConnectWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState('');

  const connectWallet = useCallback(async () => {
    try {
      // Опции для запроса доступа к кошельку
      const options = {
        purposes: ['payment', 'ordinals'], // Запрашиваем доступ к адресам для платежей и ordinals
        message: "We need access to your wallet addresses to proceed.", // Сообщение, отображаемое пользователю при запросе доступа
      };

      // Выполняем запрос к кошельку с использованием библиотеки sats-connect
      const response = await request('getAccounts', options);

      // Проверяем статус ответа
      if (response.status === 'success') {
        // Создаем объект для хранения адресов
        const walletAddresses = {};

        // Ищем адрес для платежей среди результатов
        const paymentAddressItem = response.result.find(
          (address) => address.purpose === AddressPurpose.Payment
        );

        // Ищем адрес для ordinals среди результатов
        const ordinalsAddressItem = response.result.find(
          (address) => address.purpose === AddressPurpose.Ordinals
        );

        // Сохраняем найденные адреса в объекте walletAddresses
        if (paymentAddressItem) {
          walletAddresses[AddressPurpose.Payment] = paymentAddressItem;
          setPaymentAddress(paymentAddressItem.address);
        }

        if (ordinalsAddressItem) {
          walletAddresses[AddressPurpose.Ordinals] = ordinalsAddressItem;
        }

        // Сохраняем объект walletAddresses в localStorage
        localStorage.setItem('walletAddresses', JSON.stringify(walletAddresses));
        setIsConnected(true);
        console.log('CONNECT Wallet', walletAddresses)
      } else {
        // Обработка ошибок, если запрос не удался
        if (response.error.code === RpcErrorCode.USER_REJECTION) {
          console.error('User canceled the request'); // Логируем ошибку отмены пользователем
        } else {
          console.error('Error:', response.error.message); // Логируем другие ошибки
        }
      }
    } catch (err) {
      // Обработка исключений, возникших при выполнении запроса
      alert(err.message); // Выводим сообщение об ошибке
    }
  }, []); // Мемоизация функции, зависимость - пустой массив, чтобы функция создавалась один раз

  // Возвращаем функцию connectWallet для использования в компонентах
  return { connectWallet, isConnected, paymentAddress };
};

export default useConnectWallet; // Экспортируем хук для использования в других частях приложения