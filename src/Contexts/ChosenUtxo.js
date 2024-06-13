import React, { createContext, useState, useContext } from 'react';

// Создаем контекст
const ChosenUtxoContext = createContext();

// Провайдер для контекста
export const ChoiceProvider = ({ children }) => {
    const [choice, setChoice] = useState(() => {
        const storedChoice = localStorage.getItem('choice');
        return storedChoice ? JSON.parse(storedChoice) : [];
    });

    const addToChoice = (utxo) => {
        setChoice(prevChoice => {
            const newChoice = [...prevChoice, utxo];
            localStorage.setItem('choice', JSON.stringify(newChoice));
            return newChoice;
        });
    };

    const removeFromChoice = (utxo) => {
        setChoice(prevChoice => {
            const newChoice = prevChoice.filter(item => item.txid !== utxo.txid || item.vout !== utxo.vout);
            localStorage.setItem('choice', JSON.stringify(newChoice));
            return newChoice;
        });
    };

    return (
        <ChosenUtxoContext.Provider value={{ choice, addToChoice, removeFromChoice }}>
            {children}
        </ChosenUtxoContext.Provider>
    );
};

// Хук для использования контекста выбора
export const useChoice = () => {
    return useContext(ChosenUtxoContext);
};