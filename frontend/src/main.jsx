import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#080D1A',
            color: '#E8EDF5',
            border: '1px solid rgba(0,207,255,0.15)',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,207,255,0.05)',
          },
          success: { iconTheme: { primary: '#00CFFF', secondary: '#02040A' } },
          error:   { iconTheme: { primary: '#FF2D7B', secondary: '#02040A' } },
        }} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
