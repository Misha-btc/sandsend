import React, { useRef, useEffect, useState, useCallback } from 'react';
import InputElement from './InputElement';
import OutputsSpace from './OutputsSpace';
import { useChoice } from '../../Contexts/ChosenUtxo';
import Lines from './Lines';

// Основной компонент для отображения выбранных UTXOs и соединения их линиями
const SelectedUtxos = () => {
  const { choice } = useChoice(); // Получение выбранных UTXOs из контекста
  const [lines, setLines] = useState([]); // Состояние для хранения координат линий
  const refs = useRef({}); // Использование useRef для хранения ссылок на элементы
  const containerRef = useRef(null); // Ссылка на основной контейнер

  // Функция для регистрации рефов на OutputElement
  const registerOutputRef = (utxoKey, index, element) => {
    if (!refs.current[utxoKey]) {
      refs.current[utxoKey] = { input: null, outputs: [] }; // Инициализация объекта, если он еще не существует
    }
    refs.current[utxoKey].outputs[index] = element; // Добавление рефа для OutputElement
  };

  // Функция для обновления координат линий
  const updateLines = useCallback(() => {
    const containerRect = containerRef.current.getBoundingClientRect(); // Получение координат контейнера
    const newLines = Object.keys(choice).flatMap(key => {
      const inputElement = refs.current[key]?.input; // Получение рефа на InputElement
      const outputElements = refs.current[key]?.outputs; // Получение рефов на OutputElement

      if (inputElement && outputElements) {
        const inputRect = inputElement.getBoundingClientRect(); // Получение координат InputElement

        return outputElements.map(outputElement => {
          if (outputElement) {
            const outputRect = outputElement.getBoundingClientRect(); // Получение координат OutputElement
            // Проверка, что элемент видим на экране
            if (outputRect.width === 0 && outputRect.height === 0) {
              return null; // Если элемент невидим, пропускаем его
            }
            const startX = inputRect.left + inputRect.width / 2 - containerRect.left; // Вычисление x-координаты центра InputElement
            const startY = inputRect.top + inputRect.height / 2 - containerRect.top; // Вычисление y-координаты центра InputElement
            const endX = outputRect.left + outputRect.width / 2 - containerRect.left; // Вычисление x-координаты центра OutputElement
            const endY = outputRect.top + outputRect.height / 2 - containerRect.top; // Вычисление y-координаты центра OutputElement
            return {
              start: { x: startX, y: startY },
              end: { x: endX, y: endY },
            }; // Возвращение объекта с координатами линии
          }
          return null; // Если outputElement не существует или невидим, вернуть null
        }).filter(line => line !== null); // Фильтрация null-значений
      }
      return [];
    });

    setLines(newLines); // Обновление состояния линий
  }, [choice]);

  useEffect(() => {
    updateLines(); // Обновление линий при монтировании компонента

    const handleScrollAndResize = () => {
      updateLines();
    };

    window.addEventListener('resize', handleScrollAndResize); // Обновление линий при изменении размеров окна
    window.addEventListener('scroll', handleScrollAndResize); // Обновление линий при прокрутке страницы

    return () => {
      window.removeEventListener('resize', handleScrollAndResize); // Очистка обработчика события при размонтировании компонента
      window.removeEventListener('scroll', handleScrollAndResize); // Очистка обработчика события при размонтировании компонента
    };
  }, [updateLines]); // Эффект зависит от изменения updateLines

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {Object.keys(choice).map(key => (
        <div key={key} className='flex items-center mt-10'>
          <div className='w-1/2 flex justify-center'>
            <div ref={el => {
              if (!refs.current[key]) {
                refs.current[key] = { input: null, outputs: [] }; // Инициализация объекта, если он еще не существует
              }
              refs.current[key].input = el; // Добавление рефа для InputElement
            }}>
              <InputElement utxoKey={key} /> {/* Отображение InputElement */}
            </div>
          </div>
          <div className='w-1/2 flex flex-col items-center justify-center'>
            <OutputsSpace utxoKey={key} registerOutputRef={registerOutputRef} /> {/* Отображение OutputsSpace с передачей функции регистрации рефов */}
          </div>
        </div>
      ))}
      <Lines lines={lines} /> {/* Отображение линий */}
    </div>
  );
};

export default SelectedUtxos;