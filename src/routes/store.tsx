import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Search, Menu, Star, Truck, Shield, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/store")({
  component: StorePage,
  head: () => ({
    meta: [
      { title: "Achadinhos da Vitrine | Ofertas Imperdíveis" },
      { name: "description", content: "Achadinhos da Vitrine - As melhores ofertas com frete grátis. Até 97% OFF em produtos selecionados." },
    ],
  }),
});

const products = [
  { id: "air-fryer-philips", name: "Air Fryer Philips Premium 4L", price: 299, oldPrice: 899, discount: 67, image: "/assets/airfryer-philips-new-BVqsyn9N.webp", rating: 4.8, reviews: 234 },
  { id: "partybox-120", name: "PartyBox 120W RMS", price: 449, oldPrice: 1299, discount: 65, image: "/assets/partybox-120-new-FH2zOn4S.png", rating: 4.9, reviews: 189 },
  { id: "cadeira-escritorio", name: "Cadeira Ergômica Premium", price: 299, oldPrice: 899, discount: 67, image: "/assets/cadeira-escritorio-BHR1MLqK.webp", rating: 4.7, reviews: 156 },
  { id: "microondas", name: "Microondas Electrolux 20L", price: 249, oldPrice: 699, discount: 64, image: "/assets/microondas-electrolux-A01NH2q7.webp", rating: 4.6, reviews: 98 },
  { id: "parafusadeira", name: "Parafusadeira 48V Professional", price: 159, oldPrice: 499, discount: 68, image: "/assets/parafusadeira-48v-D8i75_gC.webp", rating: 4.8, reviews: 312 },
  { id: "projetor", name: "Projetor HY300 4K Android", price: 399, oldPrice: 1199, discount: 67, image: "/assets/projetor-hy300-B1qTvG-E.webp", rating: 4.9, reviews: 445 },
  { id: "flip7", name: "Caixa de Som Flip 7", price: 199, oldPrice: 599, discount: 67, image: "/assets/flip7-new-DQIPGENi.webp", rating: 4.7, reviews: 167 },
  { id: "frigobar", name: "Frigobar Brastemp 80L", price: 449, oldPrice: 1299, discount: 65, image: "/assets/frigobar-brastemp-ffsq6OcB.png", rating: 4.8, reviews: 89 },
];

const banners = [
  "/assets/banner-1-D4ir_9-P.webp",
  "/assets/banner-2-CQelcZFa.webp",
  "/assets/banner-3-D64yQ2yI.webp",
];

function StorePage() {
  const [cartCount, setCartCount] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/store" className="flex items-center gap-2">
              <span className="text-white text-xl font-bold">Achadinhos da Vitrine</span>
            </Link>
            
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Input 
                  placeholder="Buscar produtos..." 
                  className="w-full bg-white/90 border-0 rounded-full pl-4 pr-12"
                />
                <Button size="icon" className="absolute right-1 top-1 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30">
                  <Search className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-white">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-white relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-white text-orange-500 rounded-full text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button size="icon" variant="ghost" className="text-white lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <nav className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 text-sm text-white/90 overflow-x-auto">
            <Link to="/store" className="hover:text-white font-medium">Início</Link>
            <Link to="/store" className="hover:text-white">Ofertas</Link>
            <Link to="/store" className="hover:text-white">Mais Vendidos</Link>
            <Link to="/store" className="hover:text-white">Eletrodomésticos</Link>
            <Link to="/store" className="hover:text-white">Áudio</Link>
            <Link to="/store" className="hover:text-white">Móveis</Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 mb-8">
          <img src={banners[currentBanner]} alt="Promoção" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="p-8 md:p-12">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Até 97% OFF
              </h1>
              <p className="text-white/90 text-lg mb-6">
                Ofertas imperdíveis em produtos selecionados
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Ver Ofertas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`h-2 rounded-full transition-all ${i === currentBanner ? "w-8 bg-white" : "w-2 bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Truck className="h-6 w-6 text-orange-500" />
          <span className="font-medium text-gray-700">Frete Grátis para todo o Brasil</span>
          <Shield className="h-6 w-6 text-green-500 ml-4" />
          <span className="font-medium text-gray-700">Compra Segura</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mais Vendidos</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square relative bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
                <Badge className="absolute top-2 left-2 bg-red-500">
                  -{product.discount}%
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-800 line-clamp-2 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-orange-500">R$ {product.price}</span>
                  <span className="text-sm text-gray-400 line-through">R$ {product.oldPrice}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Sobre</h3>
              <p className="text-gray-400 text-sm">Achadinhos da Vitrine - As melhores ofertas com frete grátis.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Atendimento</h3>
              <p className="text-gray-400 text-sm">WhatsApp: (11) 99999-9999</p>
              <p className="text-gray-400 text-sm">Email: contato@loja.com.br</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Informações</h3>
              <p className="text-gray-400 text-sm">Termos de Uso</p>
              <p className="text-gray-400 text-sm">Política de Privacidade</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Formas de Pagamento</h3>
              <p className="text-gray-400 text-sm">Pix, Cartão, Boleto</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}