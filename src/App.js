import React from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AddUtxo from './Components/AddUtxo';
import {ChoiceProvider} from './Contexts/ChosenUtxo';

function App() {
  return (
    <div>
      <React.StrictMode>
        <Header />
        <ChoiceProvider>
          <AddUtxo />
        </ChoiceProvider>
        <Footer />
      </React.StrictMode>
    </div>
  );
}

export default App;
