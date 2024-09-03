import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AddUtxo from './Components/AddUtxo';
import TransactionCanvas from './Components/TransactionCanvas/TransactionCanvas';
import CreateTransaction from './Components/TransactionCanvas/CreateTransaction';
import AddRecipient from './Components/AddRecipient';
import { TransactionProvider } from './Contexts/TransactionContext';
import { WalletProvider } from './Contexts/WalletContext';
import SignPSBT from './Components/TransactionCanvas/SignPSBT';

function App() {
  return (
    <React.StrictMode>
      <WalletProvider>
        <TransactionProvider>
          <Header />
          <AddUtxo />
          <AddRecipient />
          <CreateTransaction />
          <SignPSBT />
          <TransactionCanvas />
          <Footer />
        </TransactionProvider>
      </WalletProvider>
    </React.StrictMode>
  );
}

export default App;