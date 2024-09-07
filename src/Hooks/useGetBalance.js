import { useCallback } from 'react';
import axios from 'axios';
import { useNetwork } from '../Contexts/NetworkContext';

const useGetBalance = () => {
  const { url } = useNetwork();

  const fetchBalance = useCallback(async (paymentAddress) => {
    try {
      if (!paymentAddress) {
        throw new Error('Адрес для платежей не найден');
      }

      const response = await axios.post(url, {
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
        const chainStats = data.result.chain_stats;
        const totalReceived = chainStats.funded_txo_sum;
        const totalSpent = chainStats.spent_txo_sum;
        const currentBalance = totalReceived - totalSpent;

        return currentBalance;
      } else {
        throw new Error('Не удалось получить данные баланса');
      }
    } catch (error) {
      console.error('Ошибка при получении баланса:', error);
      return 0;
    }
  }, [url]);

  return { fetchBalance };
};

export default useGetBalance;