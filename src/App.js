import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AddUtxo from './Components/AddUtxo';
import { ChoiceProvider } from './Contexts/ChosenUtxo';
import TransactionCanvas from './Components/TransactionCanvas/TransactionCanvas';

function App() {
  return (
      <React.StrictMode>
        <Header />
        <ChoiceProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow mt-3 mb-1 flex flex-col h-full">
              <AddUtxo />
              <TransactionCanvas />
            </div>
          </div>
        </ChoiceProvider>
        <Footer />
      </React.StrictMode>
  );
}

export default App;