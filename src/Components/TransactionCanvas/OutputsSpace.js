import React, { useRef, useEffect, useState } from 'react';
import OutputElement from './OutputElement';
import { useChoice } from '../../Contexts/ChosenUtxo';

const OutputsSpace = ({ containerInfo }) => {
  const { choice } = useChoice();
  const containerRef = useRef(null);
  const [containerPosition, setContainerPosition] = useState({ left: 0, top: 0 });

  const computeContainerPosition = () => {
    if (containerRef.current && containerInfo.width > 0 && containerInfo.height > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      const newPosition = {
        left: rect.left - containerInfo.left,
        top: rect.top - containerInfo.top
      };
      console.log("Container position:", newPosition); // Debugging log
      setContainerPosition(newPosition);
    }
  };

  useEffect(() => {
    computeContainerPosition();
  }, [containerInfo]);

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
    <div ref={containerRef} className='w-full h-full p-20 flex flex-col min-h-screen m-6 items-center'>
      {ranges.map((range, index) => (
        <OutputElement key={index} range={range} containerRef={containerRef} containerInfo={containerInfo} containerPosition={containerPosition} />
      ))}
    </div>
  );
};

export default OutputsSpace;