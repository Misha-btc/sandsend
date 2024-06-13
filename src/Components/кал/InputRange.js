import React from 'react';

const InputRange = ({ range, index, onInputChange, isLast }) => {
  return (
    <div key={index} className="flex items-center mb-2">
      <label className="mr-2">Range {index + 1}:</label>
      <input
        type="number"
        className="border rounded p-1 mr-2"
        value={range[0]}
        readOnly={true} // начальное значение диапазона неизменяемое
      />
      <span className="mx-2">-</span>
      <input
        type="number"
        className="border rounded p-1 mr-2"
        value={range[1]}
        onChange={(event) => onInputChange(event, index)}
        readOnly={isLast} // конечное значение диапазона неизменяемое
      />
      <span>({range[1] - range[0]} sats)</span>
    </div>
  );
};

export default InputRange;