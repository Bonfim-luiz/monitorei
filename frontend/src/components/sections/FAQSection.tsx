'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'Como funciona o período de teste grátis?',
    answer: 'Ao se cadastrar, você tem acesso gratuito por 30 dias a todas as funcionalidades do plano Essencial. Não pedimos cartão de crédito para começar. Ao final do período, você pode escolher continuar com um plano pago ou encerrar sua conta.',
  },
  {
    question: 'Quais Diários Oficiais vocês monitoram?',
    answer: 'Monitoramos Diários Oficiais de mais de 150 municípios brasileiros, incluindo as principais capitais e cidades com grande volume de concursos. A lista está em constante expansão. Se não encontrar seu município, entre em contato que priorizamos a inclusão.',
  },
  {
    question: 'Como recebo os alertas?',
    answer: 'Você recebe alertas por email e, nos planos pagos, também por WhatsApp. Assim que seu nome aparecer em qualquer edital de convocação, você é notificado imediatamente. Você pode configurar a frequência e os canais de notificação no seu painel.',
  },
  {
    question: 'E se eu for convocado em mais de um concurso?',
    answer: 'Você receberá alertas separados para cada convocação. No seu dashboard, você pode acompanhar o status de todos os concursos que está monitorando e verificar o histórico de publicações.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Não temos fidelidade ou multa por cancelamento. Você pode cancelar sua assinatura diretamente pelo painel, e seu acesso continuará ativo até o fim do período já pago.',
  },
  {
    question: 'Os dados são seguros?',
    answer: 'Absolutamente. Usamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança. Seus dados nunca são compartilhados com terceiros e você pode solicitar a exclusão completa a qualquer momento.',
  },
  {
    question: 'Posso monitorar concursos de familiares?',
    answer: 'Sim! No plano Profissional, você pode adicionar até 5 pessoas para monitoramento, recebendo alertas para todos em uma única conta. Ideal para famílias de concurseiros.',
  },
  {
    question: 'Como adiciono um novo concurso para monitorar?',
    answer: 'É muito simples. No seu dashboard, clique em "Adicionar Concurso", informe o órgão, cargo e seu nome conforme consta na inscrição. Nosso sistema começará a monitorar automaticamente.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="section-title">
            Perguntas{' '}
            <span className="gradient-text">frequentes</span>
          </h2>
          <p className="section-subtitle">
            Tire suas dúvidas sobre o Monitorei
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl border transition-all duration-200 ${
                openIndex === index ? 'border-primary-200 shadow-lg' : 'border-gray-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`font-semibold pr-4 ${
                  openIndex === index ? 'text-primary-600' : 'text-gray-900'
                }`}>
                  {faq.question}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  openIndex === index ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 animate-fade-in">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 p-8 bg-gray-50 rounded-2xl">
          <p className="text-gray-600 mb-4">
            Não encontrou sua dúvida?
          </p>
          <a 
            href="mailto:contato@monitorei.com.br" 
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Entre em contato com nossa equipe →
          </a>
        </div>
      </div>
    </section>
  )
}
