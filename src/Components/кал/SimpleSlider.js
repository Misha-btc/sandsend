import React, { useRef, useEffect, useState, useCallback } from 'react';
import SliderHandle from './SliderHandle';

const SimpleSlider = ({ min, max, points, onChange, onAddPoint }) => {
  const sliderRef = useRef(null); // Используется для доступа к DOM-элементу слайдера
  const [sliderValues, setSliderValues] = useState([min, ...points, max]); // Состояние значений слайдера, включая крайние значения
  const isDragging = useRef(false); // Флаг для отслеживания процесса перетаскивания

  // Обновление значений слайдера при изменении точек или крайних значений
  useEffect(() => {
    setSliderValues([min, ...points, max]);
  }, [points, min, max]);

  // Обработчик движения указателя
  const handlePointerMove = useCallback((event, index) => {
    isDragging.current = true;
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newValue = Math.round(min + ((offsetX / rect.width) * (max - min)));

    const minDistance = 1; // Минимальное расстояние между точками

    // Проверка, чтобы гарантировать, что точки не пересекаются
    if (index > 0 && newValue <= sliderValues[index - 1] + minDistance) {
      return;
    }
    if (index < sliderValues.length - 1 && newValue >= sliderValues[index + 1] - minDistance) {
      return;
    }

    // Обновление значения точки, если оно валидно
    if (newValue > min && newValue < max) {
      const newValues = [...sliderValues];
      newValues[index] = newValue;
      newValues.sort((a, b) => a - b);

      setSliderValues(newValues);
      const pointsOnly = newValues.slice(1, -1); // Исключаем крайние значения
      onChange(pointsOnly);
    }
  }, [min, max, sliderValues, onChange]);

  // Обработчик клика по слайдеру для добавления новой точки
  const handleClick = useCallback((event) => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newValue = Math.round(min + ((offsetX / rect.width) * (max - min)));

    // Проверка, чтобы новая точка не была слишком близко к существующим точкам
    if (points.some(point => Math.abs(point - newValue) < 1)) {
      return;
    }

    // Проверка, чтобы новая точка не создавалась в недопустимых диапазонах
    const subRanges = [min, ...points, max];
    for (let i = 0; i < subRanges.length - 1; i++) {
      if (newValue > subRanges[i] && newValue < subRanges[i + 1]) {
        if (newValue - subRanges[i] < 1 || subRanges[i + 1] - newValue < 1) {
          return;
        }
      }
    }

    onAddPoint(newValue); // Вызов коллбэка для добавления новой точки
  }, [min, max, points, onAddPoint]);

  // Обработчик двойного клика для удаления точки
  const handleDoubleClick = useCallback((index) => {
    if (index !== 0 && index !== sliderValues.length - 1) {
      const newValues = sliderValues.filter((_, i) => i !== index);
      setSliderValues(newValues);
      const pointsOnly = newValues.slice(1, -1); // Исключаем крайние значения
      onChange(pointsOnly);
    }
  }, [sliderValues, onChange]);

  return (
    <div className="relative w-9/12 h-8 mx-auto" ref={sliderRef} onClick={handleClick}>
      <div className="absolute top-1/2 w-full h-1 bg-gray-300 transform -translate-y-1/2"></div>
      {sliderValues.map((value, index) => (
        <SliderHandle
          key={index}
          position={((value - min) / (max - min)) * 100}
          onMouseDown={(event) => handlePointerMove(event, index)}
          onDoubleClick={() => handleDoubleClick(index)}
          isDraggable={index !== 0 && index !== sliderValues.length - 1} // Установка, что крайние точки не перетаскиваются
          isLeft={index === 0}
          isRight={index === sliderValues.length - 1}
          index={index}
        />
      ))}
    </div>
  );
};

export default SimpleSlider;