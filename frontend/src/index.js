import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider  } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query'
 
const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <CookiesProvider>
                    <App/>
                </CookiesProvider> 
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);

reportWebVitals();
