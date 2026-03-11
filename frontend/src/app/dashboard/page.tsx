'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bell, 
  Home, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plus,
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react'

// Dados simulados
const concursosMonitorados = [
  {
    id: 1,
    orgao: 'Prefeitura de São Paulo',
    cargo: 'Professor de Educação Básica',
    classificacao: 12,
    status: 'ativo',
    ultimaVerificacao: '2026-03-11 09:15',
    edital: 'Edital 001/2026',
  },
  {
    id: 2,
    orgao: 'Tribunal de Justiça - SP',
    cargo: 'Analista Judiciário',
    classificacao: 45,
    status: 'ativo',
    ultimaVerificacao: '2026-03-11 09:15',
    edital: 'Edital 003/2026',
  },
  {
    id: 3,
    orgao: 'INSS',
    cargo: 'Técnico do Seguro Social',
    classificacao: 128,
    status: 'ativo',
    ultimaVerificacao: '2026-03-11 09:15',
    edital: 'Edital Federal 012/2025',
  },
]

const alertasRecentes = [
  {
    id: 1,
    tipo: 'convocacao',
    titulo: 'Nova convocação detectada!',
    descricao: 'Prefeitura de São Paulo - 5ª Chamada',
    data: '2026-03-10',
    lido: false,
  },
  {
    id: 2,
    tipo: 'atualizacao',
    titulo: 'Atualização no edital',
    descricao: 'TJ-SP publicou retificação',
    data: '2026-03-09',
    lido: true,
  },
  {
    id: 3,
    tipo: 'info',
    titulo: 'Verificação concluída',
    descricao: 'Todos os diários foram verificados',
    data: '2026-03-08',
    lido: true,
  },
]

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const usuario = {
    nome: 'João Silva',
    email: 'joao@email.com',
    plano: 'Essencial',
    diasRestantes: 25,
    trialAtivo: true,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Monitorei</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveTab('concursos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'concursos' 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Meus Concursos</span>
            </button>
            
            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'configuracoes' 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Configurações</span>
            </button>
          </nav>

          {/* Trial Banner */}
          {usuario.trialAtivo && (
            <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl text-white">
              <p className="text-sm font-medium mb-1">Período de teste</p>
              <p className="text-2xl font-bold">{usuario.diasRestantes} dias</p>
              <p className="text-xs text-secondary-100 mt-1">restantes</p>
              <Link 
                href="/planos"
                className="block mt-3 text-center py-2 bg-white text-secondary-600 rounded-lg text-sm font-semibold hover:bg-secondary-50 transition-colors"
              >
                Fazer upgrade
              </Link>
            </div>
          )}

          {/* User Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{usuario.nome}</p>
                <p className="text-sm text-gray-500 truncate">{usuario.email}</p>
              </div>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'concursos' && 'Meus Concursos'}
                {activeTab === 'configuracoes' && 'Configurações'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardContent 
              concursos={concursosMonitorados} 
              alertas={alertasRecentes}
              usuario={usuario}
            />
          )}
          {activeTab === 'concursos' && (
            <ConcursosContent concursos={concursosMonitorados} />
          )}
          {activeTab === 'configuracoes' && (
            <ConfiguracoesContent usuario={usuario} />
          )}
        </main>
      </div>
    </div>
  )
}

// Dashboard Content Component
function DashboardContent({ concursos, alertas, usuario }: { 
  concursos: typeof concursosMonitorados
  alertas: typeof alertasRecentes
  usuario: { nome: string; plano: string }
}) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Olá, {usuario.nome.split(' ')[0]}! 👋
        </h2>
        <p className="text-primary-100">
          Seu monitoramento está ativo. Última verificação há 5 minutos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{concursos.length}</p>
              <p className="text-sm text-gray-500">Concursos monitorados</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-sm text-gray-500">Verificações hoje</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-500">Alertas não lidos</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12ª</p>
              <p className="text-sm text-gray-500">Melhor classificação</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts & Concursos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alertas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Alertas Recentes</h3>
            <Link href="#" className="text-primary-600 text-sm font-medium hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {alertas.map((alerta) => (
              <div key={alerta.id} className={`p-4 hover:bg-gray-50 transition-colors ${!alerta.lido ? 'bg-primary-50/50' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alerta.tipo === 'convocacao' ? 'bg-secondary-100' :
                    alerta.tipo === 'atualizacao' ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    {alerta.tipo === 'convocacao' && <CheckCircle className="w-5 h-5 text-secondary-600" />}
                    {alerta.tipo === 'atualizacao' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                    {alerta.tipo === 'info' && <Clock className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{alerta.titulo}</p>
                    <p className="text-sm text-gray-500 truncate">{alerta.descricao}</p>
                    <p className="text-xs text-gray-400 mt-1">{alerta.data}</p>
                  </div>
                  {!alerta.lido && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concursos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Seus Concursos</h3>
            <button className="flex items-center gap-2 text-primary-600 text-sm font-medium hover:underline">
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {concursos.map((concurso) => (
              <div key={concurso.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{concurso.orgao}</p>
                    <p className="text-sm text-gray-500 truncate">{concurso.cargo}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">{concurso.classificacao}ª</p>
                      <p className="text-xs text-gray-400">classificação</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Concursos Content Component
function ConcursosContent({ concursos }: { concursos: typeof concursosMonitorados }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar concursos..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Concurso
        </button>
      </div>

      {/* Lista */}
      <div className="grid gap-4">
        {concursos.map((concurso) => (
          <div key={concurso.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                    Ativo
                  </span>
                  <span className="text-sm text-gray-500">{concurso.edital}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{concurso.orgao}</h3>
                <p className="text-gray-600">{concurso.cargo}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Última verificação: {concurso.ultimaVerificacao}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">{concurso.classificacao}ª</p>
                  <p className="text-sm text-gray-500">Classificação</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors">
                    Ver detalhes
                  </button>
                  <button className="px-4 py-2 text-gray-500 hover:text-red-600 rounded-lg text-sm font-medium transition-colors">
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Configurações Content Component
function ConfiguracoesContent({ usuario }: { usuario: { nome: string; email: string; plano: string } }) {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Dados Pessoais */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
          <p className="text-sm text-gray-500">Atualize suas informações de cadastro</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nome completo</label>
              <input type="text" defaultValue={usuario.nome} className="input-field" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" defaultValue={usuario.email} className="input-field" />
            </div>
            <div>
              <label className="label">Telefone</label>
              <input type="tel" defaultValue="(11) 99999-9999" className="input-field" />
            </div>
            <div>
              <label className="label">Cidade</label>
              <input type="text" defaultValue="São Paulo" className="input-field" />
            </div>
          </div>
          <button className="btn-primary mt-4">
            Salvar alterações
          </button>
        </div>
      </div>

      {/* Notificações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
          <p className="text-sm text-gray-500">Configure como deseja receber alertas</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Alertas por email</p>
              <p className="text-sm text-gray-500">Receba notificações no seu email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Alertas por WhatsApp</p>
              <p className="text-sm text-gray-500">Receba notificações no WhatsApp</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Resumo diário</p>
              <p className="text-sm text-gray-500">Receba um resumo diário das verificações</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Assinatura */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Assinatura</h3>
          <p className="text-sm text-gray-500">Gerencie seu plano e pagamentos</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-medium text-gray-900">Plano atual</p>
              <p className="text-2xl font-bold text-primary-600">{usuario.plano}</p>
            </div>
            <Link href="/planos" className="btn-secondary">
              Alterar plano
            </Link>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button className="text-red-600 hover:text-red-700 font-medium text-sm">
              Cancelar assinatura
            </button>
          </div>
        </div>
      </div>

      {/* Excluir Conta */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Zona de Perigo</h3>
        <p className="text-sm text-red-600 mb-4">
          Ao excluir sua conta, todos os seus dados serão permanentemente removidos. 
          Esta ação não pode ser desfeita.
        </p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          Excluir minha conta
        </button>
      </div>
    </div>
  )
}
