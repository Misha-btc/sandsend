import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AddUtxo from './Components/AddUtxo';
import {ChoiceProvider} from './Contexts/ChosenUtxo';
import TransactionCanvas from './Components/TransactionCanvas/TransactionCanvas';

function App() {
  return (
    <div>
      <React.StrictMode>
      <div className="flex flex-col h-screen">
        <Header />
        <ChoiceProvider>
          <AddUtxo />
            <TransactionCanvas>
            </TransactionCanvas>
        </ChoiceProvider>
        <Footer />
      </div>
      </React.StrictMode>
    </div>
  );
}

export default App;
