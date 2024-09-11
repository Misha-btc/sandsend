import React from 'react';

const Toggle = ( {isToggled, setIsToggled} ) => {
  // Функция для изменения состояния тогла
  const handleToggle = () => {
    setIsToggled(prevState => !prevState);
  };

  return (
    <div
      onClick={handleToggle}
      style={{
        width: '15px',
        height: '30px',
        borderRadius: '10px',
        backgroundColor: isToggled ? 'green' : 'grey',
        cursor: 'pointer',
        display: 'flex',
        alignItems: isToggled ? 'flex-end' : 'flex-start',
        justifyContent: 'center',
        padding: '2px',
        transition: 'background-color 0.3s ease, align-items 0.3s ease'
      }}
    >
      {/* Круглый индикатор тогла */}
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 0 1px rgba(0, 0, 0, 0.5)'
        }}
      ></div>
    </div>
  );
};

export default Toggle;