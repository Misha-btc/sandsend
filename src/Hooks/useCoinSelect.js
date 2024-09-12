import { useCallback } from 'react';

function useCoinSelect() {
  return useCallback((outputs, temporaryOutput, setInput, setInputError, inputRef) => {
    const storedDetails = localStorage.getItem('transactionDetails');
    if (!storedDetails) return;

    const transactionDetails = JSON.parse(storedDetails);
    const totalOutputAmount = outputs.map((output, index) => {
      if (temporaryOutput.index === index) {
        const amount = parseFloat(temporaryOutput.amount || 0);
        return temporaryOutput.coinFormat === 'btc' ? amount * 100000000 : amount;
      }
      return parseFloat(output.amount || 0);
    }).reduce((sum, amount) => sum + amount, 0);

    let selectedUtxos = inputRef.current.filter(utxo => utxo.type === 'selected');
    let selectedAmount = selectedUtxos.reduce((sum, utxo) => sum + utxo.value, 0);

    const utxosArray = Object.entries(transactionDetails)
      .filter(([addressType]) => addressType.includes(':payment'))
      .flatMap(([_, utxos]) => Object.entries(utxos).map(([utxoKey, utxoDetails]) => ({
        ...utxoDetails,
        txid: utxoKey.split(':')[0],
        vout: parseInt(utxoKey.split(':')[1]),
        key: utxoKey,
        type: 'auto'
      })))
      .sort((a, b) => b.value - a.value);

    const availableUtxos = utxosArray.filter(utxo => 
      !selectedUtxos.some(selectedUtxo => selectedUtxo.txid === utxo.txid && selectedUtxo.vout === utxo.vout)
    );

    for (const utxo of availableUtxos) {
      if (selectedAmount >= totalOutputAmount) break;
      selectedUtxos.push(utxo);
      selectedAmount += utxo.value;
    }

    if (selectedAmount >= totalOutputAmount) {
      setInput(selectedUtxos);
    } else {
      setInputError('not enough utxos');
    }
  }, []);
}

export default useCoinSelect;