import React, { useState } from 'react';
import Button from '../Button';
import { useFees } from '../../Contexts/feesContext';


const FeeElement = () => {
  const { feeState, setFeeState, customFee, setCustomFee, totalFee, setConfirmFee, confirmFee } = useFees();

  const handleFeeChange = (type) => {
    setConfirmFee(false);
    if (type !== 'custom') {
      setFeeState(type);

      setCustomFee('');
    } else {
      setFeeState(type);
      return
    }
  }

const handleCustomFeeChange = (e) => {
  if (e.target.value === '0') {
    return setCustomFee('');
  } else {
    setCustomFee(e.target.value);
  }
};

const handleConfirmFee = () => {
  if (customFee === '') {
    return setConfirmFee(false);
  } else {
    setConfirmFee(true);
  }
}

return (
    <div className="fixed bottom-10 bg-zinc-300 items-center text-gray-600 left-1/2 w-1/3 transform -translate-x-1/2 rounded-lg shadow-md mb-4 border-4 border-white">
        <div className='flex flex-row items-center justify-between pb-2'>
          <div>
            <p className='text-sm pl-2 text-gray-500'>Estimated fee: {totalFee} ~ {(totalFee * 0.0006).toFixed(2) }USD</p>
          </div>
        </div>
        {feeState === 'custom' && confirmFee === false && (
          <div className='flex flex-row items-center mb-2 justify-center'>
            <input 
              type="number" 
              className="w-20 h-8 rounded-lg text-center" 
              placeholder="sat/vB" 
              value={customFee} 
              onChange={handleCustomFeeChange} 
            />
            <Button
              title="set"
              className="w-16 ml-2 bg-green-500 text-white rounded-lg text-sm text-center"
              onClick={handleConfirmFee}
            />
          </div>
        )}
        <div className='flex flex-row items-center justify-center p-2'>
          <Button
            title="low"
            onClick={() => handleFeeChange('low')}
            className={`w-full text-sm border-zinc-900 rounded-md hover:text-orange-500 ${feeState === 'low' ? 'bg-orange-500 hover:text-white text-white' : ''}`}
          />
          <Button
            title="medium"
            onClick={() => handleFeeChange('medium')}
            className={`w-full  text-sm border-zinc-900 rounded-md hover:text-orange-500 ${feeState === 'medium' ? 'bg-orange-500 hover:text-white text-white' : ''}`}
          />
          <Button
            title="high"
            onClick={() => handleFeeChange('high')}
            className={`w-full  text-sm border-zinc-900 rounded-md hover:text-orange-500 ${feeState === 'high' ? 'bg-orange-500 text-white hover:text-white' : ''}`}
          />
          <Button
            title={customFee && confirmFee === true ? customFee + ' sat/vB' : 'custom'}
            onClick={() => handleFeeChange('custom')}
            className={`w-full  text-sm border-zinc-900 rounded-md hover:text-orange-500 ${feeState === 'custom' ? 'bg-orange-500 text-white hover:text-white' : ''}`}
          />
        </div>
    </div>
)
};
export default FeeElement;
