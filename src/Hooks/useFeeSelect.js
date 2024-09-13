import { useCallback } from 'react';

const useFeeSelect = () => {
  const selectOptimalFee = useCallback((totalFee, change, input, bytesPerType, paymentAddressType, getFeeValue, balanceChange) => {
    const storedDetails = localStorage.getItem('transactionDetails');
    if (!storedDetails) return;

    let feeUtxos = [];
    let feeBytes = 0;
    let feeSum = 0;
    let selectedUtxos = input.filter(utxo => utxo.type === 'selected' || utxo.type === 'auto');

    const transactionDetails = JSON.parse(storedDetails);
    const utxosArray = Object.entries(transactionDetails)
      .filter(([addressType]) => addressType.includes(':payment'))
      .flatMap(([_, utxos]) => Object.entries(utxos).map(([utxoKey, utxoDetails]) => ({
        ...utxoDetails,
        txid: utxoKey.split(':')[0],
        vout: parseInt(utxoKey.split(':')[1]),
        key: utxoKey,
        type: 'fee'
      })))
      .sort((a, b) => b.value - a.value);

    const availableUtxos = utxosArray.filter(utxo => 
      !selectedUtxos.some(selectedUtxo => selectedUtxo.txid === utxo.txid && selectedUtxo.vout === utxo.vout)
    );
    
    let requiredAmount = change - totalFee;

    for (const utxo of availableUtxos) {
      if (requiredAmount >= 0 || balanceChange < feeSum) break;
      selectedUtxos.push(utxo);
      feeUtxos.push(utxo);
      feeBytes += bytesPerType[paymentAddressType].input;
      feeSum += getFeeValue(feeBytes);
      requiredAmount -= getFeeValue(feeBytes);
      requiredAmount += utxo.value;
      if (requiredAmount >= 0) {
        return feeUtxos;
      }
    }
    return null;
  }, []);

  return selectOptimalFee;
};

export default useFeeSelect;
