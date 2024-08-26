// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChoiceProvider } from './Contexts/ChosenUtxo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChoiceProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
    </ChoiceProvider>
);

reportWebVitals();