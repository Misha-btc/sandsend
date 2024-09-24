import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useTransaction } from './TransactionContext';
import { useWallet } from './WalletContext';
import useMempoolInfo from '../Hooks/useMempoolInfo';
import useFeeSelect from '../Hooks/useFeeSelect';



const FeesContext = createContext();

export const FeesProvider = ({ children }) => {
  const { outputs, input, change, temporaryOutput } = useTransaction();
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
  const [changeOutputPrice, setChangeOutputPrice] = useState(0);
  const [dust, setDust] = useState(0);
  const [dustWay, setDustWay] = useState(null);
  const [dustToFee, setDustToFee] = useState(0);
  const [dustToChange, setDustToChange] = useState(0);

  const calcEstimatedFee = useCallback(() => {
    if (dustWay !== null) return;

    const getFeeValue = (totalVBytes) => {
      if (feeState !== 'custom' && fees) {
        if (feeState === 'low') {
          return Math.ceil((fees[3] + fees[2]) / 2 * totalVBytes);
        } else if (feeState === 'medium') {
          return Math.ceil((fees[2] + fees[1]) / 2 * totalVBytes);
        } else if (feeState === 'high') {
          return Math.ceil(fees[1] * totalVBytes);
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
    setChangeOutputPrice(paymentAddressType && bytesPerType[paymentAddressType] ? getFeeValue(bytesPerType[paymentAddressType].output) : 0);

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
      outputs.forEach((output, index) => {
        if (output && output.addressType) {
          const currentOutput = temporaryOutput && temporaryOutput.index === index ? temporaryOutput : output;
          const outputType = output.addressType.toLowerCase();
          if (bytesPerType[outputType]) {
            totalVBytes += bytesPerType[outputType].output;
            outputTotalAmount += currentOutput.amount;
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
      setDust(0);
    } else if (changeOutputPrice <= (change - feeSum - changeOutputPrice) && (change - feeSum - changeOutputPrice) >= 546) {
      console.log('changeOutputPrice', changeOutputPrice);
      totalVBytes += bytesPerType[paymentAddressType].output;
      feeSum = getFeeValue(totalVBytes);
      setTotalChange(change - feeSum);
      setDust(0);
    } else if (change - feeSum < 0 && paymentAddressType && balanceChange > 0) {
      console.log('change', change, `feeSum: ${feeSum}`);
      const selectedUtxos = selectOptimalFee(feeSum, change, input, bytesPerType, balanceAfterOutput, paymentAddressType, getFeeValue, balanceChange);
      setDust(0);
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
      const afterAfterChange = inputTotalAmount - outputTotalAmount - feeSum;
      setBalanceAfterOutput(afterAfterChange);
      if (afterAfterChange < 0) {
        setTotalChange(0);
        setFeeInput([]);
        return { totalVBytes: 0, fee: 0 };
      }
      setTotalChange(afterAfterChange > 0 ? afterAfterChange : 0);

    } else if (change - feeSum === 0) {
      return { totalVBytes: 0, fee: feeSum };
    } else if (dustToFee) {
      return { totalVBytes: 0, fee: feeSum };
    }
    else {
      setTotalChange(0);
      setDust(change);
      setFeeInput([]);
    }

    return { totalVBytes, fee: feeSum };
  }, [
    paymentAddressType,
    input,
    dustToFee,
    changeOutputPrice,
    selectOptimalFee,
    temporaryOutput,
    outputs, 
    dustWay,
    change,
    confirmFee,
    balance,
    customFee,
    feeState,
    fees
  ]);

  useEffect(() => {
    if (dustWay !== null) return;
    const { fee } = calcEstimatedFee();
    setTotalFee(fee);
  }, [calcEstimatedFee, dustWay]);

  return (
    <FeesContext.Provider value={{ 
      calcEstimatedFee, 
      totalFee, 
      setTotalFee,
      setTotalChange,
      changeOutputPrice,
      feeState, 
      confirmFee,
      feeInput,
      dust,
      setDustToFee,
      setDustToChange,
      dustToFee,
      dustToChange,
      setDust,
      dustWay,
      setDustWay,
      totalChange,
      balanceAfterOutput,
      setFeeInput,
      setConfirmFee,
      setFeeState,
      customFee,
      setCustomFee,
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
