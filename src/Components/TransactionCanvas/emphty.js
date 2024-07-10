import React, { useState, useEffect } from "react";
import { useChoice } from '../../Contexts/ChosenUtxo';
import Button from '../Button'

// Компонент для управления диапазонами и адресами
export function RangeInput({ dataKey, children, rangeIndex }) {
  const minAllowed = children[0]; // Минимально допустимое значение диапазона
  const maxAllowed = children[1]; // Максимально допустимое значение диапазона
  const satsValue = children[1] - children[0];

  // Начальный диапазон
  const initialRange = [{ min: minAllowed, max: maxAllowed, sats: '', address: '' }];

  const { addToRanges } = useChoice(); // Достаем функцию addToRanges из контекста

  // Функция для получения начальных диапазонов из localStorage или использования initialRange
  const initialRanges = () => {
    const savedData = localStorage.getItem('myData'); // Получаем данные из localStorage
    const parsedData = savedData ? JSON.parse(savedData) : {}; // Парсим данные из localStorage или создаем пустой объект

    if (!parsedData[dataKey]) { // Если нет данных по данному ключу
      parsedData[dataKey] = {}; // Создаем пустой объект по ключу
    }

    if (!parsedData[dataKey][rangeIndex]) { // Если нет данных по данному индексу диапазона
      parsedData[dataKey][rangeIndex] = initialRange; // Создаем начальный диапазон
    }

    return parsedData[dataKey][rangeIndex]; // Возвращаем данные по ключу и индексу диапазона
  };

  const [ranges, setRanges] = useState(initialRanges); // Создаем состояние для диапазонов
  const [tr2RangeLimit, setTr2RangeLimit] = useState(0); // Создаем состояние для лимита диапазонов

  useEffect(() => {
    // Обновляем данные в localStorage при изменении ranges
    const updatedData = JSON.parse(localStorage.getItem('myData')) || {};

    if (!updatedData[dataKey]) {
      updatedData[dataKey] = {};
    }

    updatedData[dataKey][rangeIndex] = ranges;
    localStorage.setItem('myData', JSON.stringify(updatedData));
    console.log('Data saved to localStorage:', updatedData);
  }, [ranges, dataKey, rangeIndex]);

  useEffect(() => {
    // Вычисляем лимит диапазонов на основе minAllowed и maxAllowed
    const totalRange = maxAllowed - minAllowed;
    let limit = 0;

    if (totalRange > 330) {
      const tr2MaxRanges = Math.floor(totalRange / 330);
      if (Number.isInteger(totalRange / 330)) {
        limit = tr2MaxRanges + 1;
      } else {
        const satsRemainder = (totalRange / 330) % 1 * 330;
        if (satsRemainder === 1) {
          limit = tr2MaxRanges + 1;
        } else if (satsRemainder >= 2) {
          limit = tr2MaxRanges + 2;
        }
      }
    } else {
      if (totalRange === 1) {
        limit = 1;
      } else if (totalRange >= 2 && totalRange <= 330) {
        limit = 2;
      }
    }

    setTr2RangeLimit(limit); // Устанавливаем лимит диапазонов
  }, [minAllowed, maxAllowed]);


  useEffect(() => {
    // Обновляем контекст при изменении ranges
    addToRanges(dataKey, rangeIndex, ranges);
  }, [ranges, dataKey, rangeIndex, addToRanges]);

  return (
      <div className="p-2 m-2 border flex-row flex justify-between rounded-xl">
        <div>
          {children.join(' - ')} {`(${satsValue} sats)`}
        </div>
        <div className="">
          <Button
            title="+" 
            className="bg-black text-white rounded-full w-6 h-6 text-sm leading-none"
                        
          />
        </div>
      </div>
  );
}

export default RangeInput;