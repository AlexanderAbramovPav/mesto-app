import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider  } from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <CookiesProvider>
                <App/>
            </CookiesProvider> 
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
