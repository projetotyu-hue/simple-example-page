import Header from '../components/Header'
import Footer from '../components/Footer'

export default function TermosPage() {
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
              <p className="text-sm font-medium text-gray-800">Termos de Uso</p>
            </div>
            <div className="px-4 py-6 flex flex-col gap-5">
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">1. Aceitação dos Termos</p>
                <p className="text-sm text-gray-600 leading-relaxed">Ao acessar e utilizar o site Achadinhos do Momento, você concorda com os presentes Termos de Uso. Caso não concorde, solicitamos que não utilize nossos serviços.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">2. Produtos e Preços</p>
                <p className="text-sm text-gray-600 leading-relaxed">Os preços dos produtos estão sujeitos a alterações sem aviso prévio. As imagens dos produtos são meramente ilustrativas e podem apresentar variações em relação ao produto real. Nos esforçamos para manter todas as informações atualizadas e precisas.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">3. Pagamentos</p>
                <p className="text-sm text-gray-600 leading-relaxed">Aceitamos pagamentos via PIX e Cartão de Crédito. O processamento do pedido inicia após a confirmação do pagamento. Pagamentos via PIX são confirmados em até 30 minutos.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">4. Entrega</p>
                <p className="text-sm text-gray-600 leading-relaxed">O prazo de entrega varia conforme a região e a modalidade de frete escolhida. Os prazos informados são estimativas e podem sofrer variações por motivos de força maior.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">5. Propriedade Intelectual</p>
                <p className="text-sm text-gray-600 leading-relaxed">Todo o conteúdo do site, incluindo textos, imagens, logotipos e layout, é de propriedade da Achadinhos do Momento e protegido por leis de propriedade intelectual.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">6. Limitação de Responsabilidade</p>
                <p className="text-sm text-gray-600 leading-relaxed">A Achadinhos do Momento não se responsabiliza por danos indiretos decorrentes do uso do site. Nossa responsabilidade limita-se ao valor pago pelo produto adquirido.</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">7. Alterações nos Termos</p>
                <p className="text-sm text-gray-600 leading-relaxed">Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entram em vigor imediatamente após sua publicação no site.</p>
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
