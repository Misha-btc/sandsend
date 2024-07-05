import React from 'react';

// Компонент Lines отвечает за отрисовку кривых Безье на экране
const Lines = ({ lines }) => (
  // SVG элемент для рисования линий
  <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1  }}>
    {/* Проход по массиву lines и отрисовка каждой линии */}
    {lines.map((line, index) => {
      const controlX1 = line.start.x + (line.end.x - line.start.x) / 2;
      const controlY1 = line.start.y;
      const controlX2 = line.start.x + (line.end.x - line.start.x) / 2;
      const controlY2 = line.end.y;

      return (
        // Элемент <path> для рисования кривой Безье между точками (x1, y1) и (x2, y2)
        <path
          key={index} // Уникальный ключ для каждого элемента в массиве
          d={`M ${line.start.x } ${line.start.y+20 } C ${controlX1} ${controlY1+20}, ${controlX2} ${controlY2+20}, ${line.end.x } ${line.end.y+20}`} // Путь для кривой Безье
          stroke="#c2410c" // Цвет линии bg-orange-700 из Tailwind CSS
          strokeWidth="4" // Толщина линии
          fill="transparent" // Отсутствие заливки
        />
      );
    })}
  </svg>
);

export default Lines;