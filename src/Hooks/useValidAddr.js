import { useState, useCallback } from 'react';
import axios from 'axios';
import { key, sandshrewMainnet } from '../keystore';

const useValidAddr = () => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateAddress = useCallback(async (address) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(sandshrewMainnet + key, {
        jsonrpc: "2.0",
        id: 1,
        method: "btc_validateaddress",
        params: [address]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.result) {
        setIsValid(response.data.result.isvalid);
      } else {
        setIsValid(false);
        setError('Неверный ответ от сервера');
      }
    } catch (err) {
      setIsValid(false);
      setError(err.message || 'Произошла ошибка при валидации адреса');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isValid, isLoading, error, validateAddress };
};

export default useValidAddr;
