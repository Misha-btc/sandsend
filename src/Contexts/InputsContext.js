import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// Создаем контекст InputsContext
const InputsContext = createContext();

// Провайдер для контекста InputsContext
export const InputsProvider = ({ children }) => {
  const [inputs, setInputs] = useState({});

  const addInput = useCallback((utxo, rangeIndex, input) => {
    setInputs(prevInputs => {
      const newInputs = { ...prevInputs };
      if (!newInputs[utxo]) {
        newInputs[utxo] = {};
      }
      if (!newInputs[utxo][rangeIndex]) {
        newInputs[utxo][rangeIndex] = [];
      }
      newInputs[utxo][rangeIndex].push(input);
      return newInputs;
    });
  }, []);

  const updateInput = useCallback((utxo, rangeIndex, subIndex, input) => {
    setInputs(prevInputs => {
      const newInputs = { ...prevInputs };
      if (newInputs[utxo] && newInputs[utxo][rangeIndex]) {
        newInputs[utxo][rangeIndex][subIndex] = input;
      }
      return newInputs;
    });
  }, []);

  useEffect(() => {
    console.log('Current INPUTS:', inputs);
  }, [inputs]);

  return (
    <InputsContext.Provider value={{ inputs, addInput, updateInput }}>
      {children}
    </InputsContext.Provider>
  );
};

export const useInputs = () => useContext(InputsContext);