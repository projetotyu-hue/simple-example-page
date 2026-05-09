import Header from '../components/Header'
import SubHeader from '../components/SubHeader'
import LoginForm from '../components/LoginForm'
import Footer from '../components/Footer'

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-[360px] mx-auto bg-white min-h-screen flex flex-col overflow-x-hidden">
        <SubHeader title="Minha Conta" />
        <main className="flex-1">
          <LoginForm />
        </main>
        <Footer />
      </div>
    </div>
  )
}
