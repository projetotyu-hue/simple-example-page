import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CheckoutProvider } from './context/CheckoutContext'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import ProductsPage from './pages/ProductsPage'
import CategoriesPage from './pages/CategoriesPage'
import AccountPage from './pages/AccountPage'
import ContactPage from './pages/ContactPage'
import ChatPage from './pages/ChatPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckoutSuccess from './pages/CheckoutSuccess'
import PixPage from './pages/PixPage'
import UpsellPage from './pages/UpsellPage'
import ErroPagamentoPage from './pages/ErroPagamentoPage'
import TermosPage from './pages/TermosPage'
import PrivacidadePage from './pages/PrivacidadePage'
import TrocasPage from './pages/TrocasPage'

export default function App() {
  return (
    <CartProvider>
      <CheckoutProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/minha-conta" element={<AccountPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pix" element={<PixPage />} />
            <Route path="/erro-pagamento" element={<ErroPagamentoPage />} />
            <Route path="/compra-realizada" element={<CheckoutSuccess />} />
            <Route path="/upsell1" element={<UpsellPage />} />
            <Route path="/upsell2" element={<UpsellPage />} />
            <Route path="/upsell3" element={<UpsellPage />} />
            <Route path="/termos" element={<TermosPage />} />
            <Route path="/privacidade" element={<PrivacidadePage />} />
            <Route path="/trocas" element={<TrocasPage />} />
            <Route path="/:id" element={<UpsellPage />} />
          </Routes>
        </BrowserRouter>
      </CheckoutProvider>
    </CartProvider>
  )
}
