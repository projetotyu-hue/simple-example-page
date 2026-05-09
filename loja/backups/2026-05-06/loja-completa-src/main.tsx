import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Toaster } from 'sonner'
import { CheckoutProvider } from './context/CheckoutContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CheckoutProvider>
      <App />
      <Toaster position="top-center" richColors />
    </CheckoutProvider>
  </React.StrictMode>,
)
