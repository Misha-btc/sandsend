import React from 'react';
import SimpleSlider from './SimpleSlider';
import InputRange from './InputRange';

const SelectRanges = ({ range, inscription, index, points, onPointsChange }) => {
  const sliderPoints = [range[0], ...points, range[1]];
  const ranges = sliderPoints.slice(1).map((point, idx) => [sliderPoints[idx], point]);

  const handleInputChange = (event, pointIndex) => {
    let newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      const minDistance = 1;
      if (newValue <= range[0] + minDistance) newValue = range[0] + minDistance;
      if (newValue >= range[1] - minDistance) newValue = range[1] - minDistance;
      if (pointIndex > 0 && newValue <= points[pointIndex - 1] + minDistance) {
        newValue = points[pointIndex - 1] + minDistance;
      }
      if (pointIndex < points.length - 1 && newValue >= points[pointIndex + 1] - minDistance) {
        newValue = points[pointIndex + 1] - minDistance;
      }

      const newPoints = [...points];
      newPoints[pointIndex] = newValue;
      onPointsChange(index, newPoints.sort((a, b) => a - b));
    }
  };

  const handleAddPoint = (newPoint) => {
    const newPoints = [...points, newPoint].sort((a, b) => a - b);
    onPointsChange(index, newPoints);
  };

  return (
    <div className='border-b p-2 font-bold'>
      <SimpleSlider
        min={range[0] + 1}
        max={range[1] - 1}
        points={points}
        onChange={newPoints => onPointsChange(index, newPoints)}
        onAddPoint={handleAddPoint}
      />
      <div className="mt-4">
        {ranges.map((r, idx) => (
          <InputRange
            key={idx}
            range={r}
            index={idx}
            onInputChange={handleInputChange}
            isLast={idx === ranges.length - 1} // Передаем isLast как true для последнего диапазона
          />
        ))}
      </div>
      {inscription && <div>Inscription: {inscription}</div>}
    </div>
  );
};

export default SelectRanges;