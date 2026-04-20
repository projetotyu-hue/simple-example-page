import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { supabase } from "../lib/supabase";

const products = [
  { id: 1, name: "Air Fryer Philips Premium 4L", price: 299, oldPrice: 899, discount: 67, image: "/assets/airfryer-philips-new-BVqsyn9N.webp", rating: 4.8, reviews: 234 },
  { id: 2, name: "PartyBox 120W RMS", price: 449, oldPrice: 1299, discount: 65, image: "/assets/partybox-120-new-FH2zOn4S.png", rating: 4.9, reviews: 189 },
  { id: 3, name: "Cadeira Ergonômica Premium", price: 299, oldPrice: 899, discount: 67, image: "/assets/cadeira-escritorio-BHR1MLqK.webp", rating: 4.7, reviews: 156 },
  { id: 4, name: "Microondas Electrolux 20L", price: 249, oldPrice: 699, discount: 64, image: "/assets/microondas-electrolux-A01NH2q7.webp", rating: 4.6, reviews: 98 },
  { id: 5, name: "Parafusadeira 48V Professional", price: 159, oldPrice: 499, discount: 68, image: "/assets/parafusadeira-48v-D8i75_gC.webp", rating: 4.8, reviews: 312 },
  { id: 6, name: "Projetor HY300 4K Android", price: 399, oldPrice: 1199, discount: 67, image: "/assets/projetor-hy300-B1qTvG-E.webp", rating: 4.9, reviews: 445 },
  { id: 7, name: "Caixa de Som Flip 7", price: 199, oldPrice: 599, discount: 67, image: "/assets/flip7-new-DQIPGENi.webp", rating: 4.7, reviews: 167 },
  { id: 8, name: "Frigobar Brastemp 80L", price: 449, oldPrice: 1299, discount: 65, image: "/assets/frigobar-brastemp-ffsq6OcB.png", rating: 4.8, reviews: 89 },
];

function Store() {
  const [cartCount, setCartCount] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const banners = [
    { image: "/assets/banner-1-D4ir_9-P.webp", title: "Até 97% OFF", subtitle: "Ofertas imperdíveis em produtos selecionados" },
    { image: "/assets/banner-2-CQelcZFa.webp", title: "Frete Grátis", subtitle: "Para todo o Brasil" },
    { image: "/assets/banner-3-D64yQ2yI.webp", title: "Novidades", subtitle: "Chegaram agora" },
  ];

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <header style={{ 
        background: "linear-gradient(to right, #ff6b35, #f73c3c)", 
        position: "sticky", 
        top: 0, 
        zIndex: 50,
        padding: "12px 0"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>
              Achadinhos da Vitrine
            </div>
            
            <div style={{ flex: 1, maxWidth: "400px" }}>
              <input 
                type="text" 
                placeholder="Buscar produtos..." 
                style={{ 
                  width: "100%", 
                  padding: "8px 16px", 
                  borderRadius: "20px", 
                  border: "none",
                  background: "rgba(255,255,255,0.9)"
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", padding: "8px" }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", padding: "8px", position: "relative" }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span style={{ 
                    position: "absolute", 
                    top: 0, 
                    right: 0, 
                    background: "white", 
                    color: "#ff6b35", 
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "2px 6px",
                    borderRadius: "10px"
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", marginBottom: "24px", height: "240px" }}>
          <img 
            src={banners[currentBanner].image} 
            alt="Promoção" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            background: "linear-gradient(to right, rgba(0,0,0,0.7), transparent)",
            display: "flex",
            alignItems: "center",
            padding: "32px"
          }}>
            <div>
              <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
                {banners[currentBanner].title}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", marginBottom: "16px" }}>
                {banners[currentBanner].subtitle}
              </p>
              <button style={{ 
                background: "#ff6b35", 
                color: "white", 
                border: "none", 
                padding: "12px 24px", 
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer"
              }}>
                Ver Ofertas
              </button>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                style={{
                  width: i === currentBanner ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  background: i === currentBanner ? "white" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ff6b35" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <strong>Frete Grátis para todo o Brasil</strong>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "#22c55e" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <strong>Compra Segura</strong>
          </span>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#333" }}>Mais Vendidos</h2>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
          gap: "16px" 
        }}>
          {products.map((product) => (
            <div 
              key={product.id} 
              style={{ 
                background: "white", 
                borderRadius: "12px", 
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer"
              }}
            >
              <div style={{ aspectRatio: "1", background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px", lineHeight: 1.3 }}>
                  {product.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <span style={{ color: "#f59e0b" }}>★</span>
                  <span style={{ fontSize: "12px", color: "#666" }}>{product.rating}</span>
                  <span style={{ fontSize: "12px", color: "#999" }}>({product.reviews})</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "20px", fontWeight: "bold", color: "#ff6b35" }}>R$ {product.price}</span>
                  <span style={{ fontSize: "14px", color: "#999", textDecoration: "line-through" }}>R$ {product.oldPrice}</span>
                </div>
                {!product.inCart && (
                  <button 
                    onClick={addToCart}
                    style={{ 
                      width: "100%", 
                      marginTop: "12px",
                      background: "#ff6b35", 
                      color: "white", 
                      border: "none", 
                      padding: "10px", 
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Adicionar ao Carrinho
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ background: "#1a1a1a", color: "white", padding: "48px 16px", marginTop: "48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
          <div>
            <h3 style={{ fontWeight: "bold", marginBottom: "16px" }}>Sobre</h3>
            <p style={{ color: "#999", fontSize: "14px" }}>Achadinhos da Vitrine - As melhores ofertas com frete grátis.</p>
          </div>
          <div>
            <h3 style={{ fontWeight: "bold", marginBottom: "16px" }}>Atendimento</h3>
            <p style={{ color: "#999", fontSize: "14px" }}>WhatsApp: (11) 99999-9999</p>
            <p style={{ color: "#999", fontSize: "14px" }}>Email: contato@loja.com.br</p>
          </div>
          <div>
            <h3 style={{ fontWeight: "bold", marginBottom: "16px" }}>Informações</h3>
            <p style={{ color: "#999", fontSize: "14px" }}>Termos de Uso</p>
            <p style={{ color: "#999", fontSize: "14px" }}>Política de Privacidade</p>
          </div>
          <div>
            <h3 style={{ fontWeight: "bold", marginBottom: "16px" }}>Formas de Pagamento</h3>
            <p style={{ color: "#999", fontSize: "14px" }}>Pix, Cartão, Boleto</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Store;