// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChoiceProvider } from './Contexts/ChosenUtxo';
import { InputsProvider } from './Contexts/InputsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChoiceProvider>
      <InputsProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </InputsProvider>
    </ChoiceProvider>
);

reportWebVitals();