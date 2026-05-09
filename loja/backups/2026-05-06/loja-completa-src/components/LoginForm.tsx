import { useState } from 'react'
import { User } from 'lucide-react'

export default function LoginForm() {
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-6">
      <div
        className="flex items-center justify-center mb-6"
        style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F0F0F0' }}
      >
        <User size={36} style={{ color: '#888888' }} />
      </div>

      <h2 className="text-[18px] font-bold text-[#333333] mb-2 text-center">
        Acessar Minha Conta
      </h2>
      <p className="text-[14px] text-[#888888] mb-8 text-center" style={{ fontSize: '14px' }}>
        Digite seu email ou CPF para continuar
      </p>

      <div className="w-full max-w-[360px]">
        <label className="block text-[13px] text-[#333333] font-medium mb-1.5">
          Email ou CPF
        </label>
        <input
          type="text"
          placeholder="exemplo@email.com ou 000.000.000-00"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full outline-none transition-colors placeholder:text-[#B0B0B0]"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EAEAEA',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            color: '#333333',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        className="w-full font-bold text-white transition-colors hover:opacity-90 mt-4"
        style={{
          backgroundColor: '#FF2D55',
          borderRadius: '8px',
          height: '48px',
          fontSize: '15px',
        }}
      >
        Entrar
      </button>

      <button
        className="w-full font-bold transition-colors hover:bg-gray-50 mt-3"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #FF2D55',
          color: '#FF2D55',
          borderRadius: '8px',
          height: '48px',
          fontSize: '15px',
        }}
        onClick={() => window.location.href = '/'}
      >
        Ir para a Loja
      </button>
    </div>
  )
}
