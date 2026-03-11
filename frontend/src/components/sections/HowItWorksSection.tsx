import { FileSearch, Bell, UserCheck, Shield, Clock, Smartphone } from 'lucide-react'

const steps = [
  {
    icon: UserCheck,
    title: 'Cadastre-se',
    description: 'Crie sua conta em menos de 2 minutos. Informe seus dados e os concursos que deseja monitorar.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: FileSearch,
    title: 'Monitoramos 24/7',
    description: 'Nossa tecnologia verifica diariamente os Diários Oficiais em busca do seu nome nas convocações.',
    color: 'bg-secondary-100 text-secondary-600',
  },
  {
    icon: Bell,
    title: 'Receba alertas',
    description: 'Assim que seu nome aparecer, você recebe notificação por email e WhatsApp instantaneamente.',
    color: 'bg-orange-100 text-orange-600',
  },
]

const features = [
  {
    icon: Shield,
    title: 'Dados seguros',
    description: 'Seus dados são criptografados e nunca compartilhados.',
  },
  {
    icon: Clock,
    title: 'Verificação diária',
    description: 'Monitoramos todos os dias, inclusive finais de semana.',
  },
  {
    icon: Smartphone,
    title: 'Multi-canal',
    description: 'Alertas por email, WhatsApp e notificação push.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            Como funciona
          </span>
          <h2 className="section-title">
            Simples, rápido e{' '}
            <span className="gradient-text">automático</span>
          </h2>
          <p className="section-subtitle">
            Em apenas 3 passos você garante tranquilidade e nunca mais perde uma convocação
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-gray-300 rotate-45"></div>
                </div>
              )}
              
              <div className="card hover:shadow-2xl transition-shadow duration-300 text-center relative z-10 bg-white">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Features */}
        <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
