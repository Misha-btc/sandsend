import { useState, useEffect, useCallback } from 'react';
import { key, sandshrewMainnet } from '../keystore';
import axios from 'axios';

const useGetBalance = (addressName) => {
  const [balance, setBalance] = useState(0);

  const fetchBalance = useCallback(async () => {

    try {
      const storedAddresses = JSON.parse(localStorage.getItem('walletAddresses')) || {};
      const paymentAddress = storedAddresses.payment?.address;

      if (!paymentAddress) {
        throw new Error('Адрес для платежей не найден');
      }

      const response = await axios.post(sandshrewMainnet+key, {
        jsonrpc: "2.0",
        id: 1,
        method: "esplora_address",
        params: [paymentAddress]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      if (data.result) {
        console.log('data.result', data.result)
        const chainStats = data.result.chain_stats;
        const totalReceived = chainStats.funded_txo_sum;
        const totalSpent = chainStats.spent_txo_sum;
        const currentBalance = totalReceived - totalSpent;

        setBalance(currentBalance);
      } else {
        throw new Error('Не удалось получить данные баланса');
      }
    } catch (error) {
      console.error('Ошибка при получении баланса:', error);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, fetchBalance };
};

export default useGetBalance;