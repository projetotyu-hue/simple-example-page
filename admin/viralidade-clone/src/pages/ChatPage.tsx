import { ArrowLeft, Send, CheckCheck, Store, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function ChatPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')

  const FAQ_BUTTONS = [
    'Onde está meu pedido?',
    'Como rastrear?',
    'Prazo de entrega',
    'Política de devolução',
    'Falar com atendente'
  ]

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F5]">
      {/* Chat Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center overflow-hidden">
               <Store size={20} className="text-primary" />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800">Suporte — Zoe</h1>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
           <ShieldCheck size={12} className="text-green-500" />
           <span className="text-[9px] font-black text-green-600 uppercase tracking-tighter">Seguro</span>
        </div>
      </header>

      {/* Chat Content */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        <div className="text-center py-4">
           <span className="bg-gray-200/50 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Hoje</span>
        </div>

        {/* Support Message */}
        <div className="flex gap-3 max-w-[85%]">
           <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0">
             <Store size={14} className="text-primary" />
           </div>
           <div className="flex flex-col gap-1.5">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                 <p className="text-sm text-gray-700 leading-relaxed">
                   Olá! 👋 Bem-vindo ao suporte da <b>Achadinhos da Zoe</b>. Como podemos te ajudar hoje?
                 </p>
              </div>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter ml-1">14:02</span>
           </div>
        </div>

        {/* FAQ Pills */}
        <div className="flex flex-wrap gap-2 justify-end mb-4">
          {FAQ_BUTTONS.map((btn) => (
            <button
              key={btn}
              className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2.5 rounded-full shadow-sm active:bg-gray-50 hover:border-primary/30 transition-all"
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 py-8 opacity-40">
           <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
           </div>
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aguardando atendente...</span>
        </div>
      </main>

      {/* Message Input */}
      <footer className="bg-white p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 focus-within:border-primary/20 transition-all">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-transparent text-sm outline-none py-2 text-gray-700 placeholder:text-gray-400 font-medium"
          />
          <button className={`p-2 rounded-xl transition-all ${message ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-gray-300'}`}>
            <Send size={18} />
          </button>
        </div>
        <p className="text-[9px] text-center text-gray-400 mt-3 font-bold uppercase tracking-[0.2em]">Criptografia de ponta a ponta</p>
      </footer>
    </div>
  )
}
