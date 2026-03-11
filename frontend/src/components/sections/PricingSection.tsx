import Link from 'next/link'
import { Check, Star, Gift, Shield, Zap } from 'lucide-react'

const features = [
  'Monitoramento de até 5 concursos',
  'Alertas por email + WhatsApp',
  'Verificação em tempo real',
  'Dashboard completo',
  'Histórico ilimitado',
  'Suporte prioritário',
  'Relatórios mensais',
]

export default function PricingSection() {
  return (
    <section id="precos" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            Preço único
          </span>
          <h2 className="section-title">
            Simples e{' '}
            <span className="gradient-text">acessível</span>
          </h2>
          <p className="section-subtitle">
            Um único plano com tudo que você precisa. Teste grátis por 30 dias!
          </p>
        </div>

        {/* Single Pricing Card */}
        <div className="max-w-lg mx-auto">
          <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-secondary-400 text-secondary-900 rounded-full text-sm font-bold flex items-center gap-2">
              <Gift className="w-4 h-4" />
              30 dias grátis
            </div>

            {/* Icon */}
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
              <Star className="w-8 h-8 text-white" />
            </div>

            {/* Plan Name */}
            <h3 className="text-2xl font-bold text-center mb-2">Plano Completo</h3>
            <p className="text-primary-100 text-center mb-8">Acesso total a todas as funcionalidades</p>

            {/* Price */}
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-xl text-primary-200">R$</span>
              <span className="text-6xl font-extrabold mx-1">19,99</span>
              <span className="text-xl text-primary-200">/mês</span>
            </div>
            <p className="text-center text-primary-200 text-sm mb-8">
              Após o período de teste gratuito
            </p>

            {/* Features */}
            <ul className="space-y-4 mb-10">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-secondary-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-secondary-900" />
                  </div>
                  <span className="text-primary-50">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link 
              href="/cadastro" 
              className="block w-full text-center py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all duration-200 shadow-lg"
            >
              Começar 30 dias grátis
            </Link>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2 text-primary-200 text-sm">
                <Shield className="w-4 h-4" />
                <span>Sem cartão</span>
              </div>
              <div className="flex items-center gap-2 text-primary-200 text-sm">
                <Zap className="w-4 h-4" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            ✓ Cancele a qualquer momento &nbsp;&nbsp;•&nbsp;&nbsp; 
            ✓ Sem taxas escondidas &nbsp;&nbsp;•&nbsp;&nbsp; 
            ✓ Pagamento seguro
          </p>
        </div>
      </div>
    </section>
  )
}
