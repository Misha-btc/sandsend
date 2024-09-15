import { useCallback } from 'react';

const useFeeSelect = () => {
  const selectOptimalFee = useCallback((totalFee, change, input, bytesPerType, paymentAddressType, getFeeValue, balanceChange) => {
    const storedDetails = localStorage.getItem('transactionDetails');
    if (!storedDetails) return;

    let feeUtxos = [];
    let feeBytes = 0;
    let feeSum = 0;
    console.log('input', input);
    let selectedUtxos = input.filter(utxo => utxo.type === 'selected' || utxo.type === 'auto');
    
    if (input.length <= 0) {
      console.log('selectedUtxos', selectedUtxos);
      return null;
    }

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

    console.log('utxosArray', utxosArray);
    const availableUtxos = utxosArray.filter(utxo => 
      !selectedUtxos.some(selectedUtxo => selectedUtxo.txid === utxo.txid && selectedUtxo.vout === utxo.vout)
    );
    console.log('availableUtxos', availableUtxos);
    let requiredAmount = change - totalFee; //-1440000
    let balanceRemain = balanceChange; //balanceChange = balance - inputTotalAmount - totalFee

    const MAX_ITERATIONS = availableUtxos.length; // Можно настроить это значение
    let iterations = 0;

    for (const utxo of availableUtxos) {
      if (utxo.value <= getFeeValue(bytesPerType[paymentAddressType].input)) {
        break; // Пропускаем UTXO, если его значение меньше или равно комиссии за его использование
      }

      if (requiredAmount >= 0 || balanceRemain <= totalFee + feeSum) break; //-1440000 >= 0 || 3714678 <= 1440000 + 0
      if (iterations++ > MAX_ITERATIONS) {
        return null;
      }
      selectedUtxos.push(utxo);
      feeUtxos.push(utxo);
      feeBytes += bytesPerType[paymentAddressType].input;
      feeSum += getFeeValue(feeBytes); //910000 комиссия внутри этого ХУКА
      requiredAmount -= feeSum; //1440000 - 910000 = 530000
      requiredAmount += utxo.value; //530000 + 
      balanceRemain -= utxo.value - feeSum; //3714678 - 3354546 - 910000 = 490132
      if (feeSum + totalFee > balanceRemain) {//910000 + 1440000 > 490132
        
        return null;
      } else if (requiredAmount >= 0) {
        return feeUtxos;
      }
    }
    return null;
  }, []);

  return selectOptimalFee;
};

export default useFeeSelect;
