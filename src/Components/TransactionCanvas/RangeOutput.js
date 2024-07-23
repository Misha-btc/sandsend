import React, { useState, useEffect } from "react";
import { useChoice } from '../../Contexts/ChosenUtxo';

// Компонент для отображения и управления диапазонами сатоши
export function RangeOutput({ dataKey, removeInfo }) {
  const { choice } = useChoice(); // Получение данных из контекста выбора
  const data = choice ? choice[dataKey] : null; // Получение данных для конкретного ключа

  const [inputs, setInputs] = useState({}); // Состояние для хранения входных данных
  const [rangeIndices, setRangeIndices] = useState([]); // Состояние для хранения индексов диапазонов

  console.log(`INPUT`, inputs); // Лог для отладки

  // Эффект для инициализации состояния inputs при изменении данных
  useEffect(() => {
    if (data && data.new_ranges) {
      setInputs((prevInputs) => {
        const newInputs = { ...prevInputs };

        // Проход по ключам новых диапазонов
        Object.keys(data.new_ranges).forEach((key) => {
          if (data.new_ranges[key].length > 0) {
            // Проход по каждому диапазону в текущем ключе
            newInputs[key] = data.new_ranges[key].map((range, index) => {
              let newInput = {};
              let ranges = {};
              let remainingSats = inputs[key]?.[index]?.sats || (range.max - range.min);
              let currentKey = parseInt(key);
              let rangeCounter = 0;
              let startRangeIndex = key;
              let endRangeIndex = key;

              // Инициализация первого диапазона
              const initialRange = Math.min(remainingSats, range.max - range.min);
              ranges[rangeCounter] = {
                min: range.min,
                max: range.min + initialRange,
                sats: initialRange,
              };

              remainingSats -= initialRange;
              rangeCounter++;

              // Обработка оставшихся сатоши
              while (remainingSats > 0) {
                const nextRange = data.new_ranges[currentKey + 1]?.[0] || data.sat_ranges[currentKey + 1];
                if (nextRange) {
                  const nextRangeSize = nextRange.max ? (nextRange.max - nextRange.min) : (nextRange[1] - nextRange[0]);

                  if (remainingSats > nextRangeSize) {
                    ranges[rangeCounter] = {
                      min: nextRange.min || nextRange[0],
                      max: nextRange.max || nextRange[1],
                      sats: nextRangeSize,
                    };
                    remainingSats -= nextRangeSize;
                    currentKey++;
                    rangeCounter++;
                  } else {
                    ranges[rangeCounter] = {
                      min: nextRange.min || nextRange[0],
                      max: (nextRange.min || nextRange[0]) + remainingSats,
                      sats: remainingSats,
                    };
                    remainingSats = 0;
                    endRangeIndex = currentKey + 1;
                  }
                } else {
                  remainingSats = 0;
                }
              }

              newInput = {
                ranges: ranges,
                address: inputs[key]?.[index]?.address || '',
                startRangeIndex: startRangeIndex,
                endRangeIndex: endRangeIndex,
                sats: inputs[key]?.[index]?.sats || (range.max - range.min),
              };

              return newInput;
            });
          }
        });

        return newInputs;
      });

      setRangeIndices(Object.keys(data.new_ranges));
    }
  }, [data]);

  // Эффект для обновления состояния inputs при изменении данных
  useEffect(() => {
    if (data && data.new_ranges) {
      setInputs((prevInputs) => {
        const newInputs = { ...prevInputs };
        Object.keys(prevInputs).forEach((key) => {
          if (!data.new_ranges[key]) {
            delete newInputs[key];
          }
        });
        return newInputs;
      });

      setRangeIndices(Object.keys(data.new_ranges));
    }
  }, [data]);

  // Эффект для удаления информации из состояния inputs по removeInfo
  useEffect(() => {
    if (removeInfo.mainIndex !== null && removeInfo.subIndex !== null) {
      setInputs((prevInputs) => {
        const newInputs = { ...prevInputs };
        const { mainIndex, subIndex } = removeInfo;

        if (newInputs[mainIndex] && Array.isArray(newInputs[mainIndex]) && newInputs[mainIndex][subIndex] !== undefined) {
          newInputs[mainIndex].splice(subIndex, 1);
        }

        if (newInputs[mainIndex].length === 0) {
          delete newInputs[mainIndex];
        }

        return newInputs;
      });

      setRangeIndices((prevIndices) => {
        const updatedIndices = [...prevIndices];
        if (updatedIndices[removeInfo.mainIndex] && Array.isArray(updatedIndices[removeInfo.mainIndex]) && updatedIndices[removeInfo.mainIndex][removeInfo.subIndex] !== undefined) {
          updatedIndices[removeInfo.mainIndex].splice(removeInfo.subIndex, 1);
          if (updatedIndices[removeInfo.mainIndex].length === 0) {
            delete updatedIndices[removeInfo.mainIndex];
          }
        }
        return Object.keys(updatedIndices);
      });
    }
  }, [removeInfo]);
  
  if (!data || !data.new_ranges) {
    return null;
  }

  // Функция для обработки изменений в input полях
  const handleInputChange = (mainIndex, subIndex, field, value) => {
    const intValue = field === 'sats' ? parseInt(value, 10) : value;
    setInputs((prevInputs) => {
      const updatedInputs = { ...prevInputs };
      if (!updatedInputs[mainIndex]) {
        updatedInputs[mainIndex] = [];
      }
      if (!updatedInputs[mainIndex][subIndex]) {
        updatedInputs[mainIndex][subIndex] = { sats: '', address: '' };
      }
      updatedInputs[mainIndex][subIndex][field] = intValue;

      // Обновление диапазонов в зависимости от новых сатоши
      if (field === 'sats') {
        const newRanges = {};
        let remainingSats = intValue;
        let currentKey = parseInt(mainIndex);
        let rangeCounter = 0;

        while (remainingSats > 0) {
          const range = data.new_ranges[currentKey]?.[0] || data.sat_ranges[currentKey];
          if (range) {
            const rangeSize = range.max ? (range.max - range.min) : (range[1] - range[0]);

            if (remainingSats > rangeSize) {
              newRanges[rangeCounter] = {
                min: range.min || range[0],
                max: range.max || range[1],
                sats: rangeSize,
              };
              remainingSats -= rangeSize;
              currentKey++;
            } else {
              newRanges[rangeCounter] = {
                min: range.min || range[0],
                max: (range.min || range[0]) + remainingSats,
                sats: remainingSats,
              };
              remainingSats = 0;
            }

            rangeCounter++;
          } else {
            remainingSats = 0;
          }
        }

        updatedInputs[mainIndex][subIndex] = {
          ...updatedInputs[mainIndex][subIndex],
          ranges: newRanges,
          endRangeIndex: currentKey.toString(),
        };
      }

      return updatedInputs;
    });
  };

  return (
    <div>
      {rangeIndices.map((rangeIndex) => (
        inputs[rangeIndex]?.map((range, subIndex) => (
          <div key={`${rangeIndex}-${subIndex}`} className="relative">
            <div className="divide-solid divide-orange-600 divide-y flex border-4 bg-zinc-800 border-orange-600 p-2 rounded-xl mb-4 flex-col">
              {range.ranges && Object.keys(range.ranges).map((rangeKey) => (
                <div key={`${rangeIndex}-${subIndex}-${rangeKey}`} className="mb-2">
                  <div>Range {rangeKey}:</div>
                  <div>Min: {range.ranges[rangeKey].min}</div>
                  <div>Max: {range.ranges[rangeKey].max}</div>
                  <div>Sats: {range.ranges[rangeKey].sats}</div>
                </div>
              ))}
              <input
                className="text-center bg-zinc-800 text-white"
                type="number"
                placeholder="sats"
                value={inputs[rangeIndex]?.[subIndex]?.sats || ''}
                onChange={(e) => handleInputChange(rangeIndex, subIndex, 'sats', e.target.value)}
              />
              <input
                className="text-center bg-zinc-800 text-white"
                type="text"
                placeholder="address"
                value={inputs[rangeIndex]?.[subIndex]?.address || ''}
                onChange={(e) => handleInputChange(rangeIndex, subIndex, 'address', e.target.value)}
              />
            </div>
          </div>
        ))
      ))}
    </div>
  );
}

export default RangeOutput;