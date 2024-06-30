import React, { createContext, useState, useContext } from 'react';

// Создаем контекст
const ChosenRangeContext = createContext();

// Провайдер для контекста
export const ChoiceRangeProvider = ({ children }) => {
    const [choiceRange, setChoiceRange] = useState(() => {
        const storedChoiceRange = localStorage.getItem('myData');
        return storedChoiceRange ? JSON.parse(storedChoiceRange) : {};
    });

    const addToChoiceRange = (utxo, ranges) => {
        setChoiceRange(prevChoice => {
            const newChoice = [...prevChoice, utxo];
            localStorage.setItem('myData', JSON.stringify(newChoice));
            return newChoice;
        });
    };

    const removeFromChoiceRange = (utxo) => {
        setChoiceRange(prevChoice => {
            const { [utxo]: _, ...newChoice } = prevChoice;
            localStorage.setItem('myData', JSON.stringify(newChoice));
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
export const useRange= () => {
    return useContext(ChosenRangeContext);
};