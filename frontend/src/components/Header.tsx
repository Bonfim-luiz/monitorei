'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bell, Shield, Clock, CheckCircle } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Monitorei
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#como-funciona" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Como funciona
            </a>
            <a href="#beneficios" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Benefícios
            </a>
            <a href="#precos" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Preços
            </a>
            <a href="#faq" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/cadastro" 
              className="btn-primary"
            >
              Começar Grátis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-4 space-y-4">
            <a 
              href="#como-funciona" 
              className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Como funciona
            </a>
            <a 
              href="#beneficios" 
              className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefícios
            </a>
            <a 
              href="#precos" 
              className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </a>
            <a 
              href="#faq" 
              className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Link 
                href="/login" 
                className="block w-full text-center py-3 text-primary-600 font-medium border border-primary-600 rounded-lg"
              >
                Entrar
              </Link>
              <Link 
                href="/cadastro" 
                className="block w-full text-center btn-primary"
              >
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
