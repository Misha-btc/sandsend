import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import useCalculateChange from '../Hooks/useCalculateChange';
import useCoinSelect from '../Hooks/useCoinSelect';
const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [edit, setEdit] = useState(false);
  const [inputError, setInputError] = useState('');
  const [change, setChange] = useState(0);
  const [removeAllUtxo, setRemoveAllUtxo] = useState(false);

  

  const [input, setInput] = useState(() => {
    const savedInput = localStorage.getItem('transactionInput');
    return savedInput ? JSON.parse(savedInput) : [];
  });

  const [outputs, setOutputs] = useState(() => {
    const savedOutputs = localStorage.getItem('transactionOutputs');
    return savedOutputs ? JSON.parse(savedOutputs) : [{
      address: '',
      amount: '',
      satsFormat: 'sats',
    }];
  });
  
  const [temporaryOutput, setTemporaryOutput] = useState({
    address: '',
    amount: '',
    satsFormat: '',
    index: '',
  });

  const calculateChange = useCalculateChange();
  const coinSelect = useCoinSelect();

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

  const removeOutput = useCallback((index) => {
    setEdit(false);
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

  const removeAll = useCallback(() => {
    setRemoveAllUtxo(true);
    setEdit(false);
    setTemporaryOutput({
      address: '',
      amount: '',
      satsFormat: '',
      index: '',
    });
    setOutputs([]);
    setInput([]);
    localStorage.removeItem('transactionInput');
    localStorage.removeItem('transactionOutputs');
    localStorage.removeItem('transactionFee');
    setRemoveAllUtxo(false);
  }, []);

  const createEmptyOutput = useCallback((addEmptyOutput) => {
    if ((input.length > 0 && outputs.length === 0) || addEmptyOutput) {
      const newOutput = {
        address: '',
        amount: '',
        satsFormat: '',
      };
      if (outputs.length > 0) {
        setOutputs([...outputs, newOutput]);
      } else {
        setOutputs([newOutput]);
      }
    }
  }, [input, outputs]);

  useEffect(() => {
    createEmptyOutput();
  }, [input, createEmptyOutput]);

  useEffect(() => {
    calculateChange(input, outputs, temporaryOutput, setChange);
  }, [input, outputs, temporaryOutput, calculateChange]);

  useEffect(() => {
    if (outputs.length > 0 && !removeAllUtxo) {
      coinSelect(outputs, temporaryOutput, setInput, setInputError, inputRef);
    } else {
      setInput([]);
    }
  }, [outputs, coinSelect, temporaryOutput, removeAllUtxo]);

  const updateSpecificOutput = useCallback((index, newOutputData) => {
    setOutputs(prevOutputs => prevOutputs.map((output, i) => 
      i === index ? { ...output, ...newOutputData } : output
    ));
  }, []);

  const inputRef = useRef(input);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    localStorage.setItem('transactionInput', JSON.stringify(input));
  }, [input]);

  useEffect(() => {
    localStorage.setItem('transactionOutputs', JSON.stringify(outputs));
  }, [outputs]);

  useEffect(() => {
    if (outputs.length === 0) {
      setOutputs([{
        address: '',
        amount: '',
        satsFormat: '',
      }]);
    }
  }, [outputs]);

  return (
    <TransactionContext.Provider value={{
      input,
      outputs,
      temporaryOutput,
      change,
      removeAllUtxo,
      edit,
      inputError,
      setInputError,
      setEdit,
      removeAll,
      updateInput,
      updateOutput,
      setTemporaryOutput,
      removeOutput,
      removeInput,
      updateSpecificOutput,
      setRemoveAllUtxo,
      createEmptyOutput,
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
export const useTransaction = () => useContext(TransactionContext);
