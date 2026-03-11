import Link from 'next/link'
import { ArrowRight, Bell, Shield, Zap, CheckCircle } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary-200 rounded-full blur-3xl opacity-30 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>30 dias grátis para testar</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Nunca mais{' '}
              <span className="gradient-text">perca sua vaga</span>{' '}
              em concurso público
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Monitoramos diariamente os Diários Oficiais e enviamos alertas 
              automáticos quando seu nome aparecer em convocações. 
              <strong className="text-gray-800"> Você não precisa mais verificar todos os dias.</strong>
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <CheckCircle className="w-5 h-5 text-secondary-500" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <CheckCircle className="w-5 h-5 text-secondary-500" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <CheckCircle className="w-5 h-5 text-secondary-500" />
                <span>Suporte humanizado</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start">
              <Link href="/cadastro" className="btn-success text-lg px-8 py-4">
                Começar Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#como-funciona" className="btn-secondary text-lg px-8 py-4">
                Ver como funciona
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Confiado por concurseiros de todo o Brasil</p>
              <div className="flex items-center justify-center lg:justify-start gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">5.000+</p>
                  <p className="text-sm text-gray-500">Usuários ativos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">150+</p>
                  <p className="text-sm text-gray-500">Municípios</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-500">Satisfação</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative animate-slide-up">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Phone Mockup */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200">
                {/* Notification Preview */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4 text-white mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">🎉 Parabéns! Você foi convocado!</p>
                      <p className="text-sm text-primary-100 mt-1">
                        Prefeitura de São Paulo - Edital 001/2026
                      </p>
                    </div>
                  </div>
                </div>

                {/* Alert Card */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">Hoje, 09:15</span>
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                      Novo
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Edital de Convocação Nº 15</h4>
                  <p className="text-sm text-gray-600 mt-1">Professor de Educação Básica</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-lg font-bold text-primary-600">12ª</span>
                    <span className="text-sm text-gray-500">classificação</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Monitorando 3 concursos</span>
                  </div>
                  <Shield className="w-5 h-5 text-primary-500" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
