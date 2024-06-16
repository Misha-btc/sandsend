import React, { useState, useRef, useEffect } from 'react';

// Компонент MultiRangeSlider принимает минимальное значение, максимальное значение и функцию обратного вызова onChange в качестве пропсов
const MultiRangeSlider = ({ min = 0, max = 1000, onChange }) => {
  // Используем useState для управления состоянием минимального и максимального значений ползунков
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  // Создаем рефы для ползунков и трека слайдера
  const sliderRef = useRef(null);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);

  // Используем useEffect для обновления позиции ползунков и трека слайдера при изменении minValue, maxValue, min или max
  useEffect(() => {
    // Функция для обновления позиций ползунков и трека слайдера
    const updateSlider = () => {
      const range = max - min; // Общий диапазон значений
      const minPercent = ((minValue - min) / range) * 100; // Позиция минимального ползунка в процентах
      const maxPercent = ((maxValue - min) / range) * 100; // Позиция максимального ползунка в процентах

      // Обновляем позицию минимального ползунка
      if (minThumbRef.current) {
        minThumbRef.current.style.left = `${minPercent}%`;
      }

      // Обновляем позицию максимального ползунка
      if (maxThumbRef.current) {
        maxThumbRef.current.style.left = `${maxPercent}%`;
      }

      // Обновляем позицию и ширину активного трека слайдера
      if (sliderRef.current) {
        sliderRef.current.style.left = `${minPercent}%`;
        sliderRef.current.style.right = `${100 - maxPercent}%`;
      }
    };

    updateSlider(); // Вызов функции для начального обновления позиций
  }, [minValue, maxValue, min, max]); // Зависимости для useEffect

  // Функция для обработки события нажатия на ползунок
  const handleMouseDown = (thumb) => (event) => {
    const startX = event.clientX; // Начальная позиция мыши по оси X
    const sliderWidth = event.target.parentElement.offsetWidth; // Ширина слайдера

    // Функция для обработки события перемещения мыши
    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX; // Изменение позиции мыши по оси X
      const deltaValue = (deltaX / sliderWidth) * (max - min); // Изменение значения ползунка

      // Обновляем значение minValue или maxValue в зависимости от того, какой ползунок перетаскивается
      if (thumb === 'min') {
        setMinValue(Math.min(Math.max(min, minValue + deltaValue), maxValue - 1));
      } else {
        setMaxValue(Math.max(Math.min(max, maxValue + deltaValue), minValue + 1));
      }
    };

    // Функция для обработки события отпускания кнопки мыши
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Добавляем слушатели событий перемещения и отпускания мыши
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative w-3/4 mt-4"> {/* Контейнер слайдера */}
      <div className="absolute h-1 w-full bg-gray-300 rounded"> {/* Трек слайдера */}
        <div
          ref={sliderRef}
          className="absolute h-1 bg-black rounded" // Активный трек слайдера
        />
      </div>
      <div
        ref={minThumbRef}
        className="absolute w-4 h-6 bg-white border border-gray-400 rounded-full cursor-pointer" // Минимальный ползунок
        style={{ top: '-0.5rem', transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown('min')} // Обработчик события нажатия на ползунок
      />
      <div
        ref={maxThumbRef}
        className="absolute w-4 h-6 bg-white border border-gray-400 rounded-full cursor-pointer" // Максимальный ползунок
        style={{ top: '-0.5rem', transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown('max')} // Обработчик события нажатия на ползунок
      />
    </div>
  );
};

export default MultiRangeSlider;