import React, { useState } from 'react';
import Button from '../Button';
import { useFees } from '../../Contexts/feesContext';
import useMempoolInfo from '../../Hooks/useMempoolInfo';
import Toggle from '../Toggle';
import { useTransaction } from '../../Contexts/TransactionContext';

const FeeElement = () => {
  const { fees } = useMempoolInfo();
  const { estimatedFee, feeState, setFeeState } = useFees();
  const [customFee, setCustomFee] = useState('');
  const [confirmFee, setConfirmFee] = useState(false);
  const [feeOut, setFeeOut] = useState(false);
  const { setFee } = useTransaction();

  const getFeeValue = (type) => {
    if (type !== 'custom') {
      const index = type === 'low' ? 1 : type === 'medium' ? 2 : type === 'high' ? 3 : 0;
      if (fees && fees[index]) {
        const totalFee = Math.ceil(fees[index] * estimatedFee);
        setFee(totalFee.toFixed(2));
        return totalFee.toFixed(2);
      } else {
        setFee(0);
        return 0;
      }
    } else {
      const totalFee = customFee * estimatedFee;
      setFee(totalFee.toFixed(0));
      return totalFee.toFixed(0);
    }
  }

  const handleFeeChange = (type) => {
    if (type !== 'custom') {
      setFeeState(type);
    } else {
      setFeeState('custom');
      setConfirmFee(false);
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
            <p className='text-sm pl-2 text-gray-500'>Estimated fee: {getFeeValue(feeState)} ~ {(getFeeValue(feeState) * 0.0006).toFixed(2) }USD</p>
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
