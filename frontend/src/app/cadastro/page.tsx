'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Bell, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  ArrowRight,
  CheckCircle,
  Loader2
} from 'lucide-react'

const cadastroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido').max(15, 'Telefone inválido'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado é obrigatório'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string(),
  termos: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
})

type CadastroForm = z.infer<typeof cadastroSchema>

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
  })

  const onSubmit = async (data: CadastroForm) => {
    setIsLoading(true)
    
    // Simula chamada à API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Dados do cadastro:', data)
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-secondary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cadastro realizado!
          </h1>
          <p className="text-gray-600 mb-8">
            Seu período de teste grátis de 30 dias começou. 
            Enviamos um email de confirmação para você.
          </p>
          <Link href="/dashboard" className="btn-primary">
            Acessar Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Monitorei</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar conta grátis
          </h1>
          <p className="text-gray-600 mb-8">
            Comece seu teste de 30 dias. Sem cartão de crédito.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nome */}
            <div>
              <label className="label">Nome completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('nome')}
                  type="text"
                  placeholder="Seu nome completo"
                  className={`input-field pl-12 ${errors.nome ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="seu@email.com"
                  className={`input-field pl-12 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label className="label">Telefone (WhatsApp)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('telefone')}
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className={`input-field pl-12 ${errors.telefone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.telefone && (
                <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>
              )}
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Cidade</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('cidade')}
                    type="text"
                    placeholder="Sua cidade"
                    className={`input-field pl-12 ${errors.cidade ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.cidade && (
                  <p className="text-red-500 text-sm mt-1">{errors.cidade.message}</p>
                )}
              </div>
              <div>
                <label className="label">Estado</label>
                <select
                  {...register('estado')}
                  className={`input-field ${errors.estado ? 'border-red-500' : ''}`}
                >
                  <option value="">UF</option>
                  {estados.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                {errors.estado && (
                  <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>
                )}
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('senha')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  className={`input-field pl-12 pr-12 ${errors.senha ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="label">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('confirmarSenha')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  className={`input-field pl-12 pr-12 ${errors.confirmarSenha ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha.message}</p>
              )}
            </div>

            {/* Termos */}
            <div className="flex items-start gap-3">
              <input
                {...register('termos')}
                type="checkbox"
                id="termos"
                className="mt-1 w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="termos" className="text-sm text-gray-600">
                Li e aceito os{' '}
                <Link href="/termos" className="text-primary-600 hover:underline">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link href="/privacidade" className="text-primary-600 hover:underline">
                  Política de Privacidade
                </Link>
              </label>
            </div>
            {errors.termos && (
              <p className="text-red-500 text-sm">{errors.termos.message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-success w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary-600 font-semibold hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Banner */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">
            Nunca mais perca uma convocação em concurso público
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary-300 flex-shrink-0" />
              <p className="text-primary-100">
                Monitoramento automático de Diários Oficiais
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary-300 flex-shrink-0" />
              <p className="text-primary-100">
                Alertas instantâneos por email e WhatsApp
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary-300 flex-shrink-0" />
              <p className="text-primary-100">
                30 dias grátis para experimentar
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary-300 flex-shrink-0" />
              <p className="text-primary-100">
                Sem cartão de crédito para começar
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <p className="text-primary-100 italic mb-4">
              "O Monitorei me salvou! Fui convocada para minha vaga dos sonhos e só 
              descobri graças ao alerta que recebi. Sem ele, teria perdido o prazo."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">M</span>
              </div>
              <div>
                <p className="font-semibold">Maria Silva</p>
                <p className="text-sm text-primary-200">Professora - SP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
