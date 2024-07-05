import React, { useState } from 'react';
import Button from '../Button'; // Импорт кнопки
import Modal from '../Modal/Modal'; // Импорт модального окна
import ModalHeader from '../Modal/ModalHeader'; // Импорт заголовка модального окна

// Компонент OutputElement отображает информацию о диапазоне (range) и модальное окно с деталями
const OutputElement = ({ range }) => {
  const [showUtxo, setShowUtxo] = useState(false); // Состояние для управления отображением модального окна

  // Функция для получения заголовка на основе range
  const getTitle = () => {
    if (range && range.address && range.sats) {
      // Если есть адрес и количество сатоши, возвращает обрезанный адрес
      return `${range.address.slice(0, 3)}...${range.address.slice(-7)}`;
    }
    if (!range.address && range.sats) {
      // Если нет адреса, но есть сатоши, возвращает 'No address'
      return 'No address';
    }
    if (range.address && !range.sats) {
      // Если есть адрес, но нет сатоши, возвращает 'No range'
      return 'No range';
    }
    return null; // В противном случае возвращает null
  };

  const title = getTitle(); // Получение заголовка для кнопки

  if (!title) {
    return null; // Если заголовка нет, компонент не отображается
  }

  return (
    <>
      <div>
        <Button
          onClick={() => setShowUtxo(!showUtxo)} // Переключение состояния отображения модального окна
          className={`rounded-xl mt-10 z-10 relative w-32 h-12 ${title === 'No address' ? 'bg-gray-400' : 'bg-orange-600'} text-white hover:bg-orange-700 shadow-md hover:drop-shadow-xl`}
          title={title} // Установка заголовка кнопки
        />
      
        <Modal show={showUtxo} onClose={() => setShowUtxo(false)}> {/* Управление отображением модального окна */}
          <ModalHeader title='OUTPUT' /> {/* Заголовок модального окна */}
          <div>
            {range.min && <p>Min: {range.min}</p>} {/* Отображение минимального значения диапазона, если оно есть */}
            {range.max && <p>Max: {range.max}</p>} {/* Отображение максимального значения диапазона, если оно есть */}
            {range.sats && <p>Sats: {range.sats}</p>} {/* Отображение количества сатоши, если оно есть */}
            {range.address && <p>Address: {range.address}</p>} {/* Отображение адреса, если он есть */}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default OutputElement;