import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { FileText, ShieldCheck, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        >
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none tracking-tight text-foreground">
              GovMonitor
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
              Diário Oficial
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link 
            href="/" 
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
              location === "/" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Cadastro</span>
          </Link>
          <Link 
            href="/admin" 
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
              location.startsWith("/admin") 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Administração</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
