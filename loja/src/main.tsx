import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Toaster } from 'sonner'
import SocialProof from './components/SocialProof'
import { ProductProvider } from './context/ProductContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProductProvider>
      <App />
      <SocialProof />
      <Toaster position="top-center" richColors />
    </ProductProvider>
  </React.StrictMode>,
)
