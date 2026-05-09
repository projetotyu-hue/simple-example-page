import { ShieldCheck, Lock, Award, Mail, Phone, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const SHOP_NAME = 'Achadinhos do Momento'
const CNPJ = '55.012.266/0001-46'
const ADDRESS = 'AV CELSO GARCIA 3220, São Paulo-SP'
const EMAIL = 'achadinhoscontato@gmail.com'
const PHONE = '(11) 99658-6625'
const HOURS = 'Segunda a Sexta, das 9h as 18h'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-8">
      <div className="px-4 py-6 flex flex-col items-center gap-4">
        <span className="text-base font-bold text-rose-600 tracking-tight">
          {SHOP_NAME}
        </span>

        <div className="flex items-center justify-center gap-6 text-gray-400">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck size={20} aria-hidden="true" />
            <span className="text-[10px]">Compra Segura</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Lock size={20} aria-hidden="true" />
            <span className="text-[10px]">Site Protegido</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Award size={20} aria-hidden="true" />
            <span className="text-[10px]">Garantia</span>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 flex flex-col gap-0.5">
          <p className="font-medium text-gray-600">{SHOP_NAME}</p>
          <p>CNPJ: {CNPJ}</p>
          <p>{ADDRESS}</p>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center justify-center gap-1 hover:text-gray-600"
          >
            <Mail size={10} aria-hidden="true" />
            {EMAIL}
          </a>
          <a
            href={`https://wa.me/5511996586625`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 hover:text-gray-600"
          >
            <Phone size={10} aria-hidden="true" />
            {PHONE}
          </a>
          <p className="flex items-center justify-center gap-1">
            <Clock size={10} aria-hidden="true" />
            {HOURS}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-gray-400">Formas de Pagamento</p>
          <div className="flex items-center gap-2">
            <span className="border border-gray-200 rounded px-3 py-1 text-xs font-medium text-gray-600">PIX</span>
            <span className="border border-gray-200 rounded px-3 py-1 text-xs font-medium text-gray-600">Cartão</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <Link to="/termos" className="hover:text-gray-600 transition-colors">Termos de Uso</Link>
          <Link to="/privacidade" className="hover:text-gray-600 transition-colors">Privacidade</Link>
          <Link to="/trocas" className="hover:text-gray-600 transition-colors">Trocas e Devoluções</Link>
          <Link to="/contato" className="hover:text-gray-600 transition-colors">Contato</Link>
        </div>
      </div>
    </footer>
  )
}
