import { useState, useEffect } from 'react'
import ChatHeader from '../components/ChatHeader'
import ChatMessage from '../components/ChatMessage'
import MessageUser from '../components/MessageUser'
import LoadingMessage from '../components/LoadingMessage'
import FAQList, { faqData } from '../components/FAQList'
import Footer from '../components/Footer'

const SHOP_NAME = 'Achadinhos do Momento'

export default function ChatPage() {
  const shopName = SHOP_NAME
  
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)
  const [userQuestion, setUserQuestion] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = (question: string) => {
    const isTogglingOff = question === activeQuestion

    if (isTogglingOff) {
      setActiveQuestion(null)
      setUserQuestion(null)
      setAnswer(null)
      setIsLoading(false)
      return
    }

    setActiveQuestion(question)
    setUserQuestion(question)
    setIsLoading(true)
    setAnswer(null)

    const answerItem = faqData.find((item) => item.question === question)
    if (!answerItem) return

    const delay = 400 + Math.random() * 400
    setTimeout(() => {
      setAnswer(answerItem.answer)
      setIsLoading(false)
    }, delay)
  }

  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <div className="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col shadow-sm">
        <ChatHeader title="Atendimento" />
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
          <ChatMessage message={`Olá! Sou o assistente virtual da ${shopName}. Como posso te ajudar hoje?`} />
          {userQuestion && <MessageUser text={userQuestion} />}
          {isLoading && <LoadingMessage />}
          {answer && !isLoading && <ChatMessage message={answer} />}
        </div>
        <div className="pb-8 bg-[var(--background-soft)] border-t border-gray-100">
          <div className="p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dúvidas frequentes</h3>
            <FAQList activeQuestion={activeQuestion} onSelect={handleSelect} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
