import React, { useState, useEffect } from "react";
import { useChoice } from '../../Contexts/ChosenUtxo';
import Button from '../Button';

// Компонент RangeInput отвечает за управление диапазонами для UTXO
export function RangeInput({ dataKey, children, rangeIndex, setRangeOutput }) {
  const minAllowed = children[0]; // Минимально допустимое значение диапазона
  const maxAllowed = children[1]; // Максимально допустимое значение диапазона

  const { addToRanges, removeFromRanges } = useChoice(); // Получаем функции из контекста

  const [ranges, setRanges] = useState([]); // Состояние для хранения диапазонов
  const [warning, setWarning] = useState(''); // Состояние для хранения предупреждений
  const [tr2RangeLimit, setTr2RangeLimit] = useState(0); // Состояние для хранения лимита диапазонов

  // Эффект для установки лимита диапазонов на основе разницы minAllowed и maxAllowed
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

  // Эффект для обновления диапазонов в контексте или удаления диапазона, если он пуст
  useEffect(() => {
    if (ranges.length > 0) {
      addToRanges(dataKey, rangeIndex, ranges);
    } else {
      removeFromRanges(dataKey, rangeIndex);
    }
  }, [ranges, dataKey, rangeIndex, addToRanges, removeFromRanges]);

  // Обработчик изменения максимального значения диапазона
  const handleMaxChange = (index) => (event) => {
    const { value } = event.target;
    const intValue = parseInt(value, 10);

    if (value === '' || (intValue > ranges[index].min && intValue <= maxAllowed)) {
      setWarning('');
      setRanges((prevRanges) => {
        const newRanges = [...prevRanges];
        if (newRanges[index]) {
          newRanges[index].max = value === '' ? '' : intValue;
          newRanges[index].sats = value === '' ? '' : intValue - newRanges[index].min;
          if (index < newRanges.length - 1) {
            newRanges[index + 1].min = intValue;
          }
        }
        return newRanges;
      });
    }
  };

  // Обработчик потери фокуса для валидации максимального значения диапазона
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

  // Обработчик изменения адреса для диапазона
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
    } else if (lastRange == null) {
      setRanges([{ min: minAllowed, max: maxAllowed, sats: '', address: '' }]);
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
  
      for (let i = index; i < newRanges.length; i++) {
        if (i === 0) {
          newRanges[i].min = minAllowed;
          newRanges[i].sats = newRanges[i].max - newRanges[i].min;
        } else {
          newRanges[i].min = newRanges[i - 1].max;
          newRanges[i].sats = newRanges[i].max - newRanges[i].min;
        }
      }
  
      return newRanges;
    });
  
    setWarning('');
  };

  // Обработчик клика по кнопке добавления диапазона
  const handleButtonClick = () => {
    addRange();
    setRangeOutput(rangeIndex);
    console.log(rangeIndex)
  };

  return (
    <div className="p-2 m-2 border flex-row flex justify-between rounded-xl">
      <div>
        {children.join(' - ')}
        {ranges.length === 0 ? null : ranges.map((range, index) => (
          <div key={index} className="mb-4">
            <label>
              range {index + 1}:
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
            <span>
              <Button
                title="x" 
                className="ml-2 bg-red-600 text-white rounded-full text-sm w-6 h-6 leading-none"
                onClick={() => removeRange(index)}        
              />
            </span>
          </div>
        ))}
      </div>
      <div>
        <Button
          title="+" 
          className="bg-black text-white rounded-full w-6 h-6 text-sm leading-none"
          onClick={handleButtonClick}
        />
      </div>
    </div>
  );
}

export default RangeInput;