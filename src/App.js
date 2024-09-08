import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AddUtxo from './Components/AddUtxo';
import TransactionCanvas from './Components/TransactionCanvas/TransactionCanvas';
import AddRecipient from './Components/AddRecipient';
import { TransactionProvider } from './Contexts/TransactionContext';
import { WalletProvider } from './Contexts/WalletContext';
import { NetworkProvider } from './Contexts/NetworkContext';

function App() {
  return (
    <React.StrictMode>
      <NetworkProvider>
        <WalletProvider>
          <TransactionProvider>
            <Header />
            <AddUtxo />
            <AddRecipient />
            <TransactionCanvas />
            <Footer />
          </TransactionProvider>
        </WalletProvider>
      </NetworkProvider>
    </React.StrictMode>
  );
}

export default App;