import { useCallback } from 'react';

function useCalculateChange() {
  return useCallback((input, outputs, temporaryOutput, setChange) => {
    const sum_inputs = input.reduce((sum, input) => sum + input.value, 0);
    const sum_outputs = outputs.map((output, index) => {
      if (temporaryOutput.index === index) {
        const amount = parseFloat(temporaryOutput.amount || 0);
        return temporaryOutput.coinFormat === 'btc' ? amount * 100000000 : amount;
      }
      return parseFloat(output.amount || 0);
    }).reduce((sum, amount) => sum + amount, 0);
    const difference = Math.max(sum_inputs - sum_outputs, 0);
    setChange(difference);
    return difference;
  }, []);
}

export default useCalculateChange;