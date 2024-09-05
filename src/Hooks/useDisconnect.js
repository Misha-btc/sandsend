import { useCallback } from 'react';
import { request } from 'sats-connect';

// Кастомный хук для отключения кошелька
const useDisconnectWallet = () => {
  const disconnectWallet = useCallback(async () => {
    try {
      const response = await request('wallet_renouncePermissions');

      if (response.status === 'success') {
        console.log('Кошелек отключен успешно');
        localStorage.clear();
        return { success: true };
      } else {
        console.error('Ошибка отключения:', response.error.message);
        return { success: false, error: response.error.message };
      }
    } catch (err) {
      console.error('Ошибка при отключении кошелька:', err);
      return { success: false, error: err.message };
    }
  }, []);

  return { disconnectWallet };
};

export default useDisconnectWallet;

