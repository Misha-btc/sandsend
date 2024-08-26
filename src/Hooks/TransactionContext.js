import React, { createContext, useState, useContext, useCallback } from 'react';

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

  const removeInput = useCallback((key) => {
    setInput(prevInput => prevInput.filter(input => `${input.txid}:${input.vout}` !== key));
  }, []);

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