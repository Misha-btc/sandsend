import React, { useState, useEffect } from "react";
import { useChoice } from '../../Contexts/ChosenUtxo';

export function RangeOutput({ dataKey, removeInfo }) {
  const { choice, addToRanges } = useChoice(); // Получение данных из контекста выбора
  const data = choice ? choice[dataKey] : null; // Получение данных для конкретного ключа

  const [inputs, setInputs] = useState({}); // Состояние для хранения входных данных
  const [rangeIndices, setRangeIndices] = useState([]); // Состояние для хранения индексов диапазонов
  console.log(`inputs`, inputs);

  useEffect(() => {
    if (data && data.new_ranges) { // Проверка наличия данных и новых диапазонов
      setInputs((prevInputs) => {
        const newInputs = { ...prevInputs }; // Создание нового объекта для входных данных
        Object.keys(data.new_ranges).forEach((key) => { // Проход по ключам новых диапазонов
          if (data.new_ranges[key].length > 0) {
            newInputs[key] = data.new_ranges[key].map((range) => ({ // Инициализация новых входных данных
              min: range.min,
              max: range.max,
              sats: range.max - range.min, // Значение сатоши только для первого диапазона
              address: '', // Адрес
              startRangeIndex: key,
              endRangeIndex: '',
            }));
          }
        });
        return newInputs;
      });

      setRangeIndices(Object.keys(data.new_ranges)); // Установка индексов диапазонов
    }
  }, [data]);

  useEffect(() => {
    if (data && data.new_ranges) { // Проверка наличия данных и новых диапазонов
      setInputs((prevInputs) => { // Установка новых входных данных
        const newInputs = { ...prevInputs }; // Создание копии предыдущих входных данных
        Object.keys(prevInputs).forEach((key) => { // Проход по ключам предыдущих входных данных
          if (!data.new_ranges[key]) { // Если ключ отсутствует в новых диапазонах
            delete newInputs[key]; // Удаление ключа из входных данных
          }
        });
        return newInputs; // Возвращение новых входных данных
      });

      setRangeIndices(Object.keys(data.new_ranges)); // Установка индексов диапазонов
    }
  }, [data]); // Зависимость от данных

  useEffect(() => {
    if (removeInfo.mainIndex !== null && removeInfo.subIndex !== null) { // Проверка наличия значений mainIndex и subIndex
      console.log(`remove`, removeInfo);
      setInputs((prevInputs) => { // Установка новых входных данных
        const newInputs = { ...prevInputs }; // Создание копии предыдущих входных данных
        const { mainIndex, subIndex } = removeInfo; // Деструктуризация значений mainIndex и subIndex

        if (newInputs[mainIndex] && Array.isArray(newInputs[mainIndex]) && newInputs[mainIndex][subIndex] !== undefined) { // Проверка наличия данных по индексам
          newInputs[mainIndex].splice(subIndex, 1); // Удаление данных по индексу
        }

        if (newInputs[mainIndex].length === 0) {
          delete newInputs[mainIndex]; // Удаление ключа, если массив пустой
        }

        return newInputs; // Возвращение новых входных данных
      });

      setRangeIndices((prevIndices) => { // Установка новых индексов диапазонов
        const updatedIndices = [...prevIndices]; // Создание копии предыдущих индексов
        if (updatedIndices[removeInfo.mainIndex] && Array.isArray(updatedIndices[removeInfo.mainIndex]) && updatedIndices[removeInfo.mainIndex][removeInfo.subIndex] !== undefined) { // Проверка наличия данных по индексам
          updatedIndices[removeInfo.mainIndex].splice(removeInfo.subIndex, 1); // Удаление данных по индексу
          if (updatedIndices[removeInfo.mainIndex].length === 0) { // Проверка пустоты массива по индексу
            delete updatedIndices[removeInfo.mainIndex]; // Удаление пустого индекса
          }
        }
        return Object.keys(updatedIndices); // Возвращение ключей обновленных индексов
      });
    }
  }, [removeInfo]); // Зависимость от removeInfo

  if (!data || !data.new_ranges) { // Проверка наличия данных и новых диапазонов
    return null; // Возвращение null, если данных нет
  }

  const handleInputChange = (mainIndex, subIndex, field, value) => {
    const intValue = field === 'sats' ? parseInt(value, 10) : value;

    setInputs((prevInputs) => { // Установка новых входных данных
      const updatedInputs = { ...prevInputs }; // Создание копии предыдущих входных данных

      if (!updatedInputs[mainIndex]) { // Если ключ отсутствует в предыдущих входных данных
        updatedInputs[mainIndex] = []; // Инициализация массива для ключа
      }
      if (!updatedInputs[mainIndex][subIndex]) { // Если индекс отсутствует в массиве
        updatedInputs[mainIndex][subIndex] = { sats: '', address: '' }; // Инициализация данных по индексу
      }
      updatedInputs[mainIndex][subIndex][field] = intValue; // Обновление значения по полю
      console.log(`sats`, updatedInputs[mainIndex][subIndex].sats);

      let remainingSats = updatedInputs[mainIndex][subIndex].sats;
      const newRanges = [];

      // Распределение сатоши по диапазонам
      data.new_ranges[mainIndex].forEach((range, index) => {
        if (remainingSats > 0) {
          const maxSatsInRange = range.max - range.min;
          const satsToAllocate = Math.min(maxSatsInRange, remainingSats);
          newRanges.push({
            min: range.min,
            max: range.min + satsToAllocate,
            sats: satsToAllocate,
            address: updatedInputs[mainIndex][subIndex].address
          });
          remainingSats -= satsToAllocate;
        }
      });

      addToRanges(dataKey, mainIndex, newRanges);

      return updatedInputs; // Возвращение новых входных данных
    });
  };

  return (
    <div>
      {rangeIndices.map((rangeIndex) => ( // Проход по индексам диапазонов
        data.new_ranges[rangeIndex]?.map((range, subIndex) => ( // Проход по индексам новых диапазонов
          <div key={`${rangeIndex}-${subIndex}`} className="relative"> {/* Установка ключа и класса для элемента */}
            <div className="divide-solid divide-orange-600 divide-y flex border-4 bg-zinc-800 border-orange-600 p-2 rounded-xl mb-4 flex-col"> {/* Классы для стилизации */}
              <input
                className="text-center bg-zinc-800 text-white"
                type="number"
                placeholder="sats"
                value={inputs[rangeIndex]?.[subIndex]?.sats || ''} // Значение для input поля
                onChange={(e) => handleInputChange(rangeIndex, subIndex, 'sats', e.target.value)} // Обработчик изменения значения
              />
              <input
                className="text-center bg-zinc-800 text-white"
                type="text"
                placeholder="address"
                value={inputs[rangeIndex]?.[subIndex]?.address || ''} // Значение для input поля
                onChange={(e) => handleInputChange(rangeIndex, subIndex, 'address', e.target.value)} // Обработчик изменения значения
              />
            </div>
          </div>
        ))
      ))}
    </div>
  );
}

export default RangeOutput; // Экспорт компонента по умолчанию