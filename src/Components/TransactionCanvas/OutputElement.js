import React, { useRef, useEffect, useState } from 'react';
import Button from '../Button';
import Modal from '../Modal/Modal';
import ModalHeader from '../Modal/ModalHeader';
import { useChoice } from '../../Contexts/ChosenUtxo';

const OutputElement = ({ range, containerRef }) => {
  const [showUtxo, setShowUtxo] = useState(false);
  const elementRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { updateRangePosition } = useChoice();

  const getTitle = () => {
    if (range && range.address) {
      return `${range.address.slice(0, 3)}...${range.address.slice(-7)}`;
    }
    return 'No range';
  };

  const updatePosition = () => {
    if (elementRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();
      const newPosition = {
        x: elementRect.left - containerRect.left,
        y: elementRect.top - containerRect.top
      };
      setPosition(newPosition);
      updateRangePosition(range.key, range.index, range.arrayIndex, newPosition); // Передаем ключ, индекс и новую позицию
    }
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, []);

  return (
    <>
      <div ref={elementRef} className='mb-2 z-20'>
        <Button
          onClick={() => setShowUtxo(!showUtxo)}
          className='rounded-xl hover:bg-orange-700 bg-orange-600 text-white p-3 w-32 h-12'
          title={getTitle()}
        />
      </div>
      <Modal show={showUtxo} onClose={() => setShowUtxo(false)}>
        <ModalHeader title='OUTPUT' />
        <div>
          <p>Min: {range.min}</p>
          <p>Max: {range.max}</p>
          <p>Sats: {range.sats}</p>
          <p>Address: {range.address}</p>
          <p>Position: {`x: ${position.x}, y: ${position.y}`}</p>
        </div>
      </Modal>
    </>
  );
};

export default OutputElement;