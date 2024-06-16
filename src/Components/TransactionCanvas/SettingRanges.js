import React, { useEffect } from 'react';
import { useChoice } from '../../Contexts/ChosenUtxo';
import MultiRangeSlider from './MultiRangeSlider';

function SettingRanges({ dataKey }) {
    const { choice } = useChoice();
    const data = choice[dataKey]; // Access the data using the provided key

    useEffect(() => {
        console.log('Переданный ключ:', dataKey);
        console.log('Данные для ключа:', data);
    }, [dataKey, data]);

    if (!data) {
        return <div>No data found for the provided key.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center"> {/* Центрирование содержимого */}
            <div className='w-full h-full p-5 flex flex-col items-center m-2'>
                <div className="mb-2">
                    <strong>UTXO:</strong> {data.txid}:{data.vout}
                </div>
                <div className="mb-2">
                    <strong>Value:</strong> {data.value} sats
                </div>
                <div className="mb-2">
                    <strong>Address:</strong> {data.address}
                </div>
                <strong className="mb-4">Sat ranges:</strong>
                <div className="flex flex-col items-center w-full"> {/* Центрирование элементов Sat ranges */}
                    {data.sat_ranges.map((range, index) => (
                        <div key={index} className="mb-4 w-full flex flex-col items-center"> {/* Установка ширины и отступов */}
                            <div className="mb-2 text-center">
                                {index+1}. {range.join(' - ')}
                            </div>
                            <MultiRangeSlider min={range[0]} max={range[1]} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SettingRanges;