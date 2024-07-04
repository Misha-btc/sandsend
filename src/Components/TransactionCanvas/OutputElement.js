import React, { useRef, useState, useEffect } from 'react';
import Button from '../Button';
import Modal from '../Modal/Modal';
import ModalHeader from '../Modal/ModalHeader';
import { useChoice } from '../../Contexts/ChosenUtxo';

const OutputElement = ({ range, containerRef, containerInfo, containerPosition }) => {
  const [showUtxo, setShowUtxo] = useState(false);
  const elementRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { updateRangePosition } = useChoice();

  const getTitle = () => {
    if (range && range.address && range.sats) {
      return `${range.address.slice(0, 3)}...${range.address.slice(-7)}`;
    }
    if (!range.address && range.sats) {
      return 'No address';
    }
    if (range.address && !range.sats) {
      return 'No range';
    }
    return null; // Если нет адреса и диапазона, не рендерим элемент
  };

  const title = getTitle();

  const updatePosition = () => {
    if (elementRef.current && containerRef.current && containerInfo.width > 0 && containerInfo.height > 0) {
      const elementRect = elementRef.current.getBoundingClientRect();
      const newPosition = {
        x: ((elementRect.left + elementRect.width / 2 - containerPosition.left) / containerInfo.width) * 100 + 50, // Позиция относительно ширины контейнера в процентах, с учетом центра элемента и смещения на половину контейнера
        y: ((elementRect.top + elementRect.height / 2 - containerPosition.top) / containerInfo.height) * 100 + 1 // Позиция относительно высоты контейнера в процентах, с учетом центра элемента
      };
      console.log("Element position:", newPosition); // Debugging log
      if (!isNaN(newPosition.x) && !isNaN(newPosition.y)) {
        setPosition(newPosition);
        updateRangePosition(range.key, range.index, range.arrayIndex, newPosition); // Обновляем позицию в контексте
      }
    }
  };

  useEffect(() => {
    updatePosition();
  }, [containerInfo, containerPosition]); // Обновляем позицию при изменении размеров контейнера

  useEffect(() => {
    if (elementRef.current) {
      updatePosition();
    }
  }, [elementRef, containerRef]); // Убедимся, что позиция обновляется при первом рендере

  if (!title) {
    return null; // Не рендерим элемент, если нет адреса и диапазона
  }

  return (
    <>
      <div ref={elementRef} className='mb-6 z-20'>
        <Button
          onClick={() => setShowUtxo(!showUtxo)}
          className={`rounded-xl p-3 w-32 h-12 ${title === 'No address' ? 'bg-gray-400' : 'bg-orange-600'} text-white hover:bg-orange-700 shadow-md hover:drop-shadow-xl`}
          title={title}
        />
      </div>
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
        <ModalHeader title='OUTPUT' />
        <div>
          {range.min && <p>Min: {range.min}</p>}
          {range.max && <p>Max: {range.max}</p>}
          {range.sats && <p>Sats: {range.sats}</p>}
          {range.address && <p>Address: {range.address}</p>}
          <p>Position: {`x: ${position.x}%, y: ${position.y}%`}</p>
        </div>
      </Modal>
    </>
  );
};

export default OutputElement;