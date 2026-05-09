import { useState } from 'react'
import FAQItem from './FAQItem'

const faqData = [
  {
    question: 'Como faço meu pedido?',
    answer:
      'Escolha o produto desejado, adicione ao carrinho e finalize a compra preenchendo seus dados. O pagamento é feito via Pix.',
  },
  {
    question: 'Qual o prazo de entrega?',
    answer:
      'O prazo de entrega varia entre 5 a 15 dias úteis dependendo da sua localização.',
  },
  {
    question: 'Como funciona o rastreamento?',
    answer:
      'Após o envio, você receberá o código de rastreamento por email. Use-o no site dos Correios ou da transportadora.',
  },
  {
    question: 'Quais formas de pagamento?',
    answer:
      'Aceitamos pagamento via Pix. O pagamento é processado de forma segura e instantânea.',
  },
  {
    question: 'Como cancelar meu pedido?',
    answer:
      'Para cancelar, entre em contato pelo email contato@achadinhosdavitrine.com ou WhatsApp (11) 94837-2156 em até 24h após a compra.',
  },
  {
    question: 'Como acessar minha conta?',
    answer:
      'Acesse "Minha Conta" no menu e digite seu CPF ou email cadastrado na compra para ver seus pedidos.',
  },
  {
    question: 'Como trocar ou devolver?',
    answer:
      'Você tem até 7 dias após o recebimento para solicitar troca ou devolução. Entre em contato conosco para iniciar o processo.',
  },
]

interface FAQListProps {
  activeQuestion: string | null
  onSelect: (question: string) => void
}

export default function FAQList({ activeQuestion, onSelect }: FAQListProps) {
  return (
    <div className="flex flex-col" style={{ gap: '12px', paddingLeft: '16px', paddingRight: '16px' }}>
      <h2 className="text-[15px] font-semibold text-[#333333] px-4">Dúvidas frequentes</h2>
      <div className="flex flex-col" style={{ gap: '12px' }}>
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            isActive={activeQuestion === item.question}
            onClick={() => onSelect(item.question)}
          />
        ))}
      </div>
    </div>
  )
}

export { faqData }
