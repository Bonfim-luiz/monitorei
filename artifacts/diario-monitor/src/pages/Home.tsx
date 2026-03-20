import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterUser, useListCidades, useListConcursos } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2, AlertCircle, BellRing, User, Mail, Loader2,
  Award, MapPin, BookOpen, Clock, Zap, Star, Shield
} from "lucide-react";

const registerSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  plano: z.enum(["basic", "pro", "premium"]).default("basic"),
  cidadeId: z.number().default(1),
  concursoId: z.number().min(1, "Selecione um concurso"),
  frequencia: z.enum(["semanal", "mensal"]).default("semanal"),
});
type RegisterForm = z.infer<typeof registerSchema>;

const PLANS = [
  {
    id: "basic" as const,
    name: "Basic",
    price: "19,90",
    icon: BookOpen,
    color: "border-border",
    selectedColor: "border-primary bg-primary/5",
    badgeColor: "bg-secondary text-secondary-foreground",
    features: ["1 concurso monitorado", "Alertas semanais", "Notificação por e-mail"],
    notIncluded: ["Múltiplos concursos", "Alertas mensais", "Métricas (em breve)"],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "29,90",
    icon: Zap,
    color: "border-border",
    selectedColor: "border-blue-500 bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-700",
    features: ["Até 3 concursos", "Alertas semanais", "Notificação por e-mail"],
    notIncluded: ["Alertas mensais", "Métricas (em breve)"],
    popular: true,
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: "49,90",
    icon: Star,
    color: "border-border",
    selectedColor: "border-amber-500 bg-amber-50",
    badgeColor: "bg-amber-100 text-amber-700",
    features: ["Concursos ilimitados", "Alertas semanais + mensais", "Notificação por e-mail", "Métricas (em breve)"],
    notIncluded: [],
  },
];

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "premium">("basic");

  const { data: cidadesData } = useListCidades();
  const { data: concursosData } = useListConcursos();

  const cidades = cidadesData?.cidades ?? [];
  const concursos = concursosData?.concursos ?? [];

  const registerMutation = useRegisterUser({
    mutation: {
      onSuccess: () => {
        setIsSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.error;
        toast({
          title: "Erro ao cadastrar",
          description: error?.response?.status === 409
            ? "Este email já está cadastrado."
            : errorMsg || "Verifique os dados e tente novamente.",
          variant: "destructive",
        });
      },
    },
  });

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", plano: "basic", cidadeId: 1, concursoId: 0, frequencia: "semanal" },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate({
      data: {
        nome: data.nome,
        email: data.email,
        plano: data.plano,
        cidadeId: data.cidadeId,
        concursoIds: [data.concursoId],
        frequencia: data.frequencia,
      } as any,
    });
  };

  const handleSelectPlan = (planId: "basic" | "pro" | "premium") => {
    setSelectedPlan(planId);
    form.setValue("plano", planId);
    const el = document.getElementById("signup-form");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex-1 w-full bg-background">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.07]"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-sm font-bold tracking-wide uppercase mb-8 border border-white/20">
              <Shield className="w-4 h-4" />
              Guarujá — SP
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.05] mb-6">
              Monitorei
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/85 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
              Nunca perca sua convocação no Diário Oficial
            </p>
            <button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-2xl shadow-black/20 hover:shadow-3xl hover:-translate-y-1 transition-all duration-200 text-lg"
            >
              <BellRing className="w-5 h-5" />
              Começar monitoramento
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── PROBLEM + SOLUTION ── */}
      <section className="bg-muted/40 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-destructive/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-bold text-destructive text-lg">O Problema</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                Após passar em um concurso público, você precisa verificar o Diário Oficial <strong>todos os dias</strong> para não perder sua convocação. Essa leitura manual é exaustiva, demorada e sujeita a falhas — e uma convocação perdida significa perder a vaga definitivamente.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-success/5 border border-success/20 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-success/10 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-bold text-success text-lg">A Solução</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                O Monitorei acompanha o Diário Oficial por você automaticamente. Quando seu nome é publicado, você recebe um <strong>alerta por e-mail imediatamente</strong>. Simples, confiável e sem esforço — para que você nunca perca uma oportunidade.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-3">Escolha seu plano</h2>
            <p className="text-muted-foreground font-medium text-lg">Preço anual. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-7 transition-all duration-200 bg-card shadow-sm
                    ${isSelected ? plan.selectedColor + " shadow-md" : "border-border hover:border-primary/40"}
                    ${plan.popular ? "ring-2 ring-blue-400 ring-offset-2" : ""}
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-md tracking-wide uppercase">
                        Mais popular
                      </span>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2 rounded-xl ${plan.badgeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md ${plan.badgeColor}`}>{plan.name}</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-muted-foreground">R$</span>
                      <span className="text-4xl font-display font-extrabold text-foreground">{plan.price}</span>
                      <span className="text-sm font-bold text-muted-foreground">/ano</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-medium text-muted-foreground/60">
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/20 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan.id); }}
                    className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all
                      ${isSelected
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                  >
                    {isSelected ? "✓ Selecionado" : "Selecionar"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SIGNUP FORM ── */}
      <section id="signup-form" className="bg-muted/40 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-extrabold text-foreground mb-2">
              Criar conta — Plano{" "}
              <span className="text-primary">{PLANS.find((p) => p.id === selectedPlan)?.name}</span>
            </h2>
            <p className="text-muted-foreground font-medium">Cadastre-se e comece a monitorar agora.</p>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center mb-6 text-success">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Cadastro realizado!</h3>
                  <p className="text-muted-foreground mb-8 font-medium">Em breve você receberá notificações quando seu nome aparecer.</p>
                  <button
                    onClick={() => { setIsSuccess(false); form.reset(); }}
                    className="px-8 py-3.5 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Cadastrar outra pessoa
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Nome */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Nome Completo
                    </label>
                    <input
                      {...form.register("nome")}
                      className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                      placeholder="João da Silva"
                    />
                    {form.formState.errors.nome && (
                      <p className="text-sm text-destructive flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" /> {form.formState.errors.nome.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" /> E-mail
                    </label>
                    <input
                      {...form.register("email")}
                      type="email"
                      className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                      placeholder="joao@exemplo.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" /> {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Cidade */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> Cidade
                      </label>
                      <select
                        {...form.register("cidadeId", { valueAsNumber: true })}
                        className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      >
                        {cidades.map((c) => (
                          <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                        {cidades.length === 0 && <option value={1}>Guarujá</option>}
                      </select>
                    </div>

                    {/* Concurso */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" /> Concurso
                      </label>
                      <select
                        {...form.register("concursoId", { valueAsNumber: true })}
                        className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      >
                        <option value={0}>Selecione...</option>
                        {concursos.map((c) => (
                          <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                      </select>
                      {form.formState.errors.concursoId && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 font-bold">
                          <AlertCircle className="w-3.5 h-3.5" /> {form.formState.errors.concursoId.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Frequência */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Frequência de Alertas
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["semanal", "mensal"] as const).map((freq) => (
                        <label
                          key={freq}
                          className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all
                            ${form.watch("frequencia") === freq
                              ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                              : "border-border hover:bg-muted text-muted-foreground font-semibold"}`}
                        >
                          <input type="radio" value={freq} {...form.register("frequencia")} className="sr-only" />
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Plano selecionado */}
                  <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3 border border-border">
                    <Award className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      Plano selecionado: <strong>{PLANS.find((p) => p.id === selectedPlan)?.name}</strong> — R$ {PLANS.find((p) => p.id === selectedPlan)?.price}/ano
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full mt-2 px-6 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2.5 text-lg"
                  >
                    {registerMutation.isPending ? (
                      <><Loader2 className="w-6 h-6 animate-spin" /> Processando...</>
                    ) : (
                      <><BellRing className="w-6 h-6" /> Começar monitoramento</>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
