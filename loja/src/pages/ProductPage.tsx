import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Home, Search, User, ShoppingCart, Gift, ChevronLeft, ChevronRight, Star, MessageCircle, ShieldCheck, Check, X, Minus, Plus, Truck, Loader2, Heart } from 'lucide-react'
import type { Product } from '../types/product'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useProduct, ProductProvider } from '../context/ProductContext'

interface Review {
  id: string
  product_id: string
  author_name: string
  rating: number
  comment: string | null
  avatar_url: string | null
  depoimento_image_url: string | null
  variation: string | null
  days_ago: number | null
  likes: number | null
  created_at: string
}

// Placeholder utilities – replace with real implementations if available
const formatPrice = (price: any) => price
const getYouTubeEmbedUrl = (url: string) => {
  // Match YouTube URLs: watch?v=ID, youtu.be/ID, shorts/ID, embed/ID
  const matches = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (matches && matches[1]) {
    return `https://www.youtube-nocookie.com/embed/${matches[1]}`
  }
  return url
}

const LightningIcon = ({ className, size = 16, color = "currentColor" }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M11.2 21.3101C11.1352 21.3108 11.071 21.2981 11.0116 21.2729C10.9521 21.2477 10.8988 21.2106 10.8549 21.164C10.811 21.1174 10.7776 21.0624 10.7569 21.0025C10.7361 20.9427 10.7285 20.8794 10.7345 20.8168L11.5845 13.1668H4.72455C4.54228 13.1673 4.36631 13.0991 4.23075 12.9754C4.09519 12.8516 4.01019 12.6811 3.99225 12.4996C3.97431 12.318 4.02476 12.1384 4.13328 11.996C4.2418 11.8535 4.40058 11.7585 4.57788 11.7301L18.1779 9.53013C18.2505 9.51862 18.3248 9.52187 18.3963 9.53966C18.4678 9.55745 18.5348 9.58941 18.5934 9.63359C18.652 9.67776 18.7009 9.73327 18.7371 9.79685C18.7734 9.86044 18.7962 9.93084 18.8045 10.0035L19.4545 15.8535C19.4727 16.0354 19.4226 16.2155 19.3142 16.3585C19.2058 16.5015 19.047 16.5972 18.8695 16.6268L12.3195 17.6268L11.5695 21.0268C11.5459 21.1118 11.4984 21.1868 11.4326 21.2427C11.3668 21.2985 11.2855 21.3328 11.2 21.3101Z" fill={color}/>
  </svg>
)

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewFilter, setReviewFilter] = useState<'all' | '5' | '4' | 'images'>('all')
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState('Preta')
  const [quantity, setQuantity] = useState(1)
  const [activeFaq, setActiveFaq] = useState<string | null>(null)
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false)
  const [isVariationPopupOpen, setIsVariationPopupOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ h: 1, m: 59, s: 59 })
  const [viewingCount, setViewingCount] = useState(12)
  const [recommended, setRecommended] = useState<Product[]>([])

  const { addToCart, state: cartState } = useCart()
  const cartCount = cartState.totalItems
  const { setCurrentProductName } = useProduct()

  // Define o nome do produto atual para o Social Proof
  useEffect(() => {
    if (product?.name) {
      setCurrentProductName(product.name)
    }
    return () => setCurrentProductName(null)
  }, [product?.name, setCurrentProductName])

  const filterReviews = (list: Review[]) => {
    if (reviewFilter === 'all') return list
    if (reviewFilter === '5') return list.filter(r => r.rating === 5)
    if (reviewFilter === '4') return list.filter(r => r.rating >= 4)
    if (reviewFilter === 'images') return list.filter(r => r.avatar_url || r.depoimento_image_url)
    return list
  }

  useEffect(() => {
    async function load() {
      const { supabase } = await import('../integrations/supabase/client')
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        setProduct(data as Product)
        setSelectedImage(data.image_url || '')
      }

      const { data: revs } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false })

      setReviews(revs || [])

      const { data: recs } = await supabase
        .from('products')
        .select('*')
        .eq('section', 'recommended')
        .limit(6)

      setRecommended(recs || [])
      setLoading(false)
    }
    load()
  }, [id])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev
        s -= 1
        if (s < 0) { s = 59; m -= 1 }
        if (m < 0) { m = 59; h -= 1 }
        if (h < 0) return { h: 0, m: 0, s: 0 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
      </div>
    )
  }

  const images = product.additional_images && product.additional_images.length > 0
    ? product.additional_images
    : product.image_url ? [product.image_url] : []

  const currentPrice = formatPrice(product.price)
  const originalPrice = product.original_price ? formatPrice(product.original_price) : null
  const discount = product.discount_percent ?? (product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0)

  const faqData = [
    { question: 'O produto é original?', answer: 'Sim, todos os nossos produtos são 100% originais, com garantia e nota fiscal.' },
    { question: 'Quanto tempo demora a entrega?', answer: 'O prazo de entrega varia de 3 a 12 dias úteis, dependendo da sua região.' },
    { question: 'Qual a garantia do produto?', answer: 'Oferecemos 90 dias de garantia contra defeitos de fabricação em todos os itens.' },
    { question: 'Posso trocar se não gostar?', answer: 'Sim! Você tem até 7 dias corridos após o recebimento para solicitar a devolução ou troca sem custos.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[360px] bg-white min-h-screen flex flex-col relative pb-[56px] overflow-x-hidden">
        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 w-full">
          <div className="px-4 py-3 flex items-center gap-3">
            <Link to="/" className="shrink-0">
              <Home size={24} strokeWidth={2} className="text-rose-600" />
            </Link>
            <form className="flex-1">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2">
                <Search size={14} className="text-gray-400 shrink-0" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Pesquisar"
                  inputMode="search"
                  autoComplete="off"
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </form>
            <div className="flex items-center gap-1 shrink-0">
              <Link to="/minha-conta" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <User size={20} className="text-gray-600" strokeWidth={2} />
              </Link>
              <Link to="/carrinho" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <ShoppingCart size={20} className="text-gray-600" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col w-full">
          {/* GALERIA */}
          <div className="relative w-full aspect-square bg-[#F9F9F9]">
            <img
              src={images[currentImage] || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 text-white text-[12px] font-bold px-2 py-0.5 rounded shadow-sm z-10" style={{ backgroundColor: '#FF0040' }}>
                -{discount}%
              </span>
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImage(i => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-sm text-gray-800" disabled={currentImage === 0}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setCurrentImage(i => Math.min(images.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-sm text-gray-800" disabled={currentImage === images.length - 1}>
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ backgroundColor: i === currentImage ? '#FF0040' : '#D1D5DB' }} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Banner Promoção */}
          <div className="w-full flex justify-between px-4 py-3" style={{ background: 'linear-gradient(90deg, #FF6622 0%, #FF8833 100%)' }}>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-white">
                 <span className="text-[12px] font-medium">R$</span>
                 <span className="text-[28px] font-bold leading-none">{currentPrice}</span>
                 <Gift size={16} className="ml-1 opacity-90" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-white/80 line-through">R$ {originalPrice || '1389,90'}</span>
                <span className="bg-[#FF2D55] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Economize {discount || 97}%</span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-center">
              <div className="flex items-center gap-1 text-white text-[11px] font-bold mb-1.5">
                ⚡ OFERTA RELÂMPAGO
              </div>
              <div className="bg-white rounded px-1.5 py-0.5 text-[#FF6622] text-[10px] font-bold shadow-sm">
                TERMINA EM {String(timeLeft.m).padStart(2,'0')}:{String(timeLeft.s).padStart(2,'0')}
              </div>
            </div>
          </div>

          {/* Title & Badges */}
          <div className="px-4 py-3 bg-white">
            <h1 className="text-[15px] font-semibold text-[#222222] leading-snug mb-2">{product.name}</h1>
            {product?.image_urls && product.image_urls.length > 1 && (
              <div className="mb-3 last:mb-0">
                <p className="text-xs font-medium text-gray-500 mb-2">Cor</p>
                <div className="flex flex-wrap gap-2">
                  {product.image_urls.map((url: string, idx: number) => {
                    const colorName = ['Preta', 'Vermelha', 'Branca', 'Azul'][idx] ?? `Cor ${idx + 1}`
                    const isSelected = selectedImage === url
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImage(url)
                          setSelectedColor(colorName)
                          setCurrentImage(idx)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${isSelected ? 'border-rose-500 bg-rose-50 text-rose-600 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {colorName}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <span className="bg-[#E6F9EE] text-[#00A650] px-1.5 py-0.5 text-[10px] rounded-sm">Novo</span>
              <span>|</span>
              <span>+{product.sales_count > 0 ? product.sales_count : '4.673'} vendidos</span>
              <span>|</span>
              <div className="flex items-center gap-1">
                 <Star size={10} fill="#FFB000" stroke="#FFB000" />
                 <span className="text-gray-800 font-medium">4.8</span>
                 <span className="text-[11px] text-gray-400">({product.reviews_total || reviews.length || '387'} avaliações)</span>
              </div>
            </div>
          </div>

          <div className="h-2 w-full bg-[#F5F5F5]"></div>

          {/* Frete */}
          <div className="px-4 py-4 bg-white flex items-start gap-3">
            <div className="text-[#00A650] mt-0.5">
              <Truck size={20} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[#00A650] text-[13px] font-bold">
                 <LightningIcon size={12} color="#00A650" /> Frete Full
              </div>
              <span className="text-[12px] text-gray-500 mt-0.5">Estimativa de entrega: <span className="font-bold text-gray-800">2-5 dias úteis</span></span>
            </div>
          </div>

          <div className="h-2 w-full bg-[#F5F5F5]"></div>

          {/* Benefícios */}
          <div className="px-4 py-4 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-gray-400" />
              <h3 className="text-[15px] font-bold text-[#222222]">Proteção do cliente</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#00A650]" />
                <span className="text-[12px] text-gray-500">Devolução gratuita</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#00A650]" />
                <span className="text-[12px] text-gray-500">Reembolso automático por danos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#00A650]" />
                <span className="text-[12px] text-gray-500">Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#00A650]" />
                <span className="text-[12px] text-gray-500">Cupom por atraso na coleta</span>
              </div>
            </div>
          </div>

          <div className="h-2 w-full bg-[#F5F5F5]"></div>

          {/* Brinde Dinâmico */}
          {product.bonus_enabled && (
            <div className="px-4 py-3 bg-white">
              <div className="flex p-4 rounded-2xl border-2 border-dashed border-[#FFD700] bg-[#FFF9E7] shadow-sm relative">
                {product.gift_image_url && (
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-1.5 shrink-0 shadow-sm mr-4 self-center">
                    <img src={product.gift_image_url} alt="Brinde" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <p className="text-[13px] font-bold text-[#CC5500] mb-0.5 flex items-center gap-1">
                    <span>🎁</span> BRINDE EXCLUSIVO!
                  </p>
                  <p className="text-[12px] text-[#8B4513] mb-0.5">
                    {product.bonus_description || 'Comprando hoje, você recebe:'}
                  </p>
                  <p className="text-[16px] font-black text-[#CC5500] mb-1.5 uppercase tracking-tight">
                    {product.bonus_highlight || '1 Capacete GRÁTIS!'}
                  </p>
                  <div className="flex items-center gap-1 text-[#CC5500]">
                    <LightningIcon size={12} color="#CC5500" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      {product.bonus_warning || 'Oferta válida apenas hoje'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Imagens Adicionais */}
          {product.info_images && product.info_images.length > 0 && (
            <div className="flex flex-col bg-white">
              {product.info_images.map((url: string, idx: number) => (
                <img key={idx} src={url} alt={`Info ${idx}`} className="w-full h-auto" />
              ))}
            </div>
          )}

          <div className="h-2 w-full bg-[#F5F5F5]"></div>

          {/* Informações da Loja */}
          <div className="px-4 py-4 border-b border-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Informações da Loja</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 overflow-hidden flex items-center justify-center shrink-0 relative">
                <img
                  alt="Achadinhos do Momento"
                  loading="lazy"
                  decoding="async"
                  className="object-cover"
                  style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', color: 'transparent' }}
                  src={product.image_url || "/api/uploads/produtos/1775520032927-izj9dgmczkp.png"}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Achadinhos do Momento</p>
                <p className="text-xs text-gray-400">Online • Responde rápido</p>
              </div>
            </div>
            <div className="flex items-center justify-around border border-gray-100 rounded-xl px-4 py-3">
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">98%</p>
                <p className="text-[10px] text-gray-400">Avaliação</p>
              </div>
              <div className="w-px h-8 bg-gray-100"></div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">120</p>
                <p className="text-[10px] text-gray-400">Produtos</p>
              </div>
              <div className="w-px h-8 bg-gray-100"></div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">3.2M</p>
                <p className="text-[10px] text-gray-400">Seguidores</p>
              </div>
            </div>
          </div>

          <div className="h-2 w-full bg-[#F5F5F5]"></div>

          {/* Sobre o produto */}
          <div className="px-4 py-4 bg-white">
            <h3 className="text-[15px] font-bold text-[#222222] mb-3">Sobre o produto</h3>
            <div className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description || "Nenhuma descrição disponível."}
            </div>
          </div>

          {product.video_url && (
            <div className="px-4 py-4 border-b border-gray-50">
              {product.video_url.includes('youtube.com') || product.video_url.includes('youtu.be') ? (
                <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[9/16] max-w-[280px] mx-auto">
                  <iframe
                    src={getYouTubeEmbedUrl(product.video_url)}
                    title="Product video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : (
                <video src={product.video_url} controls className="w-full aspect-video object-cover" />
              )}
            </div>
          )}

          <div className="h-2 w-full bg-[#F5F5F5]"></div>

          {/* Avaliações */}
          <div className="px-4 py-4 bg-white">
            {/* Resumo */}
            {(() => {
              const displayRating = product.manual_rating ?? (reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null);
              const displayCount = product.manual_review_count ?? reviews.length;
              if (displayRating === null) return null;
              const dist = [5, 4, 3, 2, 1].map(stars => ({
                stars,
                count: reviews.filter(r => r.rating === stars).length,
              }));
              const totalForPct = reviews.length > 0 ? reviews.length : 1;
              const pcts = dist.map(d => ({ ...d, pct: totalForPct > 0 ? (d.count / totalForPct) * 100 : 0 }));
              const recommendPct = totalForPct > 0
                ? Math.round((reviews.filter(r => r.rating >= 4).length / totalForPct) * 100)
                : 0;
              return (
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <p className="text-[32px] font-bold text-gray-800 leading-none mb-1">{displayRating.toFixed(1)}</p>
                    <div className="flex items-center gap-0.5 my-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={12} fill={i <= Math.round(displayRating) ? '#FFB000' : '#E5E7EB'} stroke={i <= Math.round(displayRating) ? '#FFB000' : '#E5E7EB'} />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400">{displayCount} avaliações</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    {pcts.map(d => (
                      <div key={d.stars} className="flex items-center gap-1.5">
                        <span className="text-[11px] text-gray-500 w-2 text-center">{d.stars}</span>
                        <Star size={10} fill="#FFB000" stroke="#FFB000" />
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FFB000] rounded-full" style={{ width: `${d.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{recommendPct}%</p>
                    <p className="text-[10px] text-gray-400 leading-tight">dos clientes<br/>recomendam</p>
                  </div>
                </div>
              );
            })()}

            <h3 className="text-[15px] font-medium text-gray-700 mb-4">Avaliações ({product.manual_review_count ?? reviews.length})</h3>

            {filterReviews(reviews).length === 0 ? (
              <div className="text-center py-6">
                <MessageCircle size={32} className="mx-auto text-gray-200 mb-2" />
                <p className="text-[12px] text-gray-400">Nenhuma avaliação ainda.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filterReviews(reviews).map((review) => (
                  <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-rose-50 overflow-hidden flex items-center justify-center shrink-0">
                        {review.avatar_url ? (
                          <img src={review.avatar_url} alt="" className="w-8 h-8 object-cover rounded-full" />
                        ) : (
                          <span className="text-[12px] font-bold text-gray-600">{review.author_name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-medium text-gray-800">{review.author_name}</p>
                          <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">✓ Compra verificada</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} size={10} fill={i <= review.rating ? '#FFB000' : '#E5E7EB'} stroke={i <= review.rating ? '#FFB000' : '#E5E7EB'} />
                            ))}
                          </div>
                          {review.days_ago !== null && review.days_ago !== undefined && (
                            <span className="text-[10px] text-gray-400">• {review.days_ago === 0 ? 'Hoje' : `Há ${review.days_ago} dia${review.days_ago > 1 ? 's' : ''}`}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {review.variation && (
                      <span className="inline-block text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded mb-1.5">Variação: {review.variation}</span>
                    )}
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">{review.comment}</p>
                    {review.depoimento_image_url && (
                      <div className="mb-2">
                        <img src={review.depoimento_image_url} alt="Foto do depoimento" className="w-24 h-24 rounded-lg object-cover border border-gray-100" />
                      </div>
                    )}
                    <button className="flex items-center gap-1.5 text-xs transition-colors text-gray-400 hover:text-rose-400">
                      <Heart size={14} />
                      {review.likes !== null && review.likes !== undefined ? review.likes : 0}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-2 w-full bg-[#F5F5F5]"></div>

          {/* Você também pode gostar */}
          <div className="px-4 py-4 bg-white">
            <h3 className="text-[15px] font-bold text-[#222222] mb-3">Você também pode gostar</h3>
            {recommended.length === 0 ? (
              <div className="flex justify-center py-6 opacity-20">
                <Gift size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {recommended.map((item) => (
                  <Link to={`/produto/${item.id}`} key={item.id} className="flex flex-col bg-white">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#F9F9F9] mb-2">
                      <img src={item.image_url || 'https://via.placeholder.com/200'} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                      {item.discount_percent && (
                        <div className="absolute top-0 left-0 bg-[#FF0040] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-br-lg">
                          {item.discount_percent}% OFF
                        </div>
                      )}
                    </div>
                    <h4 className="text-[12px] font-medium text-[#222222] leading-tight line-clamp-2 mb-1 min-h-[30px]">{item.name}</h4>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-[#FF0040]">R$ {formatPrice(item.price)}</span>
                      {item.original_price && (
                        <span className="text-[12px] text-[#999999] line-through">R$ {formatPrice(item.original_price)}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="h-2 w-full bg-[#F5F5F5]"></div>

          {/* Perguntas Frequentes */}
          <div className="px-4 py-4 bg-white">
            <h3 className="text-[15px] font-bold text-[#222222] mb-3">Perguntas Frequentes</h3>
            <div className="space-y-0">
              {faqData.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => setActiveFaq(activeFaq === item.question ? null : item.question)}
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <span className="text-[13px] font-medium text-[#222222]">{item.question}</span>
                    <ChevronRight size={16} className={`text-gray-400 transition-transform duration-200 ${activeFaq === item.question ? 'rotate-90' : ''}`} />
                  </button>
                  {activeFaq === item.question && (
                    <div className="pb-3 text-[13px] text-gray-600 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-2 w-full bg-[#F5F5F5]"></div>

          {/* Footer */}
          <Footer />
        </main>

        {/* Urgency Banner */}
        <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-[360px] z-[99]" style={{ bottom: '56px' }}>
          <div className="flex items-center justify-center gap-1.5 py-1.5 px-3" style={{ backgroundColor: 'rgba(255, 45, 85, 0.08)' }}>
            <span className="pulse-dot" style={{ width: '6px', height: '6px', background: '#FF2D55', borderRadius: '50%', marginRight: '5px', position: 'relative', display: 'inline-block' }}></span>
            <span className="text-[11px] text-[#FF2D55] font-medium">{viewingCount} pessoas olhando agora - Últimas unidades!</span>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[360px] z-[100] bg-white border-t border-gray-200">
          <div className="flex items-center h-16 gap-0 px-0">
            <button className="flex flex-col items-center justify-center w-12 h-full" tabIndex={0} onClick={() => window.location.href = '/'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-800">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
                <path d="M2 7h20"/>
              </svg>
              <span className="text-[10px] text-gray-800 mt-0.5">Loja</span>
            </button>
            <button className="flex flex-col items-center justify-center w-12 h-full" tabIndex={0} onClick={() => window.location.href = '/chat'}>
              <MessageCircle size={20} className="text-gray-800" />
              <span className="text-[10px] text-gray-800 mt-0.5">Chat</span>
            </button>
            <button className="flex items-center justify-center w-12 h-10 bg-[#FFE5E8] rounded-xl relative" tabIndex={0} onClick={() => setIsCartPopupOpen(true)}>
              <ShoppingCart size={20} className="text-[#FF2D55]" />
              <span className="absolute -top-1 -right-1 bg-[#FF2D55] text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">{cartCount || 0}</span>
            </button>
            <button
              className="flex-1 bg-[#FF2D55] hover:bg-[#FF2D55]/90 active:scale-[0.98] text-white rounded-xl flex flex-col items-center justify-center py-[3px] mx-0 mr-0 mb-0 ml-[6px] transition-transform"
              tabIndex={0}
              onClick={() => {
                // Adiciona ao carrinho via CartContext
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity,
                  image_url: selectedImage,
                  variation: selectedColor,
                })
                // Vai para checkout com os dados do carrinho
                navigate('/checkout')
              }}
            >
              <span className="text-[16px] font-bold leading-tight">R$ {currentPrice}</span>
              <span className="text-[11px] font-medium opacity-90 leading-tight">Comprar agora | Frete Full</span>
            </button>
          </div>
        </div>

        {/* Cart Popup */}
        {isCartPopupOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-[110]" onClick={() => setIsCartPopupOpen(false)}></div>
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[360px] bg-white rounded-t-3xl z-[120] max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1 shrink-0"></div>
              <div className="p-5 overflow-y-auto flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[16px] font-bold text-gray-900">Carrinho</h2>
                  <button onClick={() => setIsCartPopupOpen(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden shrink-0 relative">
                    <img src={selectedImage || product.image_url || 'https://via.placeholder.com/80'} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{product.name}</p>
                    <p className="text-xs text-gray-400">Cor: {selectedColor}</p>
                    <p className="text-base font-bold text-rose-600">R$ {currentPrice}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <span className="text-sm text-gray-700">Quantidade</span>
                  <div className="flex items-center gap-3">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                      onClick={() => setQuantity(q => q + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <span className="text-lg font-bold text-rose-600">R$ {formatPrice(product.price * quantity)}</span>
                </div>
              </div>
              <div className="p-5 border-t border-gray-100">
                <button
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3.5 rounded-xl text-sm transition-colors"
                  onClick={() => {
                    setIsCartPopupOpen(false)
                    navigate('/carrinho')
                  }}
                >
                  Ver carrinho
                </button>
              </div>
            </div>
          </>
        )}

        {/* Variation Popup */}
        {isVariationPopupOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-[130]" onClick={() => setIsVariationPopupOpen(false)}></div>
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[360px] bg-white rounded-t-3xl z-[140] max-h-[85vh] flex flex-col">
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1 shrink-0"></div>
              <div className="p-5 overflow-y-auto flex-1">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0 relative">
                    <img
                      src={selectedImage || product?.image_url || 'https://via.placeholder.com/80'}
                      alt={product?.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{product?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Cor: <span className="text-gray-800 font-semibold">{selectedColor}</span></p>
                    <p className="text-base font-bold text-rose-600 mt-1">R$ {currentPrice}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Cor: <span className="text-gray-800 font-semibold">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-3">
                    {product?.image_urls?.map((url: string, idx: number) => {
                      const colors = ['Preta', 'Vermelha', 'Branca', 'Azul', 'Preto', 'Rosa']
                      const colorName = colors[idx] || `Cor ${idx + 1}`
                      const isSelected = selectedImage === url
                      return (
                        <button
                          key={idx}
                          className={`relative flex flex-col items-center gap-1 ${isSelected ? '' : 'opacity-70'}`}
                          onClick={() => {
                            setSelectedImage(url)
                            setSelectedColor(colorName)
                            setCurrentImage(idx)
                          }}
                        >
                          {idx === 0 && !isSelected && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">MAIS VENDIDO</span>
                          )}

                          <div className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-colors ${isSelected ? 'border-rose-500' : 'border-gray-200'} relative`}>
                            <img src={url} alt={colorName} className="absolute inset-0 w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-[8px]">✓</span>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-400">
                  <span>✅ Compra segura</span>
                  <span>🚚 Frete grátis</span>
                </div>
                <button
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3.5 rounded-xl text-sm transition-colors"
                  onClick={() => {
                    setIsVariationPopupOpen(false)
                    navigate('/checkout')
                  }}
                >
                  Confirmar — R$ {currentPrice}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
