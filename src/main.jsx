// src/main.js ou src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // ou 'react-dom'
import App from './App';
import './App.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
