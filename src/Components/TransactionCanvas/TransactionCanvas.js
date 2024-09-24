import React, { useEffect, useState } from 'react';
import { useTransaction } from '../../Contexts/TransactionContext';
import Output from './Output';
import InputElement from './InputElement';
import FeeElement from './FeeElement';
import Button from '../Button'; // Импортируем кнопку
import { useWallet } from '../../Contexts/WalletContext';
import CreateTransaction from './CreateTransaction';
import AddRecipient from '../AddRecipient';
import { useFees } from '../../Contexts/feesContext';
import FeeInput from './FeeInput';
import ChangeOutput from './ChangeOutput';

function TransactionCanvas() {
  const { outputs, removeOutput, input, removeInput, removeAll, updateSpecificOutput} = useTransaction();
  const { isConnected } = useWallet();
  const { totalFee, feeInput, totalChange, dust, setDust, setTotalChange, dustWay, setDustWay, setTotalFee, dustToFee, dustToChange, setDustToFee, setDustToChange } = useFees();

  useEffect(() => {
    setDustWay(null);
    setDust(0);
    setDustToFee(false);
  }, [outputs, input, setDustWay, setDust, removeOutput, removeInput, setDustToFee, removeAll]);


  if (!isConnected) {
    return null; // Ничего не рендерим, если кошелек не подключен
  }

  const handleDust = (type) => {
    if (type === 'fee') {
      setDustWay('fee');
      setTotalFee(dust);
      setDustToFee(true);
      setDust(0);
    } else if (type === 'output') {
      setDustWay('output');
      const lastOutput = outputs[outputs.length - 1];
      updateSpecificOutput(outputs.length - 1, { amount: lastOutput.amount + dust - totalFee });
      setDust(0);
    }
  }

  return (
    <div className="w-full min-h-screen h-full bg-zinc-900 pt-20 pb-10">
      <div className="w-full h-full overflow-y-auto bg-zinc-900 p-4">
        <div className="flex h-full">
          {/* Левая часть экрана */}
          <div className="w-1/2">
            <h2 className="text-white text-xl mb-4 text-center">INPUTS</h2>
            <div className="flex flex-col items-center">
              {input.length > 0 ? (
                input.map((input, index) => (
                  <InputElement
                    key={index}
                    input={input}
                    index={index}
                    removeInput={removeInput}
                  />
                ))
              ) : (
                <p className="text-gray-400">Нет входов для отображения</p>
              )}
              {feeInput && feeInput.length > 0 && (
                feeInput.map((feeInput, index) => (
                  <FeeInput
                    key={`fee-${index}`}
                    input={feeInput}
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
          <h2 className="text-green-500 text-xl mb-4 absolute top-50 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">sats left</h2>
          {/* Правая часть экрана с выходными элементами */}
          <div className="w-1/2 pl-4">
            <h2 className="text-white text-xl mb-4 text-center">OUTPUTS</h2>
            <div className="flex flex-col items-center">
              {outputs.length > 0 ? (
                outputs.map((output, index) => (
                  <Output
                    key={index}
                    output={output}
                    index={index}
                    removeOutput={removeOutput}
                  />
                ))
              ) : (
                <p className="text-gray-400">Нет выходов для отображения</p>
              )}
              <AddRecipient />
              {totalChange > 0 && (
                <ChangeOutput title="change" changeOutput={totalChange}/>
              )}
              {dust > 0 ? (
                <ChangeOutput title="dust" changeOutput={dust}>
                  <div className="flex flex-row bg-orange-600 rounded-bl-md rounded-br-md mt-2">
                    <div className="absolute top-0 right-0 p-1">
                      <span 
                        className="text-white cursor-pointer" 
                        onClick={() => alert(
                          "Dust is a small amount of bitcoin that is too small to send economically. " +
                          "You can add it to the fee or to the previous output."
                        )}
                      >
                        ?
                      </span>
                    </div>
                    <Button
                      onClick={() => handleDust('fee')}
                      title="fee"
                      className="w-1/2 text-white rounded-bl-md"
                    />
                    <Button
                      onClick={() => handleDust('output')}
                      title="prev output"
                      className="w-1/2 text-white rounded-br-md"
                    />
                  </div>
                </ChangeOutput>
              ) : (
                totalFee > 0 && <ChangeOutput title="fee" changeOutput={totalFee}/>
              )}
            </div>
          </div>
        </div>

      </div>
      <FeeElement />
      <div className="fixed bottom-16 left-16">
        <Button
          title="Clear"
          onClick={removeAll}
          className="bg-cyan-600 text-white p-2 rounded hover:bg-cyan-500"
        />
      </div>
      <CreateTransaction />
    </div>
  );
}

export default TransactionCanvas;