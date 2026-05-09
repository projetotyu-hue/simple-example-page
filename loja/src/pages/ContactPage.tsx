import Header from '../components/Header'
import SubHeader from '../components/SubHeader'
import ContactCard from '../components/ContactCard'
import Footer from '../components/Footer'
import { Mail, Phone, Clock, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-[360px] mx-auto bg-white min-h-screen flex flex-col overflow-x-hidden">
        <SubHeader title="Contato" borderColor="#EEEEEE" />
        <main className="flex-1 px-4" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          <div className="text-center pt-6 pb-4">
            <h2 className="text-[18px] font-bold text-[#333333] mb-1">Fale Conosco</h2>
            <p className="text-[14px] text-[#777777]">Estamos aqui para ajudar!</p>
          </div>

          <div className="flex flex-col" style={{ gap: '12px' }}>
            <ContactCard
              icon={Mail}
              iconColor="#FF2D55"
              iconBg="#FFEDEE"
              title="E-mail"
              content="achadinhoscontato@gmail.com"
              href="mailto:achadinhoscontato@gmail.com"
            />
            <ContactCard
              icon={Phone}
              iconColor="#25D366"
              iconBg="#E9F9EF"
              title="WhatsApp"
              content="(11) 99658-6625"
              href="https://wa.me/5511996586625"
            />
            <ContactCard
              icon={Clock}
              iconColor="#3B82F6"
              iconBg="#EEF4FF"
              title="Horário de Atendimento"
              content="Segunda a Sexta, das 9h às 18h"
            />
            <ContactCard
              icon={MapPin}
              iconColor="#F59E0B"
              iconBg="#FFF6E5"
              title="Endereço"
              content="AV CELSO GARCIA 3220, São Paulo-SP"
            />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
