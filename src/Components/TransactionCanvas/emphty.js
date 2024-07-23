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
        const newInputs = { ...prevInputs }; // Создание нового объекта для входных данных на основе предыдущих входных данных
  
        Object.keys(data.new_ranges).forEach((key) => { // Проход по ключам новых диапазонов
          if (data.new_ranges[key].length > 0) { // Проверка наличия элементов в текущем ключе диапазона
            newInputs[key] = data.new_ranges[key].map((range, index) => { // Проход по каждому диапазону в текущем ключе
              let newInput = {}; // Инициализация нового объекта для входных данных
  
              if (inputs[key] && inputs[key][index] && data.sat_ranges[key]) { // Проверка наличия данных в inputs и sat_ranges для текущего ключа и индекса
                let remainingSats = inputs[key][index].sats - (range.max - range.min); // Расчет оставшихся сатоши после вычитания диапазона
                let currentKey = key; // Инициализация текущего ключа
                let currentIndex = index; // Инициализация текущего индекса
                let startRangeIndex = key; // Установка начального индекса диапазона
                let endRangeIndex = key; // Инициализация конечного индекса диапазона
                let ranges = {}; // Инициализация объекта для хранения всех промежуточных диапазонов
                let rangeCounter = 0; // Счетчик для индексов в ranges
  
                while (remainingSats > 0) { // Цикл, продолжающийся, пока остаются сатоши
                  if (remainingSats > (data.sat_ranges[currentKey][1] - data.sat_ranges[currentKey][0])) { // Если оставшихся сатоши больше, чем текущий диапазон
                    ranges[rangeCounter] = {
                      min: data.sat_ranges[currentKey][0],
                      max: data.sat_ranges[currentKey][1],
                      sats: data.sat_ranges[currentKey][1] - data.sat_ranges[currentKey][0],
                    };
                    remainingSats -= (data.sat_ranges[currentKey][1] - data.sat_ranges[currentKey][0]); // Вычитаем текущий диапазон из оставшихся сатоши
                    currentKey++; // Переход к следующему ключу диапазона
                    currentIndex = 0; // Сбрасываем индекс к 0, так как переходим к следующему диапазону
                    rangeCounter++; // Увеличиваем счетчик диапазонов
                  } else {
                    ranges[rangeCounter] = {
                      min: data.sat_ranges[currentKey][0],
                      max: data.sat_ranges[currentKey][0] + remainingSats,
                      sats: remainingSats,
                    };
                    endRangeIndex = currentKey; // Устанавливаем конечный индекс диапазона
                    remainingSats = 0; // Обнуляем оставшиеся сатоши, так как они распределены
                  }
                }
  
                newInput = {
                  ranges: ranges, // Добавляем все промежуточные диапазоны
                  min: range.min,
                  max: data.sat_ranges[currentKey][1],
                  sats: inputs[key][index].sats,
                  address: inputs[key][index].address,
                  startRangeIndex: startRangeIndex,
                  endRangeIndex: endRangeIndex,
                };
              } else { // Если данные отсутствуют в inputs или sat_ranges
                newInput = { // Создание нового объекта с данными по умолчанию
                  ranges: {
                    0: {
                      min: range.min,
                      max: range.max,
                      sats: range.max - range.min,
                    },
                  },
                  min: range.min,
                  max: range.max,
                  sats: range.max - range.min,
                  address: '',
                  startRangeIndex: key,
                  endRangeIndex: key,
                };
              }
  
              return newInput; // Возвращаем новый объект для текущего диапазона
            });
          }
        });
  
        return newInputs; // Возвращаем обновленные входные данные
      });
  
      setRangeIndices(Object.keys(data.new_ranges)); // Установка индексов диапазонов на основе новых данных
    }
  }, [data]); // Эффект зависит от изменений в data

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

      // Обновление new_ranges в choice через addToRanges
      const newRanges = updatedInputs[mainIndex].map(input => ({
        min: input.min, // нужно чтобы мин и макс отображали индексы из разных ренж индексов или даже ютхо, если полученый инпут больше содержимого rangeindex
        max: input.min + input.sats, // нужно
        sats: input.sats,
        address: input.address
      }));

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