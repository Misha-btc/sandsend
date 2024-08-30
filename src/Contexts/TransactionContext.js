import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [input, setInput] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [fee, setFee] = useState('');
  const [rawTx, setRawTx] = useState('');
  const [change, setChange] = useState(0);

  console.log('input',input);
  console.log('outputs',outputs);

  const updateInput = useCallback((newInput) => {
    setInput(prevInput => {
      const updatedInput = Array.isArray(prevInput) ? [...prevInput, newInput] : [newInput];
      // Присваиваем тип 'selected' всем имеющимся инпутам
      return updatedInput.map(input => ({ ...input, type: 'selected' }));
    });
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

  const createEmptyOutput = useCallback(() => {
    if (input.length > 0 && outputs.length === 0) {
      const newOutput = {
        address: '',
        amount: 0,
        satsFormat: 'sats',
      };
      setOutputs([newOutput]);
    }
  }, [input, outputs]);

  useEffect(() => {
    createEmptyOutput();
  }, [input, createEmptyOutput]);

  
  const balance_inputs_outputs = useCallback(() => {
    const sum_inputs = input.reduce((sum, input) => sum + input.value, 0);
    const sum_outputs = outputs.reduce((sum, output) => sum + output.amount, 0);
    console.log('sum_inputs', sum_inputs);
    const difference = Math.max(sum_inputs - sum_outputs, 0);
    setChange(difference);
    return difference;
  }, [input, outputs, setChange]);

  useEffect(() => {
    balance_inputs_outputs();
  }, [input, outputs, balance_inputs_outputs]);


  const selectOptimalUtxo = useCallback(() => {
    const storedDetails = localStorage.getItem('transactionDetails');
    if (!storedDetails) return;

    const transactionDetails = JSON.parse(storedDetails);
    const totalOutputAmount = outputs.reduce((sum, output) => sum + output.amount, 0);
    console.log('totalOutputAmount', totalOutputAmount);

    // Используем inputRef.current вместо input
    let selectedUtxos = inputRef.current.filter(utxo => utxo.type === 'selected');
    let selectedAmount = selectedUtxos.reduce((sum, utxo) => sum + utxo.value, 0);

    const utxosArray = Object.entries(transactionDetails)
      .filter(([addressType]) => addressType.includes(':payment'))
      .flatMap(([_, utxos]) => Object.entries(utxos).map(([utxoKey, utxoDetails]) => ({
        ...utxoDetails,
        txid: utxoKey.split(':')[0],
        vout: parseInt(utxoKey.split(':')[1]),
        key: utxoKey,
        type: 'auto'
      })))
      .sort((a, b) => b.value - a.value);

    const availableUtxos = utxosArray.filter(utxo => 
      !selectedUtxos.some(selectedUtxo => selectedUtxo.txid === utxo.txid && selectedUtxo.vout === utxo.vout)
    );

    // Добавляем автоматические UTXO только если нужно
    for (const utxo of availableUtxos) {
      if (selectedAmount >= totalOutputAmount) break;
      selectedUtxos.push(utxo);
      selectedAmount += utxo.value;
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
    } else {
      setInput([]);
    }
  }, [outputs, selectOptimalUtxo]);

  const updateSpecificOutput = useCallback((index, newOutputData) => {
    setOutputs(prevOutputs => prevOutputs.map((output, i) => 
      i === index ? { ...output, ...newOutputData } : output
    ));
  }, []);

  const inputRef = useRef(input);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  return (
    <TransactionContext.Provider value={{
      input,
      outputs,
      fee,
      change,
      rawTx,
      updateInput,
      updateOutput,
      setFee,
      createRawTransaction,
      removeOutput,
      removeInput,
      updateSpecificOutput,
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
export const useTransaction = () => useContext(TransactionContext);
