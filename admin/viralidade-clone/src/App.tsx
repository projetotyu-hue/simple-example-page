import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PixPage from './pages/PixPage'
import UpsellPage from './pages/UpsellPage'
import ChatPage from './pages/ChatPage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" expand={false} richColors />
      <div className="shopee-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pix" element={<PixPage />} />
          <Route path="/upsell1" element={<UpsellPage step={1} />} />
          <Route path="/upsell2" element={<UpsellPage step={2} />} />
          <Route path="/upsell3" element={<UpsellPage step={3} />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
