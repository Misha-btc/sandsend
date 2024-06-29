import React, { useState, useEffect } from "react";

// Компонент для управления диапазонами и адресами
export function RangeInput({ dataKey, children, rangeIndex }) {
  // Получаем минимальное и максимальное допустимые значения из пропсов children
  const minAllowed = children[0];
  const maxAllowed = children[1];

  // Инициализируем диапазон с начальными значениями
  const initialRange = [{ min: minAllowed, max: '', sats: '', address: '' }];

  // Функция для получения начального состояния из localStorage
  const initialRanges = () => {
    // Получаем данные из localStorage
    const savedData = localStorage.getItem('myData');
    const parsedData = savedData ? JSON.parse(savedData) : {};

    // Если данных для текущего dataKey нет, создаем пустой объект
    if (!parsedData[dataKey]) {
      parsedData[dataKey] = {};
    }

    // Если данных для текущего rangeIndex нет, создаем начальный диапазон
    if (!parsedData[dataKey][rangeIndex]) {
      parsedData[dataKey][rangeIndex] = initialRange;
    }

    // Возвращаем данные для текущего rangeIndex
    return parsedData[dataKey][rangeIndex];
  };

  // Инициализируем состояние ranges с использованием функции initialRanges
  const [ranges, setRanges] = useState(initialRanges);
  const [warning, setWarning] = useState(''); // Состояние для предупреждений
  const [tr2RangeLimit, setTr2RangeLimit] = useState(0); // Лимит количества диапазонов

  // Сохранение данных в localStorage при изменении ranges, dataKey или rangeIndex
  useEffect(() => {
    const updatedData = JSON.parse(localStorage.getItem('myData')) || {};

    // Если данных для текущего dataKey нет, создаем пустой объект
    if (!updatedData[dataKey]) {
      updatedData[dataKey] = {};
    }

    // Обновляем данные для текущего rangeIndex
    updatedData[dataKey][rangeIndex] = ranges;
    localStorage.setItem('myData', JSON.stringify(updatedData));
    console.log('Data saved to localStorage:', updatedData);
  }, [ranges, dataKey, rangeIndex]);

  // Вычисление лимита количества диапазонов в зависимости от общего диапазона
  useEffect(() => {
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

    setTr2RangeLimit(limit);
  }, [minAllowed, maxAllowed]);

  // Обработчик изменения максимального значения диапазона
  const handleMaxChange = (index) => (event) => {
    const { value } = event.target;
    const intValue = parseInt(value, 10);

    // Проверка на корректность значения
    if (value === '' || (intValue > ranges[index].min && intValue <= maxAllowed)) {
      setWarning(''); // Сбрасываем предупреждение
      setRanges((prevRanges) => {
        const newRanges = [...prevRanges];
        if (newRanges[index]) {
          newRanges[index].max = value === '' ? '' : intValue;
          if (index < newRanges.length - 1) {
            newRanges[index + 1].min = intValue;
          }
        }
        return newRanges;
      });
    }
  };

  // Обработчик выхода из поля ввода для проверки значения
  const handleBlur = (value, index) => {
    if (value !== '' && (value <= ranges[index].min || value > maxAllowed)) {
      setWarning(`Значение должно быть между ${ranges[index].min} и ${maxAllowed}`);
    } else {
      setWarning('');
    }
  };

  // Обработчик изменения разницы между min и max значениями диапазона
  const handleDifferenceChange = (index) => (event) => {
    const { value } = event.target;
    const intValue = parseInt(value, 10);

    if (value === '' || (intValue >= 0 && (ranges[index].min + intValue) <= maxAllowed)) {
      setWarning('');
    } else {
      setWarning(`Разница должна быть неотрицательной, и максимальное значение должно быть меньше или равно ${maxAllowed}`);
    }

    setRanges((prevRanges) => {
      const newRanges = [...prevRanges];
      if (newRanges[index]) {
        newRanges[index].max = value === '' ? '' : ranges[index].min + intValue;
        newRanges[index].sats = value;
        if (index < newRanges.length - 1) {
          newRanges[index + 1].min = newRanges[index].max;
        }
      }
      return newRanges;
    });
  };

  // Обработчик изменения адреса
  const handleAddressChange = (index) => (event) => {
    const { value } = event.target;
    setRanges((prevRanges) => {
      const newRanges = [...prevRanges];
      if (newRanges[index]) {
        newRanges[index].address = value;
      }
      return newRanges;
    });
  };

  // Функция для добавления нового диапазона
  const addRange = () => {
    const lastRange = ranges.length > 0 ? ranges[ranges.length - 1] : null;

    if (lastRange && lastRange.max !== '' && lastRange.max > lastRange.min && lastRange.max <= maxAllowed) {
      if (ranges.length < tr2RangeLimit) {
        const newMin = lastRange.max;
        setRanges((prevRanges) => {
          const newRanges = [...prevRanges, { min: newMin, max: '', sats: '', address: '' }];
          return newRanges;
        });
        setWarning('');
      } else {
        setWarning(`Невозможно добавить диапазон. Максимальное количество диапазонов: ${tr2RangeLimit}`);
      }
    } else {
      setWarning(`Невозможно добавить диапазон. Убедитесь, что максимальное значение последнего диапазона между ${minAllowed + 1} и ${maxAllowed}`);
    }
  };

  // Функция для удаления диапазона
  const removeRange = (index) => {
    setRanges((prevRanges) => {
      const newRanges = prevRanges.filter((_, i) => i !== index);
      if (index < prevRanges.length - 1 && newRanges.length > 0) {
        newRanges[index].min = prevRanges[index].min;
      }
      return newRanges;
    });
    setWarning('');
  };

  return (
    <div>
      {ranges && ranges.map((range, index) => (
        <div key={index} className="mb-4">
          <label>
            Диапазон сатоши {index + 1}:
            <span className="border-2 py-1 border-stone-500 rounded-xl mx-1 flex-grow text-stone-600">
              {range.min}
            </span>
            -
            <input
              className="border-2 border-black rounded-xl mx-1 flex-grow"
              type="number"
              min={minAllowed}
              max={maxAllowed}
              value={range.max}
              onChange={handleMaxChange(index)}
              onBlur={() => handleBlur(range.max, index)}
            />
            <input
              className="border-2 border-black rounded-xl mx-1 flex-grow"
              type="number"
              placeholder="сатоши"
              value={range.max === '' ? '' : range.max - range.min}
              onChange={handleDifferenceChange(index)}
            />
          </label>
          <button
            onClick={() => removeRange(index)}
            className="ml-2 px-2 py-1 bg-red-800 text-white rounded-lg"
          >
            Удалить
          </button>
          <input
            className="border-2 border-black rounded-xl mx-1 flex-grow"
            type="text"
            placeholder="Введите адрес"
            value={range.address || ''}
            onChange={handleAddressChange(index)}
          />
        </div>
      ))}
      <button
        onClick={addRange}
        className="mt-2 px-2 py-1 bg-black text-white rounded-lg"
      >
        Добавить диапазон
      </button>
      {warning && <div className="text-red-500">{warning}</div>}
      <div>Максимальное количество диапазонов: {tr2RangeLimit}</div>
    </div>
  );
}

export default RangeInput;