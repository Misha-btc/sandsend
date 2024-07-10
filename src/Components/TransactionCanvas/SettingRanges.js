import React, { useState } from 'react';
import { useChoice } from '../../Contexts/ChosenUtxo';
import RangeInput from './RangeInput';
import RangeOutput from './RangeOutput';

function SettingRanges({ dataKey }) {
    const { choice } = useChoice();
    const data = choice[dataKey]; // Access the data using the provided key
    const [rangeOutputIndex, setRangeOutputIndex] = useState(null);

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
                <div className="w-1/2 flex p-2 justify-center flex-col"> {/* Центрирование элементов Sat ranges */}
                    {data.sat_ranges.map((range, index) => (
                        <div key={index}>
                            <RangeInput 
                                dataKey={dataKey} 
                                rangeIndex={index} 
                                setRangeOutput={setRangeOutputIndex} 
                            >
                                {range}
                            </RangeInput>
                        </div>
                    ))}
                </div>
                <div className="w-1/2 justify-center flex">
                    <div className='flex items-center justify-center'>
                        <RangeOutput show={data.new_ranges !== undefined}/>
                        {console.log(data.new_ranges)}
                    </div>
                </div>
            </div>
            <div className='flex justify-center mb-10 items-center w-full'>
                <input
                    className="border-2 border-black text-center w-1/2 rounded-xl"
                    type="text"
                    placeholder="General address"
                />   
            </div>
        </div>
    );
}

export default SettingRanges;