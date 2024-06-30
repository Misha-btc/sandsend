import React, { createContext, useState, useContext, useEffect } from 'react';

// Создаем контекст
const ChosenUtxoContext = createContext(); // Создаем контекст для хранения выбранных UTXO

// Провайдер для контекста
export const ChoiceProvider = ({ children }) => {
    // Инициализируем состояние choice из localStorage, если оно существует, иначе пустым объектом
    const [choice, setChoice] = useState(() => {
        const storedChoice = localStorage.getItem('choice'); // Получаем данные из localStorage
        return storedChoice ? JSON.parse(storedChoice) : {}; // Парсим данные или возвращаем пустой объект
    });

    // Функция для добавления UTXO в выбор
    const addToChoice = (utxo, detail) => {
        setChoice(prevChoice => {
            const newChoice = { ...prevChoice, [utxo]: detail }; // Создаем новый объект с добавленным UTXO
            localStorage.setItem('choice', JSON.stringify(newChoice)); // Сохраняем новый выбор в localStorage
            return newChoice; // Возвращаем обновленный выбор
        });
    };

    // Функция для удаления UTXO из выбора
    const removeFromChoice = (utxo) => {
        setChoice(prevChoice => {
            const { [utxo]: _, ...newChoice } = prevChoice; // Создаем новый объект без удаленного UTXO
            localStorage.setItem('choice', JSON.stringify(newChoice)); // Сохраняем обновленный выбор в localStorage
            return newChoice; // Возвращаем обновленный выбор
        });
    };
    useEffect(() => {
        console.log('Current choice:', choice); // Лог текущего состояния choice
    }, [choice]);

    return (
        // Возвращаем провайдер контекста с переданными значениями состояния и функциями
        <ChosenUtxoContext.Provider value={{ choice, addToChoice, removeFromChoice }}>
            {children} {/* Рендерим дочерние компоненты */}
        </ChosenUtxoContext.Provider>
    );
};

// Хук для использования контекста выбора
export const useChoice = () => {
    return useContext(ChosenUtxoContext); // Используем useContext для доступа к значению контекста
};