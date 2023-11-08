import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { Store, persistor } from "./store"
import { PersistGate } from 'redux-persist/integration/react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { Toaster } from 'react-hot-toast';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ProSidebarProvider>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{
            duration: 1500
          }}
        />
      </PersistGate>
    </Provider>
  </ProSidebarProvider>
); 