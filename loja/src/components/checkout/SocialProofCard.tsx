import { useState, useEffect, useRef } from 'react'

const names = [
  'Camila', 'João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Beatriz',
  'Gabriel', 'Larissa', 'Rafael', 'Juliana', 'Thiago', 'Amanda',
  'Felipe', 'Bruna', 'Gustavo', 'Letícia', 'André', 'Natália',
  'Mateus', 'Isabela', 'Leonardo', 'Carolina', 'Diego', 'Fernanda',
  'Bruno', 'Vanessa', 'Ricardo', 'Patrícia', 'Eduardo', 'Camila',
  'Vinícius', 'Tatiane', 'Samuel', 'Priscila', 'Henrique', 'Aline',
  'Murilo', 'Daniela', 'Frederico', 'Mônica', 'Alexandre', 'Renata',
  'César', 'Adriana', 'Rodrigo', 'Simone', 'Fábio', 'Márcia'
]
const cities = [
  { city: 'São Paulo', uf: 'SP' },
  { city: 'Rio de Janeiro', uf: 'RJ' },
  { city: 'Belo Horizonte', uf: 'MG' },
  { city: 'Porto Alegre', uf: 'RS' },
  { city: 'Salvador', uf: 'BA' },
  { city: 'Recife', uf: 'PE' },
  { city: 'Fortaleza', uf: 'CE' },
  { city: 'Brasília', uf: 'DF' },
  { city: 'Curitiba', uf: 'PR' },
  { city: 'Manaus', uf: 'AM' },
  { city: 'Belém', uf: 'PA' },
  { city: 'Goiânia', uf: 'GO' },
  { city: 'Campinas', uf: 'SP' },
  { city: 'Florianópolis', uf: 'SC' },
  { city: 'Vitória', uf: 'ES' },
  { city: 'Natal', uf: 'RN' },
  { city: 'João Pessoa', uf: 'PB' },
  { city: 'Maceió', uf: 'AL' },
  { city: 'Aracaju', uf: 'SE' },
  { city: 'Teresina', uf: 'PI' },
]

function getInitial(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export default function SocialProofCard() {
  const [current, setCurrent] = useState(-1) // -1 = escondido inicialmente
  const elRef = useRef<HTMLDivElement | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    const el = document.createElement('div')
    el.id = 'social-proof-card'
    Object.assign(el.style, {
      position: 'fixed' as const,
      top: '20vh',
      left: '50vw',
      transform: 'translate(-50%, 0)',
      zIndex: '2147483647',
      width: 'calc(100vw - 32px)',
      maxWidth: '420px',
      padding: '12px 14px',
      backgroundColor: '#FFFFFF',
      borderRadius: '14px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'opacity 0.3s ease',
      opacity: '0',
      pointerEvents: 'none' as const,
    })
    document.body.appendChild(el)
    elRef.current = el

    // Função que gerencia o ciclo: mostrar -> esconder -> próximo
    const scheduleCycle = () => {
      // 1. Espera aleatória antes de mostrar (6-12s escondido)
      const hideTime = 6000 + Math.random() * 6000
      const hideTimer = setTimeout(() => {
        // Avança para a próxima pessoa
        setCurrent(prev => (prev + 1) % names.length)

        // 2. Mostra o popup (opacity 1)
        if (elRef.current) {
          elRef.current.style.opacity = '1'
          elRef.current.style.pointerEvents = 'auto'
        }

        // 3. Depois de 8-12s, esconde
        const showTime = 8000 + Math.random() * 4000
        const showTimer = setTimeout(() => {
          if (elRef.current) {
            elRef.current.style.opacity = '0'
            elRef.current.style.pointerEvents = 'none'
          }
          // Agendar próximo ciclo
          scheduleCycle()
        }, showTime)
        timersRef.current.push(showTimer)
      }, hideTime)
      timersRef.current.push(hideTimer)
    }

    // Delay inicial de 3-6s (aparece mais cedo)
    const initialTimer = setTimeout(scheduleCycle, 3000 + Math.random() * 3000)
    timersRef.current.push(initialTimer)

    return () => {
      clearAllTimers()
      el.remove()
    }
  }, [])

  // Atualiza o conteúdo quando current muda
  useEffect(() => {
    const el = elRef.current
    if (!el || current < 0) return

    const name = names[current]
    const cityData = cities[current % cities.length]
    const initials = getInitial(name)

    el.innerHTML = `
      <div style="width:34px;height:34px;border-radius:50%;background:#E8F5E9;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 4.5L6 12 2.5 8.5" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div style="display:flex;flex-direction:column;line-height:1.3;">
        <span style="font-size:13.5px;font-weight:600;color:#333;">${name} ${initials}. de ${cityData.city}/${cityData.uf}</span>
        <span style="font-size:12.5px;color:#777;font-weight:400;">acabou de finalizar uma compra • há poucos segundos</span>
      </div>
    `
  }, [current])

  return null
}
