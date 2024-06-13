import React, { useState, useEffect } from 'react';
import SelectRanges from './SelectRanges'; // Импорт компонента SelectRanges

// Компонент OptionDetails, принимающий пропс selectedItem
const OptionDetails = ({ selectedItem }) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (selectedItem?.sat_ranges && Array.isArray(selectedItem.sat_ranges)) {
      setPoints(selectedItem.sat_ranges.map(range => []));
    } else {
      setPoints([]);
    }
  }, [selectedItem]);

  const handleSliderChange = (index, newPoints) => {
    setPoints(prevPoints =>
      prevPoints.map((point, i) => (i === index ? newPoints : point))
    );
  };

  const handleAddPoint = (rangeIndex, newPoint) => {
    setPoints(prevPoints => {
      const newPoints = [...prevPoints];
      newPoints[rangeIndex] = [...newPoints[rangeIndex], newPoint].sort((a, b) => a - b);
      return newPoints;
    });
  };

  return (
    <div className="p-4"> {/* Основной контейнер с padding */}
      {selectedItem && ( /* Проверка на наличие selectedItem */
        <div className="mb-4 text-gray-700">
          <div className='font-black text-lg'>Selected UTXO: {selectedItem.txid}:{selectedItem.vout}</div> {/* Отображение выбранного UTXO */}
          <div className='border-b p-2 font-black text-lg'>Value: {selectedItem.value}</div> {/* Отображение значения */}
          {selectedItem.sat_ranges && Array.isArray(selectedItem.sat_ranges) ? ( /* Проверка наличия и типа sat_ranges */
            points.map((range, index) => ( /* Итерация по диапазонам */
              <div key={index}>
                <SelectRanges
                  range={selectedItem.sat_ranges[index]}
                  inscription={selectedItem.inscriptions && selectedItem.inscriptions[index]} /* Привязка inscription к диапазону */
                  index={index}
                  points={range}
                  onPointsChange={handleSliderChange} /* Привязка обработчика изменения */
                  onAddPoint={(newPoint) => handleAddPoint(index, newPoint)} /* Привязка обработчика добавления новой точки */
                />
              </div>
            ))
          ) : (
            <div>Sat Ranges: N/A</div> /* Отображение, если sat_ranges отсутствуют */
          )}
          {selectedItem.inscriptions && Array.isArray(selectedItem.inscriptions) && selectedItem.inscriptions.length > selectedItem.sat_ranges.length && (
            selectedItem.inscriptions.slice(selectedItem.sat_ranges.length).map((inscription, index) => ( /* Итерация по оставшимся inscription */
              <div key={index + selectedItem.sat_ranges.length}>
                <div>Inscription: {inscription}</div> {/* Отображение inscription */}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OptionDetails; /* Экспорт компонента OptionDetails */