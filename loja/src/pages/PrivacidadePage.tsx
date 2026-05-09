import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-sm overflow-x-hidden">
        <Header />
        <main className="flex-1">
          <div className="pb-8">
            <div className="sticky top-[57px] z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
              <a className="p-1 rounded-full hover:bg-gray-100 transition-colors" href="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left text-gray-600" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
              </a>
              <p className="text-sm font-medium text-gray-800">Política de Privacidade</p>
            </div>
            <div className="px-4 py-6 flex flex-col gap-5">
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">1. Dados Coletados</p>
                <p className="text-sm text-gray-600 leading-relaxed">Coletamos informações pessoais fornecidas por você durante o processo de compra, incluindo: nome completo, e-mail, telefone, CPF e endereço de entrega. Também coletamos dados de navegação através de cookies para melhorar sua experiência.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">2. Uso dos Dados</p>
                <p className="text-sm text-gray-600 leading-relaxed">Seus dados são utilizados exclusivamente para: processamento e entrega de pedidos, comunicação sobre o status da compra, melhoria dos nossos serviços e cumprimento de obrigações legais.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">3. Compartilhamento</p>
                <p className="text-sm text-gray-600 leading-relaxed">Não vendemos ou compartilhamos seus dados pessoais com terceiros, exceto quando necessário para: processamento de pagamentos (gateways de pagamento), entrega de produtos (transportadoras) e cumprimento de obrigações legais.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">4. Cookies</p>
                <p className="text-sm text-gray-600 leading-relaxed">Utilizamos cookies para análise de tráfego e desempenho do site. Você pode desabilitar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">5. Segurança</p>
                <p className="text-sm text-gray-600 leading-relaxed">Empregamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou destruição.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">6. Seus Direitos (LGPD)</p>
                <p className="text-sm text-gray-600 leading-relaxed">Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar seus dados, solicitar correção, solicitar exclusão, revogar consentimento e solicitar portabilidade. Para exercer seus direitos, entre em contato pelo e-mail achadinhoscontato@gmail.com.</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">Última atualização: Março de 2026</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
