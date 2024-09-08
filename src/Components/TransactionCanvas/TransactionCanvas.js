import React from 'react';
import { useTransaction } from '../../Contexts/TransactionContext';
import OutputElement from './OutputElement';
import InputElement from './InputElement';
import Button from '../Button'; // Импортируем кнопку
import { useWallet } from '../../Contexts/WalletContext';

function TransactionCanvas() {
  const { outputs, removeOutput, input, removeInput, change, removeAll } = useTransaction();
  const { isConnected } = useWallet();

  if (!isConnected) {
    return null; // Ничего не рендерим, если кошелек не подключен
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
            </div>
          </div>
          <h2 className="text-green-500 text-xl mb-4 text-center">CHANGE {change}</h2>
          {/* Правая часть экрана с выходными элементами */}
          <div className="w-1/2 pl-4">
            <h2 className="text-white text-xl mb-4 text-center">OUTPUTS</h2>
            <div className="flex flex-col items-center">
              {outputs.length > 0 ? (
                outputs.map((output, index) => (
                  <OutputElement
                    key={index}
                    output={output}
                    index={index}
                    removeOutput={removeOutput}
                  />
                ))
              ) : (
                <p className="text-gray-400">Нет выходов для отображения</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-16 left-16">
        <Button
          title="Clear"
          onClick={removeAll}
          className="bg-cyan-400 text-white p-2 rounded bg-opacity-60 hover:bg-opacity-80" // Использована bg-opacity для прозрачности
        />
      </div>
    </div>
  );
}

export default TransactionCanvas;