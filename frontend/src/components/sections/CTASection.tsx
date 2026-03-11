import Link from 'next/link'
import { ArrowRight, Bell } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-8 md:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            {/* Icon */}
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Bell className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Não deixe sua vaga escapar.{' '}
              <span className="text-secondary-300">Comece agora!</span>
            </h2>

            <p className="text-lg md:text-xl text-primary-100 mb-10 leading-relaxed">
              Milhares de candidatos já garantem tranquilidade com o Monitorei. 
              Comece seu teste grátis de 30 dias e nunca mais perca uma convocação.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/cadastro" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-700 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
              >
                Começar Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="#precos" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Ver planos
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">30 dias</p>
                <p className="text-sm text-primary-200">Teste grátis</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">Sem cartão</p>
                <p className="text-sm text-primary-200">Para começar</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">Cancele</p>
                <p className="text-sm text-primary-200">Quando quiser</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
