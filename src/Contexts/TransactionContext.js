import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [input, setInput] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [fee, setFee] = useState('');
  const [rawTx, setRawTx] = useState('');
  console.log('input',input);
  console.log('outputs',outputs);

  const updateInput = useCallback((newInput) => {
    setInput(prevInput => Array.isArray(prevInput) ? [...prevInput, newInput] : [newInput]);
  }, []);

  const updateOutput = useCallback((newOutput) => {
    setOutputs(prevOutputs => Array.isArray(prevOutputs) ? [...prevOutputs, newOutput] : [newOutput]);
  }, []);

  const createRawTransaction = useCallback(() => {
    setRawTx('Сырая транзакция будет здесь');
  }, []);

  const removeOutput = useCallback((index) => {
    setOutputs(prevOutputs => prevOutputs.filter((_, i) => i !== index));
  }, []);

  const removeInput = useCallback((keyOrIndex) => {
    setInput(prevInput => {
      if (typeof keyOrIndex === 'string') {
        // Удаление по ключу
        return prevInput.filter(input => `${input.txid}:${input.vout}` !== keyOrIndex);
      } else if (typeof keyOrIndex === 'number') {
        // Удаление по индексу
        return prevInput.filter((_, index) => index !== keyOrIndex);
      }
      return prevInput;
    });
  }, []);

  
  const selectOptimalUtxo = useCallback(() => {
    const storedDetails = localStorage.getItem('transactionDetails');
    if (!storedDetails) return;

    const transactionDetails = JSON.parse(storedDetails);
    const totalOutputAmount = outputs.reduce((sum, output) => sum + output.amount, 0);
    console.log('totalOutputAmount', totalOutputAmount);

    let selectedUtxos = [];
    let selectedAmount = 0;

    const utxosArray = Object.entries(transactionDetails)
      .filter(([addressType]) => addressType.includes(':payment'))
      .flatMap(([_, utxos]) => Object.entries(utxos).map(([utxoKey, utxoDetails]) => ({
        ...utxoDetails,
        txid: utxoKey.split(':')[0],
        vout: parseInt(utxoKey.split(':')[1]),
        key: utxoKey
      })));

    for (const utxo of utxosArray) {
      selectedUtxos.push(utxo);
      selectedAmount += utxo.value;
      if (selectedAmount >= totalOutputAmount) break;
    }

    if (selectedAmount >= totalOutputAmount) {
      setInput(selectedUtxos);
    } else {
      console.log('Недостаточно UTXO для покрытия суммы');
    }
  }, [outputs]);

  useEffect(() => {
    if (outputs.length > 0) {
      selectOptimalUtxo();
    }
  }, [outputs, selectOptimalUtxo]);

  return (
    <TransactionContext.Provider value={{
      input,
      outputs,
      fee,
      rawTx,
      updateInput,
      updateOutput,
      setFee,
      createRawTransaction,
      removeOutput,
      removeInput,
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext);