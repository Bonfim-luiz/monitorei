import { 
  Clock, 
  Bell, 
  ShieldCheck, 
  Smartphone, 
  TrendingUp, 
  HeartHandshake,
  CheckCircle,
  XCircle 
} from 'lucide-react'

const benefits = [
  {
    icon: Clock,
    title: 'Economize tempo',
    description: 'Pare de verificar manualmente os Diários Oficiais todos os dias. Nós fazemos isso por você.',
    highlight: 'Até 2h por dia economizadas',
  },
  {
    icon: Bell,
    title: 'Alertas instantâneos',
    description: 'Receba notificações no momento em que seu nome aparecer em qualquer convocação.',
    highlight: 'Email + WhatsApp',
  },
  {
    icon: ShieldCheck,
    title: 'Nunca perca prazos',
    description: 'Convocações têm prazo curto. Com nossos alertas, você sempre terá tempo de agir.',
    highlight: '99.9% de precisão',
  },
  {
    icon: Smartphone,
    title: 'Acesso em qualquer lugar',
    description: 'Acompanhe tudo pelo celular ou computador. Interface simples e intuitiva.',
    highlight: '100% responsivo',
  },
  {
    icon: TrendingUp,
    title: 'Histórico completo',
    description: 'Acompanhe todas as publicações relacionadas aos seus concursos em um só lugar.',
    highlight: 'Dashboard completo',
  },
  {
    icon: HeartHandshake,
    title: 'Suporte dedicado',
    description: 'Equipe pronta para ajudar você em qualquer dúvida ou necessidade.',
    highlight: 'Atendimento humano',
  },
]

const comparison = [
  { 
    item: 'Verificação diária automática', 
    monitorei: true, 
    manual: false 
  },
  { 
    item: 'Alertas em tempo real', 
    monitorei: true, 
    manual: false 
  },
  { 
    item: 'Cobertura de múltiplos municípios', 
    monitorei: true, 
    manual: false 
  },
  { 
    item: 'Histórico de publicações', 
    monitorei: true, 
    manual: false 
  },
  { 
    item: 'Risco de perder convocação', 
    monitorei: false, 
    manual: true 
  },
  { 
    item: 'Tempo gasto diariamente', 
    monitorei: '0 min', 
    manual: '30-60 min' 
  },
]

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-4">
            Benefícios
          </span>
          <h2 className="section-title">
            Por que escolher o{' '}
            <span className="gradient-text">Monitorei</span>?
          </h2>
          <p className="section-subtitle">
            Milhares de concurseiros já garantem tranquilidade com nosso serviço
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                <benefit.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 mb-4">{benefit.description}</p>
              <span className="inline-block px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full text-sm font-medium">
                {benefit.highlight}
              </span>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Monitorei vs. Verificação Manual
            </h3>
            <p className="text-gray-600 mt-2">
              Veja a diferença entre usar nossa plataforma e fazer tudo sozinho
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 text-left text-gray-600 font-medium"></th>
                  <th className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full font-semibold">
                      <Bell className="w-4 h-4" />
                      Monitorei
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center text-gray-600 font-medium">
                    Verificação Manual
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700 font-medium">{row.item}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.monitorei === 'boolean' ? (
                        row.monitorei ? (
                          <CheckCircle className="w-6 h-6 text-secondary-500 mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold text-secondary-600">{row.monitorei}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.manual === 'boolean' ? (
                        row.manual ? (
                          <XCircle className="w-6 h-6 text-red-400 mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-500">{row.manual}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
