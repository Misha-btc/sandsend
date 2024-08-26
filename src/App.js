import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AddUtxo from './Components/AddUtxo';
import TransactionCanvas from './Components/TransactionCanvas/TransactionCanvas';
import CreateTransaction from './Components/TransactionCanvas/CreateTransaction';
import AddRecipient from './Components/AddRecipient';
import { TransactionProvider } from './Hooks/TransactionContext';

function App() {
  return (
    <React.StrictMode>
      <TransactionProvider>
        <Header />
        <AddUtxo />
        <AddRecipient />
        <CreateTransaction />
        <TransactionCanvas />
        <Footer />
      </TransactionProvider>
    </React.StrictMode>
  );
}

export default App;