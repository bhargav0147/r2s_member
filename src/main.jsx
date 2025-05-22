import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './app';
import AppProvider from './store/AppProvider';

// ----------------------------------------------------------------------
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense>
            <App />
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </AppProvider>
  </HelmetProvider>
);
