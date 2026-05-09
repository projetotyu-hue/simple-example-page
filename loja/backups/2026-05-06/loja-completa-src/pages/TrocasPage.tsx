import Header from '../components/Header'
import Footer from '../components/Footer'

export default function TrocasPage() {
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
              <p className="text-sm font-medium text-gray-800">Trocas e Devoluções</p>
            </div>
            <div className="px-4 py-6 flex flex-col gap-5">
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">1. Prazo para Troca</p>
                <p className="text-sm text-gray-600 leading-relaxed">Você tem até 7 (sete) dias corridos após o recebimento do produto para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">2. Condições do Produto</p>
                <p className="text-sm text-gray-600 leading-relaxed">O produto deve estar em perfeitas condições, sem sinais de uso, com a embalagem original e todos os acessórios inclusos. Produtos com sinais de uso indevido não serão aceitos.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">3. Procedimento</p>
                <p className="text-sm text-gray-600 leading-relaxed">Entre em contato via WhatsApp ou e-mail informando o número do pedido e o motivo da troca. Enviaremos as instruções para envio do produto de volta.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">4. Custos de Envio</p>
                <p className="text-sm text-gray-600 leading-relaxed">Em caso de defeito ou erro nosso, arcamos com os custos de envio de ida e volta. Em outros casos, os custos de envio são de responsabilidade do cliente.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">5. Reembolso</p>
                <p className="text-sm text-gray-600 leading-relaxed">Após recebermos o produto e confirmarmos as condições, o reembolso será processado em até 5 dias úteis via PIX ou estorno no cartão, conforme a forma de pagamento original.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">6. Troca por Outro Produto</p>
                <p className="text-sm text-gray-600 leading-relaxed">Você pode optar por trocar por outro produto de valor igual ou superior (pagando a diferença). O novo produto será enviado após recebermos o produto original.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">7. Contato</p>
                <p className="text-sm text-gray-600 leading-relaxed">Para iniciar o processo de troca, entre em contato: WhatsApp (11) 99658-6625 ou e-mail achadinhoscontato@gmail.com. Atendimento de Segunda a Sexta, das 9h às 18h.</p>
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
