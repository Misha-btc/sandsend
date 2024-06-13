import React, { useRef, useEffect } from 'react';

const PointButton = ({ onDragStart }) => {
  const pointButtonRef = useRef(null);

  useEffect(() => {
    const pointButton = pointButtonRef.current;
    const handlePointerDown = (event) => {
      onDragStart(event);
    };

    pointButton.addEventListener('pointerdown', handlePointerDown);

    return () => {
      pointButton.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [onDragStart]);

  return (
    <div
      className="mt-10 w-5 h-5 bg-green-500 rounded-full cursor-pointer"
      ref={pointButtonRef}
    ></div>
  );
};

export default PointButton;