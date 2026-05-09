import { Check } from 'lucide-react'

const instructions = [
  { step: 1, text: 'Abra o app do seu banco' },
  { step: 2, text: 'Escolha a opção PIX Copia e Cola' },
  { step: 3, text: 'Cole o código copiado acima' },
  { step: 4, text: 'Confirme o pagamento' },
]

export default function PIXInstructions() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-[#1A1A1A]">Como pagar com PIX:</p>
      {instructions.map((item) => (
        <div key={item.step} className="flex items-center gap-3">
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#FF0040',
            }}
          >
            <span className="text-xs font-bold text-white">{item.step}</span>
          </div>
          <p className="text-sm text-[#1A1A1A]">{item.text}</p>
        </div>
      ))}
    </div>
  )
}
