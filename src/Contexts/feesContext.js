import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useTransaction } from './TransactionContext';
import { useWallet } from './WalletContext';
import useMempoolInfo from '../Hooks/useMempoolInfo';
import useFeeSelect from '../Hooks/useFeeSelect';



const FeesContext = createContext();

export const FeesProvider = ({ children }) => {
  const [feeRate, setFeeRate] = useState(1); // Устанавливаем начальное значение 1 sat/vByte
  const { outputs, input, change } = useTransaction();
  const { paymentAddressType } = useWallet();
  const [feeState, setFeeState] = useState('medium');
  const [totalFee, setTotalFee] = useState(0);
  const { fees } = useMempoolInfo();
  const [customFee, setCustomFee] = useState('');
  const selectOptimalFee = useFeeSelect();

  const calcEstimatedFee = useCallback(() => {
    const getFeeValue = (totalVBytes) => {
      if (feeState !== 'custom') {
        const index = feeState === 'low' ? 1 : feeState === 'medium' ? 2 : feeState === 'high' ? 3 : 0;
        if (fees && fees[index]) {
          const totalFee = Math.ceil(fees[index] * totalVBytes);
          return totalFee.toFixed(2);
        } else {
          return 0;
        }
      } else {
        const totalFee = customFee * totalVBytes;
        return totalFee.toFixed(0);
      }
    }

    const bytesPerType = {
      p2pkh: { input: 148, output: 34 },
      p2sh: { input: 91, output: 32 },
      p2wpkh: { input: 67.75, output: 31 },
      p2wsh: { input: 104, output: 43 },
      p2tr: { input: 57.25, output: 43 },
    };

    let totalVBytes = 0;
    let witnessSize = 0;

    // Добавляем размер заголовка транзакции
    totalVBytes += 4 + // nVersion
                   1 + // число входов (предполагаем < 253)
                   1 + // число выходов (предполагаем < 253)
                   4;  // nLockTime

    // Обрабатываем входы
    if (Array.isArray(input)) {
      input.forEach(inputItem => {
        if (inputItem && inputItem.addressType) {
          const inputType = inputItem.addressType.toLowerCase();
          if (bytesPerType[inputType]) {
            totalVBytes += bytesPerType[inputType].input;
            if (inputType.startsWith('p2w')) {
              witnessSize += inputType === 'p2wpkh' ? 107 : 65;
            }
          }
        }
      });
    }

    // Обрабатываем выходы
    if (Array.isArray(outputs)) {
      outputs.forEach(output => {
        if (output && output.addressType) {
          const outputType = output.addressType.toLowerCase();
          if (bytesPerType[outputType]) {
            totalVBytes += bytesPerType[outputType].output;
          }
        }
      });
    }
    // Если есть сдача за вычетом комиссии больше 1000, то прибавляем вес сдачи
    if (change - totalFee >= 1000 && paymentAddressType) {
      totalVBytes += bytesPerType[paymentAddressType].output;
    } else if (change - totalFee > 0 && change - totalFee < 1000 && paymentAddressType) {
      
    } else if (change - totalFee < 0 && paymentAddressType) {
      totalVBytes += bytesPerType[paymentAddressType].input;
    }


    // Добавляем размер свидетеля (witness)
    if (witnessSize > 0) {
      totalVBytes += 0.25 + 0.25 + witnessSize / 4;
    }

    // Округляем до целого числа vbytes
    totalVBytes = Math.ceil(totalVBytes);

    // Вычисляем комиссию
    setTotalFee(getFeeValue(totalVBytes));

    return totalVBytes;
  }, [
    paymentAddressType, 
    input, 
    outputs, 
    change,
    customFee,
    feeState,
    fees,
    setTotalFee,
    totalFee,
  ]);

  useEffect(() => {
    calcEstimatedFee();
  }, [calcEstimatedFee]);

  return (
    <FeesContext.Provider value={{ 
      calcEstimatedFee, 
      totalFee, 
      setTotalFee, 
      feeState, 
      setFeeState, 
      feeRate, 
      setFeeRate,
      customFee, setCustomFee
    }}>
      {children}
    </FeesContext.Provider>
  );
};

export const useFees = () => {
  const context = useContext(FeesContext);
  if (!context) {
    throw new Error('useFees должен использоваться внутри FeesProvider');
  }
  return context;
};
