import { useState } from "react";
import { useListUsers, useGetUserByEmail } from "@workspace/api-client-react";
import {
  Loader2, User, Mail, Award, MapPin, CheckCircle2, Clock,
  Users, AlertCircle, ChevronDown
} from "lucide-react";

type SubTab = "perfil" | "monitoramento";

const PLANO_LABELS: Record<string, string> = { basic: "Basic", pro: "Pro", premium: "Premium" };
const PLANO_COLORS: Record<string, string> = {
  basic: "bg-secondary text-secondary-foreground border-border",
  pro: "bg-blue-50 text-blue-700 border-blue-200",
  premium: "bg-amber-50 text-amber-700 border-amber-200",
};
const FREQ_LABELS: Record<string, string> = { semanal: "Semanal", mensal: "Mensal" };

export default function Profile() {
  const [selectedEmail, setSelectedEmail] = useState("");
  const [subTab, setSubTab] = useState<SubTab>("perfil");
  const [selectedConcursoId, setSelectedConcursoId] = useState<number | null>(null);

  const { data: usersData, isLoading: isLoadingUsers } = useListUsers();
  const { data: profile, isLoading: isLoadingProfile } = useGetUserByEmail(
    { email: selectedEmail },
    { query: { enabled: !!selectedEmail } }
  );

  const users = usersData?.users ?? [];
  const concursos = profile?.concursos ?? [];

  const activeConcursoId = selectedConcursoId ?? concursos[0]?.id ?? null;
  const activeConcurso = concursos.find((c) => c.id === activeConcursoId) ?? concursos[0] ?? null;

  const handleEmailChange = (email: string) => {
    setSelectedEmail(email);
    setSelectedConcursoId(null);
    setSubTab("perfil");
  };

  return (
    <div className="flex-1 w-full bg-muted/30">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-extrabold text-foreground tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground mt-1 font-medium">Acompanhe seu monitoramento de convocações</p>
        </div>

        {/* Email selector */}
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
            <div className="relative">
              <select
                value={selectedEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none pr-10"
              >
                <option value="">Selecione seu e-mail...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.email}>
                    {u.nome} — {u.email}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          )}
        </div>

        {!selectedEmail ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-14 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <User className="w-8 h-8" />
            </div>
            <p className="font-bold text-foreground text-lg mb-1">Selecione sua conta</p>
            <p className="text-muted-foreground font-medium text-sm">Escolha seu e-mail no menu acima para ver o perfil.</p>
          </div>
        ) : isLoadingProfile ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-14 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Carregando perfil...</p>
          </div>
        ) : !profile ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-14 text-center">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="font-bold text-foreground">Perfil não encontrado</p>
          </div>
        ) : (
          <>
            {/* Sub-tabs */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="border-b border-border flex">
                {(["perfil", "monitoramento"] as SubTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSubTab(tab)}
                    className={`flex-1 py-4 text-sm font-bold transition-all
                      ${subTab === tab
                        ? "border-b-2 border-primary text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  >
                    {tab === "perfil" ? "Perfil" : "Meu Monitoramento"}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {/* ── SUBTAB: PERFIL ── */}
                {subTab === "perfil" && (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <InfoItem icon={User} label="Nome" value={profile.nome} />
                      <InfoItem icon={Mail} label="E-mail" value={profile.email} />
                      <InfoItem
                        icon={Award}
                        label="Plano"
                        value={
                          <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border ${PLANO_COLORS[profile.plano] ?? PLANO_COLORS.basic}`}>
                            {PLANO_LABELS[profile.plano] ?? profile.plano}
                          </span>
                        }
                      />
                      <InfoItem
                        icon={Clock}
                        label="Frequência"
                        value={FREQ_LABELS[profile.frequencia] ?? profile.frequencia}
                      />
                      {profile.cidadeNome && (
                        <InfoItem icon={MapPin} label="Cidade" value={profile.cidadeNome} />
                      )}
                      <InfoItem
                        icon={CheckCircle2}
                        label="Status"
                        value={
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-success/15 text-success">
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                            Ativo
                          </span>
                        }
                      />
                    </div>
                  </div>
                )}

                {/* ── SUBTAB: MEU MONITORAMENTO ── */}
                {subTab === "monitoramento" && (
                  <div className="space-y-6">
                    {concursos.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground font-medium">Nenhum concurso monitorado.</p>
                      </div>
                    ) : (
                      <>
                        {/* Concurso selector (shows only when more than 1) */}
                        {concursos.length > 1 && (
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground flex items-center gap-2">
                              <Award className="w-4 h-4 text-primary" />
                              Concurso monitorado
                            </label>
                            <div className="relative">
                              <select
                                value={activeConcursoId ?? ""}
                                onChange={(e) => setSelectedConcursoId(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary appearance-none pr-10"
                              >
                                {concursos.map((c) => (
                                  <option key={c.id} value={c.id}>{c.nome}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                          </div>
                        )}

                        {activeConcurso && (
                          <div className="space-y-4">
                            {/* Concurso info */}
                            <div className="bg-muted/50 rounded-xl p-5 border border-border flex items-center gap-4">
                              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                <Award className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{activeConcurso.nome}</p>
                                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {activeConcurso.cidade}
                                </p>
                              </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid sm:grid-cols-2 gap-4">
                              {/* Convocação status */}
                              <div className={`rounded-xl p-5 border ${activeConcurso.convocado ? "bg-success/10 border-success/30" : "bg-muted/40 border-border"}`}>
                                {activeConcurso.convocado ? (
                                  <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-extrabold text-success text-base">Você foi convocado!</p>
                                      <p className="text-sm text-success/80 font-medium mt-1">
                                        Seu nome apareceu nas publicações do Diário Oficial.
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start gap-3">
                                    <Clock className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-extrabold text-foreground text-base">Ainda não foi convocado</p>
                                      <p className="text-sm text-muted-foreground font-medium mt-1">
                                        Continue monitorando. Você será avisado por e-mail.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Stats */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 text-center">
                                  <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                                  <p className="font-display font-extrabold text-foreground text-2xl">{activeConcurso.totalConvocados}</p>
                                  <p className="text-xs text-muted-foreground font-medium mt-0.5">convocados</p>
                                </div>
                                <div className="bg-muted/50 rounded-xl p-4 border border-border text-center">
                                  <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                                  <p className="font-display font-extrabold text-foreground text-sm leading-tight">
                                    {activeConcurso.ultimaConvocacao
                                      ? new Date(activeConcurso.ultimaConvocacao + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
                                      : "—"}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-medium mt-0.5">última convocação</p>
                                </div>
                              </div>
                            </div>

                            {/* All monitored concursos summary */}
                            {concursos.length > 1 && (
                              <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Todos os concursos monitorados</p>
                                <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                                  {concursos.map((c) => (
                                    <div
                                      key={c.id}
                                      onClick={() => setSelectedConcursoId(c.id)}
                                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
                                        ${c.id === activeConcursoId ? "bg-primary/5" : "hover:bg-muted/50"}`}
                                    >
                                      <div>
                                        <p className="text-sm font-bold text-foreground">{c.nome}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{c.totalConvocados} convocados</p>
                                      </div>
                                      {c.convocado ? (
                                        <span className="text-xs font-extrabold text-success flex items-center gap-1">
                                          <CheckCircle2 className="w-3.5 h-3.5" /> Convocado
                                        </span>
                                      ) : (
                                        <span className="text-xs font-medium text-muted-foreground">Aguardando</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border">
      <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <div className="font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}
