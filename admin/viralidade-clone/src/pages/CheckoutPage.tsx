import { useState } from 'react'
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Identification, 2: Shipping, 3: Payment
  
  const steps = [
    { id: 1, label: 'Dados' },
    { id: 2, label: 'Entrega' },
    { id: 3, label: 'Pagamento' }
  ]

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
    else navigate('/pix')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="px-4 py-4 flex items-center justify-between gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <h1 className="flex-1 text-center text-xs font-black uppercase tracking-[0.2em] text-gray-800">
            Checkout Seguro
          </h1>
          <div className="w-8 flex justify-center">
            <ShieldCheck size={20} className="text-green-500" />
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="px-6 py-4 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-gray-100 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-6 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
               style={{ width: `${(step - 1) * 50}%` }} />
          
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                s.id <= step ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-2 border-gray-100 text-gray-300'
              }`}>
                {s.id < step ? <CheckCircle2 size={16} /> : s.id}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                s.id <= step ? 'text-gray-800' : 'text-gray-300'
              }`}>{s.label}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="animate-slide-up">
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-1">Identificação</h2>
              <div className="flex flex-col gap-4">
                <input type="text" placeholder="Nome completo" className="shopee-input" />
                <input type="email" placeholder="E-mail" className="shopee-input" />
                <input type="text" placeholder="CPF" className="shopee-input" />
                <input type="tel" placeholder="Telefone / WhatsApp" className="shopee-input" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-1">Endereço de Entrega</h2>
              <div className="flex flex-col gap-4">
                <input type="text" placeholder="CEP" className="shopee-input" />
                <input type="text" placeholder="Rua / Avenida" className="shopee-input" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Número" className="shopee-input" />
                  <input type="text" placeholder="Complemento" className="shopee-input" />
                </div>
                <input type="text" placeholder="Bairro" className="shopee-input" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Cidade" className="shopee-input" />
                  <input type="text" placeholder="Estado (UF)" className="shopee-input" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-1">Forma de Pagamento</h2>
              <div className="flex flex-col gap-3">
                <div className="p-4 border-2 border-primary bg-pink-50/30 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="text-primary font-black text-xs">PIX</span>
                     </div>
                     <div>
                       <p className="text-sm font-bold text-gray-800">Pagar com PIX</p>
                       <p className="text-[10px] text-gray-500">Aprovação imediata</p>
                     </div>
                   </div>
                   <div className="w-5 h-5 border-2 border-primary rounded-full flex items-center justify-center">
                     <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                   </div>
                </div>
                
                <div className="p-4 border-2 border-gray-100 rounded-2xl flex items-center justify-between opacity-50">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 font-black text-[10px]">CARTÃO</span>
                     </div>
                     <div>
                       <p className="text-sm font-bold text-gray-400">Cartão de Crédito</p>
                       <p className="text-[10px] text-gray-400">Indisponível no momento</p>
                     </div>
                   </div>
                   <div className="w-5 h-5 border-2 border-gray-100 rounded-full" />
                </div>
              </div>
              
              {/* Order Summary in Payment step */}
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Subtotal</span>
                  <span>R$ 37,90</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>Frete</span>
                  <span className="text-green-500 font-bold">GRÁTIS</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm font-bold text-gray-800">Total a pagar</span>
                  <span className="text-primary font-black text-xl">R$ 37,90</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 bg-white border-t border-gray-100 flex flex-col gap-4">
        <button
          onClick={handleNext}
          className="w-full bg-primary text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
        >
          {step === 3 ? 'Finalizar Pedido' : 'Próxima Etapa'}
        </button>
        
        <div className="flex items-center justify-center gap-4 py-2 grayscale opacity-40">
           <Lock size={12} className="text-gray-400" />
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Pagamento 100% Seguro</span>
        </div>
      </footer>
    </div>
  )
}
