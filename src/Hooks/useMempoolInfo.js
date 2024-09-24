import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNetwork } from '../Contexts/NetworkContext';

// Пользовательский хук для получения информации о мемпуле
function useMempoolInfo() {
  const { url } = useNetwork();
  const [fees, setFees] = useState(() => {
    const storedFees = localStorage.getItem('fees');
    return storedFees ? JSON.parse(storedFees) : null;
  });
  const [error, setError] = useState(null);

  const fetchFees = useCallback(async () => {
    try {
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: 1,
        method: 'esplora_fee-estimates',
        params: []
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setFees(response.data.result);
      setError(null);
      localStorage.setItem('fees', JSON.stringify(response.data.result));
    } catch (err) {
      setError('Ошибка при получении данных о комиссиях');
      console.error('Ошибка при получении данных о комиссиях:', err);
    }
  }, [url]);


  useEffect(() => {
    if (!fees) {
      fetchFees();
    }
  }, [fees, fetchFees]);

  // Возвращаем данные и методы, которые могут использоваться в компоненте
  return { fees, error, fetchFees };
}

export default useMempoolInfo;