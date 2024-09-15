import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useTransaction } from './TransactionContext';
import { useWallet } from './WalletContext';
import useMempoolInfo from '../Hooks/useMempoolInfo';
import useFeeSelect from '../Hooks/useFeeSelect';



const FeesContext = createContext();

export const FeesProvider = ({ children }) => {
  const { outputs, input, change } = useTransaction();
  const { paymentAddressType, balance } = useWallet();
  const [feeState, setFeeState] = useState('medium');
  const [totalFee, setTotalFee] = useState(0);
  const { fees } = useMempoolInfo();
  const [customFee, setCustomFee] = useState('');
  const selectOptimalFee = useFeeSelect();
  const [confirmFee, setConfirmFee] = useState(false);
  const [feeInput, setFeeInput] = useState([]);
  const [totalChange, setTotalChange] = useState(null);
  const [balanceAfterOutput, setBalanceAfterOutput] = useState(null);
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
        if (confirmFee) {
          return Math.ceil(customFee * totalVBytes);
        } else {
          return 0;
        }
      }
    }
    setTotalChange(null);
    setFeeInput([]);

    if (outputs.length === 0 || input.length === 0 || outputs[0].amount === 0) {
      return { totalVBytes: 0, fee: 0 };
    }

  
    const bytesPerType = {
      p2pkh: { input: 148, output: 34 },
      p2sh: { input: 91, output: 32 },
      p2wpkh: { input: 67.75, output: 31 },
      p2wsh: { input: 104, output: 43 },
      p2tr: { input: 57.25, output: 43 },
    };

    let totalVBytes = 10; // Базовый размер транзакции
    let witnessSize = 0;
    let inputTotalAmount = 0;
    let outputTotalAmount = 0;

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
            outputTotalAmount += output.amount;
            console.log('output', output);
          }
        }
      });
    }

    // Добавляем размер свидетеля (witness)
    if (witnessSize > 0) {
      totalVBytes += 0.25 + 0.25 + witnessSize / 4;
    }

    totalVBytes = Math.ceil(totalVBytes);

    let feeSum = getFeeValue(totalVBytes);
    const balanceChange = balance - inputTotalAmount - feeSum;
    const balanceAfterOutput = balance - outputTotalAmount - feeSum;
    if (balanceAfterOutput < 0) {
      return { totalVBytes: 0, fee: 0 };
    }
    setBalanceAfterOutput(balanceAfterOutput);

    if (change - feeSum >= 1000 && paymentAddressType) {
      totalVBytes += bytesPerType[paymentAddressType].output;
      feeSum = getFeeValue(totalVBytes);
      setTotalChange(change - feeSum);
    } else if (change - feeSum < 0 && paymentAddressType && balanceChange > 0) {
      const selectedUtxos = selectOptimalFee(feeSum, change, input, bytesPerType, balanceAfterOutput, paymentAddressType, getFeeValue, balanceChange);
      if (!selectedUtxos) {
        console.log('No selected UTXOs or insufficient funds');
        return { totalVBytes: 0, fee: 0 };
      }
      const selectedAmount = selectedUtxos.reduce((sum, utxo) => sum + utxo.value, 0);
      setFeeInput(selectedUtxos);
      inputTotalAmount += selectedAmount;
      const changeAfterSelect = selectedAmount - feeSum;
 
      
      const inputCount = selectedUtxos.length;
      totalVBytes += changeAfterSelect > 0 ? bytesPerType[paymentAddressType].output : 0;
      totalVBytes += bytesPerType[paymentAddressType].input * inputCount;

      feeSum = getFeeValue(totalVBytes);
      console.log('feeSum', feeSum);
      
      const afterAfterChange = inputTotalAmount - outputTotalAmount - feeSum;
      console.log(`afterAfterChange: ${afterAfterChange}`);
      setBalanceAfterOutput(afterAfterChange);
      console.log('afterAfterChange', afterAfterChange, `inputTotalAmount: ${inputTotalAmount}, outputTotalAmount: ${outputTotalAmount}, feeSum: ${feeSum}`);
      if (afterAfterChange < 0) {
        setTotalChange(0);
        setFeeInput([]);
        return { totalVBytes: 0, fee: 0 };
      }
      setTotalChange(afterAfterChange > 0 ? afterAfterChange : 0);

    } else {
      setTotalChange(0);
      setFeeInput([]);
    }

    return { totalVBytes, fee: feeSum };
  }, [
    paymentAddressType, 
    input,
    selectOptimalFee, 
    outputs, 
    change,
    confirmFee,
    balance,
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
      setTotalChange,
      feeState, 
      confirmFee,
      feeInput,
      totalChange,
      balanceAfterOutput,
      setFeeInput,
      setConfirmFee,
      setFeeState, 
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
