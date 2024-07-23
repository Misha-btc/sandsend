import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Создаем контекст ChosenUtxoContext
const ChosenUtxoContext = createContext();

// Провайдер для контекста ChosenUtxoContext
export const ChoiceProvider = ({ children }) => {
  const [choice, setChoice] = useState(() => {
    const storedChoice = localStorage.getItem('choice');
    return storedChoice ? JSON.parse(storedChoice) : {};
  });

  const addToChoice = (utxo, detail) => {
    const rangeValue = {};
    
    if (detail.sat_ranges) {
      detail.sat_ranges.forEach((range, index) => {
        rangeValue[index] = range[1] - range[0];
      });
    }

    detail.rangeValue = rangeValue;

    setChoice(prevChoice => {
      const newChoice = { ...prevChoice, [utxo]: detail };
      localStorage.setItem('choice', JSON.stringify(newChoice));

      return newChoice;
    });
  };

  const removeFromChoice = (utxo) => {
    setChoice(prevChoice => {
      const { [utxo]: _, ...newChoice } = prevChoice;
      localStorage.setItem('choice', JSON.stringify(newChoice));
      return newChoice;
    });
  };

  const addToRanges = useCallback((utxo, rangeIndex, ranges) => {
    setChoice(prevChoice => {
      const utxoDetail = prevChoice[utxo] || {};
      const currentRanges = utxoDetail.new_ranges || {};

      const newRanges = {
        ...currentRanges,
        [rangeIndex]: ranges
      };

      const newChoice = {
        ...prevChoice,
        [utxo]: {
          ...utxoDetail,
          new_ranges: newRanges,
        }
      };

      localStorage.setItem('choice', JSON.stringify(newChoice));
      return newChoice;
    });
  }, []);

  const removeFromRanges = useCallback((utxo, rangeIndex) => {
    setChoice(prevChoice => {
      const utxoDetail = prevChoice[utxo] || {};
      const currentRanges = utxoDetail.new_ranges || {};

      const { [rangeIndex]: _, ...newRanges } = currentRanges;

      const newUtxoDetail = Object.keys(newRanges).length === 0
        ? { ...utxoDetail, new_ranges: undefined }
        : { ...utxoDetail, new_ranges: newRanges };

      const newChoice = {
        ...prevChoice,
        [utxo]: newUtxoDetail
      };

      localStorage.setItem('choice', JSON.stringify(newChoice));
      return newChoice;
    });
  }, []);

  useEffect(() => {
    console.log('Current choice:', choice);
  }, [choice]);

  return (
    <ChosenUtxoContext.Provider value={{ choice, addToChoice, removeFromChoice, addToRanges, removeFromRanges}}>
      {children}
    </ChosenUtxoContext.Provider>
  );
};

export const useChoice = () => {
  return useContext(ChosenUtxoContext);
};