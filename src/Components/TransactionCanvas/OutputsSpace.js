import React, { useEffect, useState } from 'react';
import OutputElement from './OutputElement'

const OutputsSpace = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const extractAddressesFromLocalStorage = () => {
      // Извлекаем данные из localStorage
      const savedData = localStorage.getItem('myData');
      if (!savedData) {
        console.log('No data found in localStorage');
        return [];
      }

      // Парсим данные
      const parsedData = JSON.parse(savedData);
      const addresses = [];

      // Перебираем ключи верхнего уровня в объекте parsedData
      for (const dataKey in parsedData) {
        if (parsedData.hasOwnProperty(dataKey)) {
          const ranges = parsedData[dataKey];

          // Перебираем вложенные ключи (rangeIndex)
          for (const rangeIndex in ranges) {
            if (ranges.hasOwnProperty(rangeIndex)) {
              const rangeArray = ranges[rangeIndex];

              // Перебираем массив объектов внутри каждого rangeIndex
              rangeArray.forEach(range => {
                addresses.push(range.address);
              });
            }
          }
        }
      }

      return addresses;
    };

    // Извлекаем адреса и устанавливаем состояние
    setAddresses(extractAddressesFromLocalStorage());
  }, []);

  return (
    <div className='w-full h-full p-10 flex flex-col min-h-screen m-6 items-center'>
      {addresses.map((address, index) => (
        <div key={index} className="mb-2 w-32 h-12 rounded-xl">
          <OutputElement address={address}/>
        </div>
      ))}
    </div>
  );
};

export default OutputsSpace;