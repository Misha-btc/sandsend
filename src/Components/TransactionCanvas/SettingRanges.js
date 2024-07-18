import React, { useState } from 'react';
import { useChoice } from '../../Contexts/ChosenUtxo';
import RangeInput from './RangeInput';
import RangeOutput from './RangeOutput';

function SettingRanges({ dataKey }) {
    const { choice } = useChoice();
    const data = choice[dataKey]; // Access the data using the provided key
    const [removeInfo, setRemoveInfo] = useState({ mainIndex: null, subIndex: null });

    if (!data) {
        return <div>No data found for the provided key.</div>;
    }

    return (
        <div className="flex flex-col"> {/* Центрирование содержимого */}
            <div className='w-full p-2'>
                <div className="mb-2 flex-row font-bold items-end">
                    <span className="mr-1 items-end">UTXO:</span>
                    <span className="text-base">{dataKey}</span>
                </div>
                <div className="mb-2">
                    <strong>Value:</strong> {data.value} sats
                </div>
                <div className="mb-2">
                    <strong>Address:</strong> {data.address}
                </div>
                <strong className="mb-4">Sat ranges:</strong>
            </div>
            <div className='flex flex-row'>
                <div className="w-1/2 flex p-2 justify-center flex-col "> {/* Центрирование элементов Sat ranges */}
                    {data.sat_ranges.map((range, index) => (
                        <div key={index}>
                            <RangeInput 
                                dataKey={dataKey}
                                rangeIndex={index} 
                                setRemoveInfo={setRemoveInfo}
                            >
                                {range}
                            </RangeInput>
                        </div>
                    ))}
                </div>
                <div className="w-1/2 justify-center flex">
                    <div className='flex items-center justify-center'>
                        <RangeOutput 
                          dataKey={dataKey}
                          removeInfo={removeInfo} // Передаем removeInfo в RangeOutput
                          />
                    </div>
                </div>
            </div>
            <div className='flex justify-center mb-10 items-center w-full'>
                <input
                    className="bg-zinc-200 text-white border-zinc-800 border-8 text-center w-1/2 rounded-full"
                    type="text"
                    placeholder="General address"
                />   
            </div>
        </div>
    );
}

export default SettingRanges;