import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTransaction } from './TransactionContext';


const FeesContext = createContext();

export const FeesProvider = ({ children }) => {
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [feeRate, setFeeRate] = useState(1); // Устанавливаем начальное значение 1 sat/vByte
  const { outputs, input } = useTransaction();
  const [feeState, setFeeState] = useState('medium');


  const calcEstimatedFee = () => {
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

    // Добавляем размер свидетеля (witness)
    if (witnessSize > 0) {
      totalVBytes += 0.25 + 0.25 + witnessSize / 4;
    }

    // Округляем до целого числа vbytes
    totalVBytes = Math.ceil(totalVBytes);

    // Вычисляем комиссию
    const newEstimatedFee = totalVBytes * feeRate;
    setEstimatedFee(newEstimatedFee);

    return totalVBytes;
  }

  useEffect(() => {
    calcEstimatedFee();
  }, [outputs, input, feeRate]);

  return (
    <FeesContext.Provider value={{ estimatedFee, calcEstimatedFee, feeState, setFeeState, feeRate, setFeeRate }}>
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
