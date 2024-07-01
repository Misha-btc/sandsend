import React from 'react';
import { useChoice } from '../../Contexts/ChosenUtxo';
import RangeInput from './RangeInput';

function SettingRanges({ dataKey }) {
    const { choice } = useChoice();
    const data = choice[dataKey]; // Access the data using the provided key

    if (!data) {
        return <div>No data found for the provided key.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center"> {/* Центрирование содержимого */}
            <div className='w-full h-full p-5 flex flex-col items-center m-2'>
                <div className="mb-2">
                    <strong>UTXO:</strong> {dataKey}:{dataKey}
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
                                {index+1}. {range.join(' - ')} {`(${range[1]-range[0]} sats)`}
                            </div>
                            <RangeInput dataKey={dataKey} rangeIndex={index}>
                                {range}
                            </RangeInput>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SettingRanges;