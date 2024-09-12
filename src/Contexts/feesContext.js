import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useTransaction } from './TransactionContext';
import { useWallet } from './WalletContext';
import useMempoolInfo from '../Hooks/useMempoolInfo';
import useFeeSelect from '../Hooks/useFeeSelect';



const FeesContext = createContext();

export const FeesProvider = ({ children }) => {
  const [feeRate, setFeeRate] = useState(1); // Устанавливаем начальное значение 1 sat/vByte
  const { outputs, input, change, inputRef, balance } = useTransaction();
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
          return Math.ceil(fees[index] * totalVBytes);
        } else {
          return 0;
        }
      } else {
        return customFee * totalVBytes;
      }
    }
    let feeSum = totalFee;

    const bytesPerType = {
      p2pkh: { input: 148, output: 34 },
      p2sh: { input: 91, output: 32 },
      p2wpkh: { input: 67.75, output: 31 },
      p2wsh: { input: 104, output: 43 },
      p2tr: { input: 57.25, output: 43 },
    };

    let totalVBytes = 0;
    let witnessSize = 0;
    let inputTotalAmount = 0;

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
            inputTotalAmount += inputItem.value;
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
    console.log(`input: ${input.length} feeSum: ${feeSum} totalfee ${totalFee}`);
    // Если есть сдача за вычетом комиссии больше 1000, то прибавляем вес сдачи
    if (change - feeSum >= 1000 && paymentAddressType) {
      totalVBytes += bytesPerType[paymentAddressType].output;
    } else if (change - feeSum >= 0 && change - feeSum < 1000 && paymentAddressType) {
      
    } else if (change - feeSum < 0 && paymentAddressType && !(balance - inputTotalAmount > inputTotalAmount + feeSum)) {

      const selectedUtxos = selectOptimalFee(feeSum, change, input);
      const selectedAmount = selectedUtxos && selectedUtxos.length > 0
        ? selectedUtxos.reduce((sum, utxo) => sum + utxo.value, 0)
        : 0;
      const inputCaunt = selectedUtxos ? selectedUtxos.length : 0;
      console.log(`inputCaunt: ${inputCaunt}`);
      totalVBytes += bytesPerType[paymentAddressType].input * inputCaunt;
    } else {
      return { totalVBytes: 0, fee: 0 };
    }

    // Добавляем размер свидетеля (witness)
    if (witnessSize > 0) {
      totalVBytes += 0.25 + 0.25 + witnessSize / 4;
    }

    // Округляем до целого числа vbytes
    totalVBytes = Math.ceil(totalVBytes);

    // Вычисляем комиссию
    const calculatedTotalVBytes = Math.ceil(totalVBytes);
    const calculatedFee = getFeeValue(calculatedTotalVBytes);
    
    return { totalVBytes: calculatedTotalVBytes, fee: calculatedFee };
  }, [
    paymentAddressType, 
    input,
    selectOptimalFee, 
    outputs, 
    change,
    balance,
    totalFee,
    customFee,
    feeState,
    fees
  ]);

  useEffect(() => {
    const { fee } = calcEstimatedFee();
    setTotalFee(fee);
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
