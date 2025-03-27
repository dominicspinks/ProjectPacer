import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { RoleProvider } from './contexts/RoleProvider';

import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <RoleProvider>
                    <App />
                </RoleProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
