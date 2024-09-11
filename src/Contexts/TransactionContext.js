import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [fee, setFee] = useState(0);
  const [input, setInput] = useState(() => {
    const savedInput = localStorage.getItem('transactionInput');
    return savedInput ? JSON.parse(savedInput) : [];
  });

  const [edit, setEdit] = useState(false);

  const [outputs, setOutputs] = useState(() => {
    const savedOutputs = localStorage.getItem('transactionOutputs');
    return savedOutputs ? JSON.parse(savedOutputs) : [{
      address: '',
      amount: '',
      satsFormat: 'sats',
    }];
  });
  console.log('outputs:', JSON.stringify(outputs, null, 2));
  console.log('input:', JSON.stringify(input, null, 2));
  
  const [temporaryOutput, setTemporaryOutput] = useState({
    address: '',
    amount: '',
    satsFormat: '',
    index: '',
  });

  const [inputError, setInputError] = useState('');
  const [rawTx, setRawTx] = useState('');
  const [change, setChange] = useState(0);
  const [removeAllUtxo, setRemoveAllUtxo] = useState(false);

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

  
  const balance_inputs_outputs = useCallback(() => {
    const sum_inputs = input.reduce((sum, input) => sum + input.value, 0);
    const sum_outputs = outputs.map((output, index) => {
      if (temporaryOutput.index === index) {
        const amount = parseFloat(temporaryOutput.amount || 0);
        return temporaryOutput.coinFormat === 'btc' ? amount * 100000000 : amount;
      }
      return parseFloat(output.amount || 0);
    }).reduce((sum, amount) => sum + amount, 0);
    const difference = Math.max(sum_inputs - sum_outputs, 0);
    setChange(difference);
    return difference;
  }, [input, outputs, temporaryOutput, setChange]);

  useEffect(() => {
    balance_inputs_outputs();
  }, [input, outputs, balance_inputs_outputs]);


  const selectOptimalUtxo = useCallback(() => {
    const storedDetails = localStorage.getItem('transactionDetails');
    if (!storedDetails) return;

    const transactionDetails = JSON.parse(storedDetails);
    const totalOutputAmount = outputs.map((output, index) => {
      if (temporaryOutput.index === index) {
        const amount = parseFloat(temporaryOutput.amount || 0);
        return temporaryOutput.coinFormat === 'btc' ? amount * 100000000 : amount;
      }
      return parseFloat(output.amount || 0);
    }).reduce((sum, amount) => sum + amount, 0);

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
      setInputError('Недостаточно UTXO для покрытия суммы');
    }
  }, [outputs, temporaryOutput]);

  useEffect(() => {
    if (outputs.length > 0 && !removeAllUtxo) {
      selectOptimalUtxo();
    } else {
      setInput([]);
    }
  }, [outputs, selectOptimalUtxo, removeAllUtxo]);

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
      rawTx,
      removeAllUtxo,
      edit,
      inputError,
      fee,
      setFee,
      setInputError,
      setEdit,
      removeAll,
      updateInput,
      updateOutput,
      setTemporaryOutput,
      createRawTransaction,
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
