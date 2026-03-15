import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterUser, useListUsers, useDeleteUser } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle2, AlertCircle, FileSearch, BellRing, 
  Trash2, User, Mail, BookOpen, Loader2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const registerSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  concurso: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: usersData, isLoading: isLoadingUsers } = useListUsers();
  
  const registerMutation = useRegisterUser({
    mutation: {
      onSuccess: () => {
        setIsSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        toast({
          title: "Cadastro realizado!",
          description: "Você será notificado se seu nome aparecer.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro ao cadastrar",
          description: error?.response?.data?.error || "Verifique os dados e tente novamente.",
          variant: "destructive",
        });
      }
    }
  });

  const deleteMutation = useDeleteUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        toast({ title: "Registro removido com sucesso." });
      }
    }
  });

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", concurso: "" }
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate({ data });
  };

  return (
    <div className="flex-1 w-full bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Decorative background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Monitoramento Automático
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-foreground mb-6">
              Não perca sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">convocação</span> oficial.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cadastre-se para monitorarmos o Diário Oficial todos os dias. Avisaremos imediatamente por e-mail caso seu nome seja publicado.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Form Section */}
          <div className="md:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-2xl shadow-xl shadow-black/5 border border-border overflow-hidden"
            >
              <div className="p-1 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2 px-4 py-3">
                  <FileSearch className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Registro de Monitoramento</h2>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center py-8 text-center"
                    >
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6 text-success">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Tudo Certo!</h3>
                      <p className="text-muted-foreground mb-8">
                        Seu nome já está em nossa base. Ficaremos de olho no Diário Oficial para você.
                      </p>
                      <button
                        onClick={() => {
                          setIsSuccess(false);
                          form.reset();
                        }}
                        className="px-6 py-2.5 rounded-xl border-2 border-border font-medium hover:bg-secondary transition-colors"
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
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Nome Completo *
                        </label>
                        <input
                          {...form.register("nome")}
                          className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
                          placeholder="Ex: João Silva Santos"
                        />
                        {form.formState.errors.nome && (
                          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            {form.formState.errors.nome.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          E-mail para Notificação *
                        </label>
                        <input
                          {...form.register("email")}
                          type="email"
                          className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
                          placeholder="Ex: joao@email.com"
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          Concurso / Órgão (Opcional)
                        </label>
                        <input
                          {...form.register("concurso")}
                          className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
                          placeholder="Ex: TJSP 2023, Polícia Civil"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full mt-6 px-6 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Registrando...
                          </>
                        ) : (
                          <>
                            <BellRing className="w-5 h-5" />
                            Ativar Monitoramento
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Users List Section */}
          <div className="md:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card rounded-2xl shadow-lg border border-border h-full flex flex-col"
            >
              <div className="p-5 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Registros Recentes
                </h3>
              </div>
              
              <div className="p-0 flex-1 overflow-y-auto max-h-[500px]">
                {isLoadingUsers ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : !usersData?.users || usersData.users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Nenhum usuário cadastrado ainda.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {usersData.users.map((user) => (
                      <li key={user.id} className="p-4 hover:bg-muted/30 transition-colors group flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{user.nome}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          {user.concurso && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground mt-1.5">
                              {user.concurso}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm("Deseja remover este registro?")) {
                              deleteMutation.mutate({ id: user.id });
                            }
                          }}
                          className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
