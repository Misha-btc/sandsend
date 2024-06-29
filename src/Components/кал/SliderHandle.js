import React, { useRef, useEffect, useState, useCallback } from 'react';
import SliderHandle from './SliderHandle';

// Компонент SimpleSlider принимает пропсы: min, max, points (по умолчанию пустой массив), onChange, onAddPoint
const SimpleSlider = ({ min, max, points = [], onChange, onAddPoint }) => {
  const sliderRef = useRef(null); // Ссылка на элемент слайдера
  const [sliderValues, setSliderValues] = useState([min, ...points, max]); // Состояние значений слайдера, включая крайние значения
  const isDragging = useRef(false); // Флаг для отслеживания процесса перетаскивания

  // Обновление значений слайдера при изменении точек или крайних значений
  useEffect(() => {
    setSliderValues([min, ...points, max]);
  }, [points, min, max]);

  // Обработчик движения указателя
  const handlePointerMove = useCallback((event, index) => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    let offsetX = event.clientX - rect.left;

    // Убедитесь, что курсор не выходит за пределы слайдера
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

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
    if (newValue >= min && newValue <= max) {
      const newValues = [...sliderValues];
      newValues[index] = newValue;
      setSliderValues(newValues);
      const pointsOnly = newValues.slice(1, -1); // Исключаем крайние значения
      onChange(pointsOnly); // Вызываем onChange с обновленными точками
    }
  }, [min, max, sliderValues, onChange]);

  // Обработчик нажатия указателя
  const handlePointerDown = useCallback((event, index) => {
    isDragging.current = true;
    document.body.classList.add('dragging');
    const handlePointerMoveBound = (event) => handlePointerMove(event, index);
    const handlePointerUp = () => {
      document.body.classList.remove('dragging');
      document.removeEventListener('pointermove', handlePointerMoveBound);
      document.removeEventListener('pointerup', handlePointerUp);
      isDragging.current = false;
      console.log("Pointer Up");
    };

    document.addEventListener('pointermove', handlePointerMoveBound);
    document.addEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  // Обработчик клика по слайдеру для добавления новой точки
  const handleClick = useCallback((event) => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    let offsetX = event.clientX - rect.left;

    // Убедитесь, что курсор не выходит за пределы слайдера
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const newValue = Math.round(min + ((offsetX / rect.width) * (max - min)));

    // Проверка, чтобы новая точка находилась внутри допустимого диапазона
    if (newValue <= min || newValue >= max) {
      return;
    }

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
      onChange(pointsOnly); // Вызываем onChange с обновленными точками
    }
  }, [sliderValues, onChange]);

  return (
    <div
      className="relative w-9/12 h-8 mx-auto"
      ref={sliderRef}
      onClick={handleClick}
    >
      <div className="absolute top-1/2 w-full h-1 bg-gray-300 transform -translate-y-1/2"></div>
      {sliderValues.map((value, index) => (
        <SliderHandle
          key={index}
          position={((value - min) / (max - min)) * 100} // Позиция ползунка в процентах
          onMouseDown={(event) => handlePointerDown(event, index)}
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