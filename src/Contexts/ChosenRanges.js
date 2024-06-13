import React, { createContext, useState, useContext } from 'react';

// Создаем контекст
const ChosenRangeContext = createContext();

// Провайдер для контекста
export const ChoiceRangeProvider = ({ children }) => {
    const [choiceRange, setChoiceRange] = useState(() => {
        const storedChoiceRange = localStorage.getItem('choice');
        return storedChoiceRange ? JSON.parse(storedChoiceRange) : [];
    });

    const addToChoiceRange = (utxo) => {
        setChoiceRange(prevChoice => {
            const newChoice = [...prevChoice, utxo];
            localStorage.setItem('choice', JSON.stringify(newChoice));
            return newChoice;
        });
    };

    const removeFromChoiceRange = (utxo) => {
        setChoiceRange(prevChoice => {
            const newChoice = prevChoice.filter(item => item.txid !== utxo.txid || item.vout !== utxo.vout);
            localStorage.setItem('choice', JSON.stringify(newChoice));
            return newChoice;
        });
    };

    return (
        <ChosenRangeContext.Provider value={{ choiceRange, addToChoiceRange, removeFromChoiceRange }}>
            {children}
        </ChosenRangeContext.Provider>
    );
};

// Хук для использования контекста выбора
export const useChoice = () => {
    return useContext(ChosenRangeContext);
};