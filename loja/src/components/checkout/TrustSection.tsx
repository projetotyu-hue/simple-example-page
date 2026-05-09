import { ShieldCheck, Lock, Award, Mail, Phone } from 'lucide-react'

const SHOP_NAME = 'Achadinhos do Momento'
const CNPJ = '55.012.266/0001-46'
const ADDRESS = 'AV CELSO GARCIA 3220, São Paulo-SP'
const EMAIL = 'achadinhoscontato@gmail.com'
const PHONE = '(11) 99658-6625'
const HOURS = 'Segunda a Sexta, das 9h as 18h'

export default function TrustSection() {
  return (
    <div className="px-6 py-8 mt-8 border-t border-gray-100 bg-white rounded-2xl">
      <p className="font-black text-center italic uppercase tracking-tighter text-rose-600 text-xl mb-6">
        {SHOP_NAME}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8 text-gray-400">
        <div className="flex flex-col items-center gap-1.5">
          <ShieldCheck size={24} strokeWidth={2} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-center">Compra Segura</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Lock size={24} strokeWidth={2} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-center">Site Protegido</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Award size={24} strokeWidth={2} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-center">Garantia</span>
        </div>
      </div>

      <div className="text-center flex flex-col gap-1 text-[12px] text-gray-500 leading-relaxed mb-6">
        <p className="font-bold text-gray-800">{SHOP_NAME}</p>
        <p>CNPJ: {CNPJ}</p>
        <p>{ADDRESS}</p>
        <div className="flex flex-col gap-0.5 mt-2">
          <p className="flex items-center justify-center gap-1.5">
            <Mail size={12} className="text-gray-400" /> {EMAIL}
          </p>
          <p className="flex items-center justify-center gap-1.5">
            <Phone size={12} className="text-gray-400" /> {PHONE}
          </p>
        </div>
        <p className="mt-1 text-[10px] font-medium text-gray-400 uppercase tracking-wide">{HOURS}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Pagamento Seguro</p>
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center">
              <span className="text-[10px] font-black text-gray-400 italic">PIX</span>
           </div>
           <div className="px-3 py-1 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center">
              <span className="text-[10px] font-black text-gray-400 italic">CARTÃO</span>
           </div>
        </div>
      </div>
    </div>
  )
}
