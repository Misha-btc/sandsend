import React, { useRef } from 'react';
import OutputElement from './OutputElement';
import { useChoice } from '../../Contexts/ChosenUtxo';
import Lines from './Lines';

const OutputsSpace = () => {
  const { choice } = useChoice();
  const containerRef = useRef(null);

  const getAllRanges = () => {
    return Object.keys(choice).reduce((acc, key) => {
      const newRanges = choice[key].new_ranges;
      if (newRanges) {
        Object.entries(newRanges).forEach(([rangeIndex, rangeArray]) => {
          if (Array.isArray(rangeArray)) {
            rangeArray.forEach((range, arrayIndex) => {
              acc.push({ ...range, key, index: rangeIndex, arrayIndex });
            });
          }
        });
      }
      return acc;
    }, []);
  };

  const ranges = getAllRanges();

  return (
    <div ref={containerRef} className='w-full h-full p-10 flex flex-col min-h-screen m-6 items-center'>
      {ranges.map((range, index) => (
        <OutputElement key={index} range={range} containerRef={containerRef} />
      ))}
    </div>
  );
};

export default OutputsSpace;