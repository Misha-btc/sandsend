import React from 'react';
import OutputElement from './OutputElement';
import { useChoice } from '../../Contexts/ChosenUtxo';

// Компонент OutputsSpace отвечает за отображение OutputElement для данного utxoKey и регистрацию рефов на них
const OutputsSpace = ({ utxoKey, registerOutputRef }) => {
  const { choice } = useChoice(); // Получение выбранных UTXOs из контекста

  // Функция для получения массивов new_ranges для данного utxoKey
  const getRangesForUtxoKey = (key) => {
    const newRanges = choice[key]?.new_ranges; // Получение new_ranges из choice для данного ключа
    if (!newRanges) return []; // Возврат пустого массива, если new_ranges не существует
    return Object.entries(newRanges).flatMap(([rangeIndex, rangeArray]) => {
      // Преобразование newRanges в плоский массив объектов диапазонов
      return rangeArray.map((range, arrayIndex) => ({
        ...range,
        key,
        index: rangeIndex,
        arrayIndex
      }));
    });
  };

  const ranges = getRangesForUtxoKey(utxoKey); // Получение диапазонов для данного utxoKey

  return (
    <>
      {/* Проход по массиву диапазонов и отображение OutputElement для каждого диапазона */}
      {ranges.map((range, index) => (
        <div key={index} ref={el => registerOutputRef(utxoKey, index, el)}> {/* Регистрация рефа на каждый OutputElement */}
          <OutputElement range={range} /> {/* Отображение OutputElement */}
        </div>
      ))}
    </>
  );
};

export default OutputsSpace;