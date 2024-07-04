import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useChoice } from '../../Contexts/ChosenUtxo';

// Функция для создания команды кривой Безье
const createBezierPath = (start, control1, control2, end) => {
  return `M ${start.x},${start.y} C ${control1.x},${control1.y} ${control2.x},${control2.y} ${end.x},${end.y}`;
};

// Компонент для отрисовки линий
const Lines = ({ containerInfo }) => {
  const { choice } = useChoice(); // Получаем выбор пользователя из контекста
  const svgRef = useRef(null); // Реф для SVG элемента
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Состояние для хранения смещения SVG контейнера

  // Функция для вычисления смещения SVG контейнера
  const computePosition = () => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect(); // Получаем границы SVG контейнера
      setOffset({ x: rect.left, y: rect.top }); // Устанавливаем смещение в состояние
    }
  };

  // Хук эффекта для вычисления смещения при монтировании и изменении размера окна
  useEffect(() => {
    computePosition(); // Вычисляем начальное смещение
    window.addEventListener('resize', computePosition); // Добавляем обработчик изменения размера окна

    return () => {
      window.removeEventListener('resize', computePosition); // Удаляем обработчик при размонтировании компонента
    };
  }, []);

  console.log("Current choice:", choice); // Логируем текущее состояние выбора пользователя

  // Хук useMemo для вычисления линий на основе выбора пользователя и смещения
  const computedLines = useMemo(() => {
    const lines = []; // Массив для хранения линий
    const containerWidth = containerInfo.width; // Ширина контейнера (половина окна)
    Object.entries(choice).forEach(([inputKey, inputData]) => {
      const start = inputData.position; // Начальная позиция линии

      if (inputData.new_ranges) { // Проверяем, есть ли новые диапазоны для текущего элемента
        Object.entries(inputData.new_ranges).forEach(([rangeIndex, rangeArray]) => {
          if (Array.isArray(rangeArray)) { // Проверяем, является ли rangeArray массивом
            rangeArray.forEach((range, arrayIndex) => {
              const end = range.position; // Конечная позиция линии
              if (start && end && !isNaN(start.x) && !isNaN(start.y) && !isNaN(end.x) && !isNaN(end.y)) { // Проверяем корректность координат
                const isLeftContainer = start.x < containerWidth; // Определяем, находится ли элемент в левом контейнере
                const offsetXCorrection = isLeftContainer ? 0 : containerWidth; // Коррекция смещения по оси X для правого контейнера
                
                const startX = (start.x / 100) * containerInfo.width - offset.x;
                const startY = (start.y / 100) * containerInfo.height - offset.y;
                const endX = (end.x / 100) * containerInfo.width - offset.x + offsetXCorrection;
                const endY = (end.y / 100) * containerInfo.height - offset.y;

                // Вычисляем контрольные точки для кривой Безье
                const controlPoint1 = { x: startX + (endX - startX) / 2, y: startY };
                const controlPoint2 = { x: startX + (endX - startX) / 2, y: endY };

                lines.push(
                  <path
                    key={`${inputKey}-${rangeIndex}-${arrayIndex}`} // Уникальный ключ для линии
                    d={createBezierPath({ x: startX, y: startY }, controlPoint1, controlPoint2, { x: endX, y: endY })} // Путь кривой Безье
                    stroke="#EA580C" // Цвет линии
                    strokeWidth="4" // Ширина линии
                    fill="none" // Без заливки
                  />
                );
              }
            });
          }
        });
      }
    });
    return lines; // Возвращаем массив линий
  }, [choice, offset.x, offset.y, containerInfo.width, containerInfo.height]); // Пересчитываем линии при изменении выбора или смещения

  console.log("Lines structure:", computedLines); // Логируем структуру линий

  return (
    <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
      {computedLines} {/* Отрисовываем вычисленные линии */}
    </svg>
  );
};

export default Lines;