// Types for the Monitorei SaaS application

// User types
export interface User {
  id: string
  nome: string
  email: string
  telefone: string
  cidade: string
  estado: string
  createdAt: Date
  updatedAt: Date
}

export interface UserSubscription {
  id: string
  userId: string
  plano: 'gratuito' | 'essencial' | 'profissional'
  status: 'ativo' | 'cancelado' | 'expirado' | 'trial'
  dataInicio: Date
  dataFim: Date
  trialAtivo: boolean
  diasRestantesTrial: number
}

// Concurso types
export interface Concurso {
  id: string
  userId: string
  orgao: string
  cargo: string
  edital: string
  classificacao: number
  nomeInscricao: string
  status: 'ativo' | 'pausado' | 'encerrado'
  createdAt: Date
  updatedAt: Date
}

// Alert types
export type AlertType = 'convocacao' | 'atualizacao' | 'info' | 'erro'

export interface Alerta {
  id: string
  userId: string
  concursoId?: string
  tipo: AlertType
  titulo: string
  descricao: string
  lido: boolean
  createdAt: Date
}

// Convocação types
export interface Convocacao {
  id: string
  concursoId: string
  editalConvocacao: string
  dataPublicacao: Date
  classificacaoInicio: number
  classificacaoFim: number
  prazoComparecimento: Date
  link?: string
}

// Notification preferences
export interface NotificationPreferences {
  userId: string
  emailEnabled: boolean
  whatsappEnabled: boolean
  smsEnabled: boolean
  resumoDiario: boolean
  horarioResumo?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form types
export interface CadastroFormData {
  nome: string
  email: string
  telefone: string
  cidade: string
  estado: string
  senha: string
  confirmarSenha: string
  termos: boolean
}

export interface LoginFormData {
  email: string
  senha: string
  lembrar?: boolean
}

export interface ConcursoFormData {
  orgao: string
  cargo: string
  edital: string
  classificacao: number
  nomeInscricao: string
}
