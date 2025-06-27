import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'

// [SECTION] Imported notyf
import 'notyf/notyf.min.css';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);