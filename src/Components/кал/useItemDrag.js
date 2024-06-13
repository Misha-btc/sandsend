import { useState, useCallback } from 'react';
import { useModal } from '../../Contexts/ModalContext';

const useItemDrag = (scale) => {
  const { showModal } = useModal(); // Получаем состояние модального окна из контекста

  const [itemPositions, setItemPositions] = useState([]);
  const [draggingItemIndex, setDraggingItemIndex] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleItemMouseDown = (index, event) => {
    if (showModal) return; // Блокируем взаимодействие, если модальное окно открыто

    event.stopPropagation();
    setDraggingItemIndex(index);
    setDragStart({
      x: event.clientX - itemPositions[index].x * scale,
      y: event.clientY - itemPositions[index].y * scale,
    });
  };

  const handleItemMouseMove = useCallback((event) => {
    if (draggingItemIndex !== null && !showModal) {
      const newX = (event.clientX - dragStart.x) / scale;
      const newY = (event.clientY - dragStart.y) / scale;

      setItemPositions((prevPositions) => {
        const newPositions = [...prevPositions];
        newPositions[draggingItemIndex] = { x: newX, y: newY };
        return newPositions;
      });
    }
  }, [draggingItemIndex, dragStart, scale, showModal]);

  const handleItemMouseUp = useCallback(() => {
    setDraggingItemIndex(null);
  }, []);

  return {
    itemPositions,
    setItemPositions,
    draggingItemIndex,
    handleItemMouseDown,
    handleItemMouseMove,
    handleItemMouseUp,
  };
};

export default useItemDrag;