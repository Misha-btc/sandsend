import { useCallback } from 'react';
import { key, sandshrewMainnet } from '../keystore';
import axios from 'axios';
import { useWallet } from '../Contexts/WalletContext';

const useGetBalance = () => {
  const { paymentAddress } = useWallet();

  const fetchBalance = useCallback(async () => {
    try {
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
  }, [paymentAddress]);

  return { fetchBalance };
};

export default useGetBalance;