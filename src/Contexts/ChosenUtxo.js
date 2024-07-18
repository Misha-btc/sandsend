import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Создаем контекст ChosenUtxoContext
const ChosenUtxoContext = createContext();

// Провайдер для контекста ChosenUtxoContext
export const ChoiceProvider = ({ children }) => {
    // Инициализируем состояние choice из localStorage, если оно существует, иначе пустым объектом
    const [choice, setChoice] = useState(() => {
        const storedChoice = localStorage.getItem('choice');
        return storedChoice ? JSON.parse(storedChoice) : {};
    });

    // Функция для добавления UTXO в выбор
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

    // Функция для удаления UTXO из выбора
    const removeFromChoice = (utxo) => {
        setChoice(prevChoice => {
            const { [utxo]: _, ...newChoice } = prevChoice;
            localStorage.setItem('choice', JSON.stringify(newChoice));
            return newChoice;
        });
    };

    // Функция для добавления диапазонов к UTXO
    const addToRanges = useCallback((utxo, rangeIndex, ranges) => {
        setChoice(prevChoice => {
            const utxoDetail = prevChoice[utxo] || {}; // Достаем текущие детали UTXO или создаем новый объект
            const currentRanges = utxoDetail.new_ranges || {}; // Достаем текущие диапазоны или создаем новый объект

            // Обновляем диапазоны для указанного индекса
            const newRanges = {
                ...currentRanges,
                [rangeIndex]: ranges
            };

            // Обновляем состояние choice с новыми диапазонами
            const newChoice = {
                ...prevChoice,
                [utxo]: {
                    ...utxoDetail,
                    new_ranges: newRanges,
                }
            };


            localStorage.setItem('choice', JSON.stringify(newChoice)); // Сохраняем в localStorage
            return newChoice;
        });
    }, []);

    // Функция для удаления диапазонов из UTXO
    const removeFromRanges = useCallback((utxo, rangeIndex) => {
        setChoice(prevChoice => {
            const utxoDetail = prevChoice[utxo] || {}; // Достаем текущие детали UTXO или создаем новый объект
            const currentRanges = utxoDetail.new_ranges || {}; // Достаем текущие диапазоны или создаем новый объект

            // Удаляем указанный диапазон
            const { [rangeIndex]: _, ...newRanges } = currentRanges;

            // Если диапазоны пусты, удаляем объект new_ranges
            const newUtxoDetail = Object.keys(newRanges).length === 0
                ? { ...utxoDetail, new_ranges: undefined }
                : { ...utxoDetail, new_ranges: newRanges };

            // Обновляем состояние choice
            const newChoice = {
                ...prevChoice,
                [utxo]: newUtxoDetail
            };

            localStorage.setItem('choice', JSON.stringify(newChoice)); // Сохраняем в localStorage
            return newChoice;
        });
    }, []);

    // Логирование текущего состояния choice для отладки
    useEffect(() => {
        console.log('Current choice:', choice);
    }, [choice]);

    return (
        // Возвращаем провайдер контекста с переданными значениями состояния и функциями
        <ChosenUtxoContext.Provider value={{ choice, addToChoice, removeFromChoice, addToRanges, removeFromRanges }}>
            {children} {/* Рендерим дочерние компоненты */}
        </ChosenUtxoContext.Provider>
    );
};

// Хук для использования контекста выбора
export const useChoice = () => {
    return useContext(ChosenUtxoContext); // Используем useContext для доступа к значению контекста
};