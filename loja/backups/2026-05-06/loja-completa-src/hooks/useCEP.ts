import { useState, useEffect } from 'react'

interface CEPData {
  address: string
  neighborhood: string
  city: string
  state: string
}

export function useCEP(cep: string) {
  const [data, setData] = useState<CEPData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const cleaned = cep.replace(/\D/g, '')
    if (cleaned.length !== 8) {
      setData(null)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    // Simulate API delay (800-1200ms)
    const delay = 800 + Math.random() * 400
    const timeout = setTimeout(() => {
      // Simulated CEP lookup - in production, use ViaCEP API
      const mockData: Record<string, CEPData> = {
        '01310100': { address: 'Avenida Paulista', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP' },
        '20040020': { address: 'Rua da Assembleia', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ' },
        '30130010': { address: 'Avenida Afonso Pena', neighborhood: 'Centro', city: 'Belo Horizonte', state: 'MG' },
      }

      const result = mockData[cleaned]
      if (result) {
        setData(result)
      } else {
        // Default fallback for any CEP
        setData({
          address: 'Rua Exemplo',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
        })
      }
      setLoading(false)
    }, delay)

    return () => clearTimeout(timeout)
  }, [cep])

  return { data, loading, error }
}
