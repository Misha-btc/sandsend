import React, { useState, useEffect } from "react";
import { useChoice } from '../../Contexts/ChosenUtxo';
import Button from '../Button';

// Компонент RangeInput отвечает за управление диапазонами для UTXO
export function RangeInput({ dataKey, children, rangeIndex, setRemoveInfo }) {
  const minAllowed = children[0]; // Минимально допустимое значение диапазона
  const maxAllowed = children[1]; // Максимально допустимое значение диапазона
  const defaultValue = maxAllowed - minAllowed;

  const { choice, addToRanges, removeFromRanges } = useChoice(); // Получаем функции из контекста
  
  // Инициализация состояния ranges
  const [ranges, setRanges] = useState(() => {
    const contextRanges = choice[dataKey]?.new_ranges?.[rangeIndex] || [];
    return contextRanges.length > 0 ? contextRanges : [];
  });

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
    localStorage.setItem(`ranges-${dataKey}-${rangeIndex}`, JSON.stringify(ranges)); // Сохранение в localStorage
  }, [ranges, dataKey, rangeIndex, addToRanges, removeFromRanges]);

  // Обработчик изменения минимального значения диапазона
  const handleMinChange = (index) => (event) => {
    const { value } = event.target;
    const intValue = parseInt(value, 10);

    setWarning('');
    setRanges((prevRanges) => {
      const newRanges = [...prevRanges];
      if (newRanges[index]) {
        newRanges[index].min = value === '' ? '' : intValue;
        newRanges[index].sats = value === '' ? '' : newRanges[index].max - intValue;
        if (index > 0) {
          newRanges[index - 1].max = intValue;
        }
        addToRanges(dataKey, rangeIndex, newRanges); // Обновляем контекст
      }
      return newRanges;
    });
  };

  // Обработчик изменения максимального значения диапазона
  const handleMaxChange = (index) => (event) => {
    const { value } = event.target;
    const intValue = parseInt(value, 10);

    setWarning('');
    setRanges((prevRanges) => {
      const newRanges = [...prevRanges];
      if (newRanges[index]) {
        newRanges[index].max = value === '' ? '' : intValue;
        newRanges[index].sats = value === '' ? '' : intValue - newRanges[index].min;
        if (index < newRanges.length - 1) {
          newRanges[index + 1].min = intValue;
        }
        addToRanges(dataKey, rangeIndex, newRanges); // Обновляем контекст
      }
      return newRanges;
    });
  };

  // Функция для добавления нового диапазона
  const addRange = () => {
    const lastRange = ranges.length > 0 ? ranges[ranges.length - 1] : null;

    if (lastRange && lastRange.max !== '' && lastRange.max > lastRange.min && lastRange.max < maxAllowed) {
      if (ranges.length <= tr2RangeLimit) {
        const newMin = lastRange.max;
        setRanges((prevRanges) => {
          const newRanges = [...prevRanges, { min: newMin, max: maxAllowed, sats: '', address: '' }];
          addToRanges(dataKey, rangeIndex, newRanges); // Обновляем контекст при добавлении
          return newRanges;
        });
        setWarning('');
      } else {
        setWarning(`Невозможно добавить диапазон. Максимальное количество диапазонов: ${tr2RangeLimit}`);
      }
    } else if (lastRange == null) {
      const initialRanges = [{ min: minAllowed, max: maxAllowed, sats: defaultValue, address: '' }];
      setRanges(initialRanges);
      addToRanges(dataKey, rangeIndex, initialRanges); // Обновляем контекст при добавлении
    } else {
      setWarning(`Невозможно добавить диапазон. Убедитесь, что максимальное значение последнего диапазона между ${minAllowed} и ${maxAllowed}`);
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

      addToRanges(dataKey, rangeIndex, newRanges); // Обновляем контекст при удалении
      return newRanges;
    });
    setRemoveInfo({ mainIndex: rangeIndex, subIndex: index });
    setWarning('');
  };

  // Обработчик клика по кнопке добавления диапазона
  const handleButtonClick = () => {
    addRange();
  };

  const handleClick = (index) => {
    if (index === 0) {
      setRanges(() => {
        const newRanges = [{ min: children[0], max: ranges[0].max, sats: '', address: '' }];
        addToRanges(dataKey, rangeIndex, newRanges); // Обновляем контекст
        return newRanges;
      });
    } else {
      setRanges(() => {
        const newRanges = [{ min: ranges[0].min, max: children[1], sats: '', address: '' }];
        addToRanges(dataKey, rangeIndex, newRanges); // Обновляем контекст
        return newRanges;
      });
    }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement.type === 'number') {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  return (
    <div className="p-2 m-2 border-8 flex-row flex justify-between border-zinc-800 border rounded-xl">
      <div className="">
        <div className="font-bold flex flex-row w full ">
          <span className="cursor-pointer text-zinc-800 hover:text-zinc-950" onClick={() => handleClick(0)}>{children[0]} </span>
            - 
          <span className="cursor-pointer text-zinc-800 hover:text-zinc-950" onClick={() => handleClick(1)}> {children[1]} </span>
          <span className="ml-4 rounded-full border w-6 h-6 border-black mr-4"> {defaultValue}</span>
          {tr2RangeLimit}
          <div className="flex-col justify-cente items-center flex bg-zinc-950 border-orange-600 border-2 text-white rounded-full text-xs pb-px w-14 h-6 ml-2 grow hover:bg-zinc-950"><span>000</span></div>
        </div>
        {ranges.length === 0 ? null : ranges.map((range, index) => (
          <div key={index} className="relative mb-4 border-zinc-950 border-4 rounded-xl bg-zinc-800 text-white px-4 pb-4 pt-2 mt-4">
            <label>
              <div className="font-bold flex justify-center pb-2">sub range {index + 1}:</div>
              <div className="flex justify-center items-center">
                <input
                  className="border-2 border-black text-black rounded-xl text-center mx-1 w-1/2 p-2"
                  type="number"
                  value={range.min}
                  onChange={handleMinChange(index)}
                />
                <span className="font-bold text-xl">-</span>
                <input
                  className="border-2 border-black text-black rounded-xl text-center mx-1 w-1/2 p-2"
                  type="number"
                  value={range.max}
                  onChange={handleMaxChange(index)}
                />
              </div>
            </label>
            <span>
              <Button
                title="-"
                className="ml-2 absolute -top-4 -right-4 bg-zinc-950 border-orange-600 border-2 text-white rounded-full text-xl pb-px w-7 h-7 hover:bg-zinc-950 leading-none"
                onClick={() => removeRange(index)}
              />
            </span>
            {warning && <div className="text-red-500">{warning}</div>}
          </div>
        ))}
      </div>
      <div className="relative">
        <Button
          title="+"
          className=" justify-center flex pb-px items-center bg-lime-700 text-white rounded-full w-6 h-6 text-xl leading-none"
          onClick={handleButtonClick}
        />
      </div>
    </div>
  );
  }
  
  export default RangeInput;