import React, { useState } from "react";

export function RangeInput({ children }) {
  // Извлекаем минимальные и максимальные значения из children
  const minAllowed = children[0];
  const maxAllowed = children[1];

  // Инициализация состояния 'ranges', начальное состояние - пустой массив
  const [ranges, setRanges] = useState([]);
  const [warning, setWarning] = useState(''); // Состояние для хранения предупреждений

  // Обработчик изменения максимального значения
  const handleMaxChange = (index) => (event) => {
    const { value } = event.target; // Получение значения из события
    const intValue = parseInt(value, 10); // Преобразование значения в целое число
    if (value === '' || (intValue > ranges[index].min && intValue <= maxAllowed)) {
      setWarning(''); // Убираем предупреждение, если значение корректное
    }
    setRanges((prevRanges) => {
      const newRanges = [...prevRanges]; // Копируем текущие диапазоны
      newRanges[index].max = value === '' ? '' : intValue; // Обновляем максимальное значение
      return newRanges; // Возвращаем обновленные диапазоны
    });
  };

  // Обработчик покидания поля ввода
  const handleBlur = (value, index) => {
    if (value !== '' && (value <= ranges[index].min || value > maxAllowed)) {
      setWarning(`Value must be between ${ranges[index].min} and ${maxAllowed}`); // Устанавливаем предупреждение, если значение некорректное
    } else {
      setWarning(''); // Убираем предупреждение
    }
  };

  // Обработчик изменения разницы между min и max
  const handleDifferenceChange = (index) => (event) => {
    const { value } = event.target; // Получение значения из события
    const intValue = parseInt(value, 10); // Преобразование значения в целое число
    if (value === '' || (intValue >= 0 && (ranges[index].min + intValue) <= maxAllowed)) {
      setWarning(''); // Убираем предупреждение, если значение корректное
    } else {
      setWarning(`Difference must be non-negative and max value must be less than or equal to ${maxAllowed}`); // Устанавливаем предупреждение
    }
    setRanges((prevRanges) => {
      const newRanges = [...prevRanges]; // Копируем текущие диапазоны
      newRanges[index].max = value === '' ? '' : ranges[index].min + intValue; // Обновляем максимальное значение
      return newRanges; // Возвращаем обновленные диапазоны
    });
  };

  // Функция для добавления нового диапазона
  const addRange = () => {
    const lastRange = ranges[ranges.length - 1]; // Получаем последний диапазон
    if (ranges.length === 0 || (lastRange && lastRange.max !== '' && (lastRange.max > lastRange.min && lastRange.max <= maxAllowed))) {
      const newMin = ranges.length === 0 ? minAllowed : lastRange.max; // Устанавливаем новое минимальное значение
      setRanges((prevRanges) => [...prevRanges, { min: newMin, max: '' }]); // Добавляем новый диапазон
      setWarning(''); // Убираем предупреждение
    } else {
      setWarning(`Cannot add range. Ensure the last range's max value is between ${minAllowed + 1} and ${maxAllowed}`); // Устанавливаем предупреждение
    }
  };

  // Функция для удаления диапазона по индексу
  const removeRange = (index) => {
    setRanges((prevRanges) => {
      const newRanges = prevRanges.filter((_, i) => i !== index); // Удаляем диапазон из массива
      if (index < prevRanges.length - 1 && newRanges.length > 0) {
        newRanges[index].min = prevRanges[index].min; // Обновляем min следующего диапазона, если удаляемый диапазон не последний
      }
      return newRanges;
    });
    setWarning(''); // Убираем предупреждение после удаления диапазона
  };

  return (
    <div>
      {ranges.map((range, index) => (
        <div key={index} className="mb-4">
          <label>
            sat range {index + 1}:
            <span className="border-2 py-1 border-stone-500 rounded-xl mx-1 flex-grow text-stone-600">{range.min}</span>
            -
            <input
              className="border-2 border-black rounded-xl mx-1 flex-grow"
              type="number"
              min={minAllowed + 1}
              max={maxAllowed}
              value={range.max} // Привязка значения к состоянию
              onChange={handleMaxChange(index)} // Установка обработчика изменения
              onBlur={() => handleBlur(range.max, index)} // Установка обработчика покидания поля ввода
            />
            <input
              className="border-2 border-black rounded-xl mx-1 flex-grow"
              type="number"
              value={range.max === '' ? '' : range.max - range.min} // Привязка значения разницы к состоянию
              onChange={handleDifferenceChange(index)} // Установка обработчика изменения разницы
            />
          </label>
          <button
            onClick={() => removeRange(index)} // Установка обработчика для удаления диапазона
            className="ml-2 px-2 py-1 bg-red-800 text-white rounded-lg"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addRange} // Установка обработчика для добавления нового диапазона
        className="mt-2 px-2 py-1 bg-black text-white rounded-lg"
      >
        Add range
      </button>
      {warning && <div className="text-red-500">{warning}</div>} {/* Отображение предупреждения, если оно есть */}
    </div>
  );
}

export default RangeInput;