import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterUser } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2, AlertCircle, BellRing,
  User, Mail, Loader2, Award
} from "lucide-react";

const registerSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  plano: z.enum(["basic", "pro", "premium"]).default("basic"),
});

type RegisterForm = z.infer<typeof registerSchema>;

const PLANO_OPTIONS = [
  { value: "basic", label: "Basic — 1 concurso" },
  { value: "pro", label: "Pro — até 3 concursos" },
  { value: "premium", label: "Premium — ilimitado" },
];

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

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
          description:
            error?.response?.status === 409
              ? "Este email já está cadastrado."
              : errorMsg || "Verifique os dados e tente novamente.",
          variant: "destructive",
        });
      },
    },
  });

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", plano: "basic" },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate({ data: data as any });
  };

  return (
    <div className="flex-1 w-full bg-background relative flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none -z-10 blur-3xl"></div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 max-w-6xl flex-1 flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase mb-6">
                Guarujá - SP
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.1]">
                Monitorei
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mt-5 font-medium leading-relaxed max-w-lg">
                Receba um alerta quando seu nome aparecer no Diário Oficial.
              </p>
            </div>

            <div className="space-y-6 max-w-lg">
              <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
                <h3 className="font-bold text-destructive flex items-center gap-2 text-lg mb-3">
                  <AlertCircle className="w-5 h-5" />
                  O Problema
                </h3>
                <p className="text-foreground/80 leading-relaxed font-medium">
                  Muitas pessoas passam em concursos públicos mas perdem sua convocação porque não conseguem verificar o Diário Oficial todos os dias.
                </p>
              </div>

              <div className="bg-success/5 border border-success/20 rounded-2xl p-6">
                <h3 className="font-bold text-success flex items-center gap-2 text-lg mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                  A Solução
                </h3>
                <p className="text-foreground/80 leading-relaxed font-medium">
                  Monitorei verifica o Diário Oficial por você e envia um e-mail imediatamente quando seu nome for publicado. Simples, rápido e automático.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-[2rem] shadow-2xl shadow-primary/5 border border-border overflow-hidden flex flex-col max-w-md mx-auto w-full"
          >
            <div className="bg-primary p-8 md:p-10 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <h2 className="relative z-10 text-primary-foreground/90 uppercase tracking-wider text-sm font-bold mb-3">Plano Anual</h2>
              <div className="flex items-center justify-center gap-1 font-display relative z-10">
                <span className="text-2xl font-bold opacity-80 mt-2">R$</span>
                <span className="text-6xl font-extrabold tracking-tighter">19,99</span>
                <span className="text-xl font-bold opacity-80 mt-auto mb-2">/ano</span>
              </div>
              <p className="mt-5 text-primary-foreground/90 font-medium text-sm max-w-[280px] mx-auto leading-relaxed relative z-10">
                Monitoramos seu nome diariamente e enviamos um alerta caso você seja convocado.
              </p>
            </div>

            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-6 text-center"
                  >
                    <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center mb-6 text-success">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Cadastro realizado!</h3>
                    <p className="text-muted-foreground mb-8 text-lg font-medium">
                      Em breve você receberá notificações.
                    </p>
                    <button
                      onClick={() => { setIsSuccess(false); form.reset(); }}
                      className="w-full px-6 py-4 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      Cadastrar outra pessoa
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    {/* Nome */}
                    <div className="space-y-2.5">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Nome Completo
                      </label>
                      <input
                        {...form.register("nome")}
                        className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                        placeholder="João da Silva"
                      />
                      {form.formState.errors.nome && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 font-bold mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {form.formState.errors.nome.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2.5">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        E-mail
                      </label>
                      <input
                        {...form.register("email")}
                        type="email"
                        className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                        placeholder="joao@exemplo.com"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 font-bold mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Plano */}
                    <div className="space-y-2.5">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Plano
                      </label>
                      <select
                        {...form.register("plano")}
                        className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      >
                        {PLANO_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      {form.formState.errors.plano && (
                        <p className="text-sm text-destructive flex items-center gap-1.5 font-bold mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {form.formState.errors.plano.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="w-full mt-8 px-6 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2.5 text-lg"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <BellRing className="w-6 h-6" />
                          Começar monitoramento
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
