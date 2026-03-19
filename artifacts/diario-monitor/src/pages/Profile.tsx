import { useState } from "react";
import { useListUsers, useGetUserByEmail } from "@workspace/api-client-react";
import { Loader2, User, Mail, Award, MapPin, CheckCircle2, Clock, Users, AlertCircle } from "lucide-react";

const PLANO_LABELS: Record<string, string> = {
  basic: "Basic",
  pro: "Pro",
  premium: "Premium",
};

const PLANO_COLORS: Record<string, string> = {
  basic: "bg-secondary text-secondary-foreground border-border",
  pro: "bg-blue-50 text-blue-700 border-blue-200",
  premium: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Profile() {
  const [selectedEmail, setSelectedEmail] = useState<string>("");

  const { data: usersData, isLoading: isLoadingUsers } = useListUsers();

  const { data: profile, isLoading: isLoadingProfile } = useGetUserByEmail(
    { email: selectedEmail },
    { query: { enabled: !!selectedEmail } }
  );

  const users = usersData?.users ?? [];

  return (
    <div className="flex-1 w-full bg-muted/30">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-extrabold text-foreground tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground mt-1 font-medium">Acompanhe seu monitoramento de convocações</p>
        </div>

        {/* Email selector (simulated login) */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
          <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Selecionar conta
          </label>
          {isLoadingUsers ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Carregando usuários...</span>
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground font-medium">
              Nenhum usuário cadastrado. Acesse a aba "Monitorei" para se cadastrar.
            </p>
          ) : (
            <select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            >
              <option value="">Selecione seu e-mail...</option>
              {users.map((u) => (
                <option key={u.id} value={u.email}>
                  {u.nome} — {u.email}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Profile content */}
        {!selectedEmail ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <User className="w-8 h-8" />
            </div>
            <p className="font-bold text-foreground text-lg mb-1">Selecione sua conta</p>
            <p className="text-muted-foreground font-medium text-sm">Escolha seu e-mail no menu acima para ver o perfil.</p>
          </div>
        ) : isLoadingProfile ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Carregando perfil...</p>
          </div>
        ) : !profile ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="font-bold text-foreground">Perfil não encontrado</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-5">
                Informações do Usuário
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Nome</p>
                    <p className="font-bold text-foreground">{profile.nome}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">E-mail</p>
                    <p className="font-bold text-foreground break-all">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Plano</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border ${PLANO_COLORS[profile.plano] ?? PLANO_COLORS.basic}`}>
                      {PLANO_LABELS[profile.plano] ?? profile.plano}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monitoramento */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-5">
                Monitoramento
              </h2>
              {profile.concurso ? (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Concurso</p>
                      <p className="font-bold text-foreground">{profile.concurso.nome}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Cidade</p>
                      <p className="font-bold text-foreground">{profile.concurso.cidade}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Status</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-success/15 text-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                        {profile.status === "ativo" ? "Ativo" : profile.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground font-medium text-sm">Nenhum concurso vinculado.</p>
              )}
            </div>

            {/* Convocações */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-5">
                Convocações
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Status pessoal */}
                <div className={`rounded-xl p-5 border ${profile.convocado ? "bg-success/10 border-success/30" : "bg-muted/50 border-border"}`}>
                  {profile.convocado ? (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-success text-base">Seu nome já foi convocado!</p>
                        <p className="text-sm text-success/80 font-medium mt-1">
                          Seu nome apareceu nas publicações do Diário Oficial.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <Clock className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-foreground text-base">Aguardando convocação</p>
                        <p className="text-sm text-muted-foreground font-medium mt-1">
                          Seu nome ainda não apareceu nas convocações.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total convocados */}
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/20 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total convocados</p>
                    <p className="font-display font-extrabold text-foreground text-3xl">{profile.totalConvocados}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">pessoas neste concurso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
