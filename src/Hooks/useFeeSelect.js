import { useCallback } from 'react';

const useFeeSelect = () => {
  const selectOptimalFee = useCallback((totalFee, change) => {
    const storedDetails = localStorage.getItem('transactionDetails');
    if (!storedDetails) return null;

    const transactionDetails = JSON.parse(storedDetails);
    const feeInput = Object.entries(transactionDetails)
      .filter(([addressType]) => addressType.includes(':payment'))
      .flatMap(([_, utxos]) => Object.entries(utxos).map(([utxoKey, utxoDetails]) => ({
        ...utxoDetails,
        txid: utxoKey.split(':')[0],
        vout: parseInt(utxoKey.split(':')[1]),
        key: utxoKey,
        type: 'auto'
      })))
      .sort((a, b) => a.value - b.value); // Сортируем по возрастанию, чтобы выбрать минимально необходимый UTXO

    const requiredAmount = totalFee - change;
    const feeUtxo = feeInput.find(utxo => utxo.value >= requiredAmount);

    if (feeUtxo) {
      return feeUtxo;
    }
    return null;
  }, []);

  return selectOptimalFee;
};

export default useFeeSelect;
