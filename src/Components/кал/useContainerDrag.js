import { useState, useCallback } from 'react';
import { useModal } from '../Contexts/ModalContext';

// Хук для управления перетаскиванием контейнера
const useContainerDrag = (scale) => {
  const { showModal } = useModal(); // Получаем состояние модального окна из контекста

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event) => {
    if (showModal) return; // Блокируем взаимодействие, если модальное окно открыто

    setIsDragging(true);
    setDragStart({
      x: event.clientX - position.x * scale,
      y: event.clientY - position.y * scale,
    });
  }, [position, scale, showModal]);

  const handleMouseMove = useCallback((event) => {
    if (isDragging && !showModal) {
      const newX = (event.clientX - dragStart.x) / scale;
      const newY = (event.clientY - dragStart.y) / scale;
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragStart, scale, showModal]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export default useContainerDrag;