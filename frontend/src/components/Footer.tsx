import Link from 'next/link'
import { Bell, Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Monitorei</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nunca mais perca sua vaga em concurso público. Monitoramento automático 
              de convocações com alertas por email e WhatsApp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#como-funciona" className="text-gray-400 hover:text-white transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#beneficios" className="text-gray-400 hover:text-white transition-colors">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#precos" className="text-gray-400 hover:text-white transition-colors">
                  Preços
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
                  Perguntas frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/termos" className="text-gray-400 hover:text-white transition-colors">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <a href="mailto:contato@monitorei.com.br" className="text-gray-400 hover:text-white transition-colors">
                  contato@monitorei.com.br
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <a href="tel:+5511999999999" className="text-gray-400 hover:text-white transition-colors">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  São Paulo, SP - Brasil
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2026 Monitorei. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm">
              Feito com ❤️ para concurseiros de todo o Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
