import React, { useRef, useEffect, useState } from 'react';
import { useChoice } from '../../Contexts/ChosenUtxo';

// Компонент для отрисовки линий
const Lines = () => {
  // Получаем данные из контекста выбора
  const { choice } = useChoice();
  // Создаем массив для хранения линий
  const lines = [];
  // Хук состояния для хранения смещения (offset)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // Реф для SVG контейнера
  const svgRef = useRef(null);

  // Эффект для вычисления смещения SVG контейнера при монтировании компонента
  useEffect(() => {
    if (svgRef.current) {
      // Получаем размеры и положение SVG контейнера
      const rect = svgRef.current.getBoundingClientRect();
      // Устанавливаем смещение в состоянии
      setOffset({ x: rect.left, y: rect.top });
      console.log('SVG container offset:', rect.left, rect.top);
    }
  }, []);

  // Лог текущего состояния выбора
  console.log("Current choice:", choice);

  // Вычисляем половину ширины окна для корректировки позиции конца линии
  const halfWidth = window.innerWidth / 2;

  // Проходимся по каждому входному элементу в choice
  Object.entries(choice).forEach(([inputKey, inputData]) => {
    // Получаем начальную позицию для текущего элемента
    const start = inputData.position;

    // Если есть новые диапазоны для текущего элемента
    if (inputData.new_ranges) {
      // Проходимся по каждому новому диапазону
      Object.entries(inputData.new_ranges).forEach(([rangeIndex, rangeArray]) => {
        if (Array.isArray(rangeArray)) { // Проверяем, является ли rangeArray массивом
          // Проходимся по каждому элементу в диапазоне
          rangeArray.forEach((range, arrayIndex) => {
            // Получаем конечную позицию для текущего диапазона
            const end = range.position;
            if (start && end) {
              // Лог начальной и конечной позиции
              console.log(`Start: (${start.x}, ${start.y}), End: (${end.x + halfWidth}, ${end.y})`);
              // Добавляем линию в массив линий
              lines.push(
                <line
                  key={`${inputKey}-${rangeIndex}-${arrayIndex}`}
                  x1={start.x - offset.x + 50} // Начальная x координата, скорректированная на смещение
                  y1={start.y - offset.y + 70} // Начальная y координата, скорректированная на смещение
                  x2={end.x + halfWidth - offset.x + 50} // Конечная x координата, скорректированная на половину ширины окна и смещение
                  y2={end.y - offset.y + 70} // Конечная y координата, скорректированная на смещение
                  stroke="#65A30D" // Цвет линии
                  strokeWidth="2" // Ширина линии
                  style={{ filter: 'drop-shadow(0 0 5px #d2fa93)' }}
                />
              );
            }
          });
        }
      });
    }
  });

  // Лог структуры линий
  console.log("Lines structure:", lines);

  // Возвращаем SVG контейнер с линиями
  return (
    <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
      {lines}
    </svg>
  );
};

export default Lines;