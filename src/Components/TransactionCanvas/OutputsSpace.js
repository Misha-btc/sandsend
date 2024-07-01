import React from 'react';
import OutputElement from './OutputElement';
import { useChoice } from '../../Contexts/ChosenUtxo';

const OutputsSpace = () => {
  const { choice } = useChoice();

  // Функция для получения всех диапазонов из choice
  const getAllRanges = () => {
    return Object.keys(choice).reduce((acc, key) => {
      const newRanges = choice[key].new_ranges;
      if (newRanges) {
        Object.values(newRanges).forEach(rangeArray => {
          rangeArray.forEach(range => {
            acc.push({ ...range, key });
          });
        });
      }
      return acc;
    }, []);
  };

  const ranges = getAllRanges();

  return (
    <div className='w-full h-full p-10 flex flex-col min-h-screen m-6 items-center'>
      {ranges.map((range, index) => (
        <div key={index} className="mb-2 w-32 h-12 rounded-xl">
          <OutputElement range={range} />
        </div>
      ))}
    </div>
  );
};

export default OutputsSpace;