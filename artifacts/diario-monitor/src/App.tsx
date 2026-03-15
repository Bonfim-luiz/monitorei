import { useState } from "react";
import { Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "./pages/Home";
import Admin from "./pages/Admin";

// Setup React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState<"home" | "admin">("home");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-screen flex flex-col font-sans bg-background">
            <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="font-display font-bold text-2xl tracking-tight flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 12h3l3 -9 5 18 3 -9h5"/></svg>
                  Monitorei
                </div>
                <nav className="flex space-x-2">
                  <button 
                    onClick={() => setActiveTab("home")}
                    className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "home" ? "bg-white text-primary shadow-sm" : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"}`}
                  >
                    Monitorei
                  </button>
                  <button 
                    onClick={() => setActiveTab("admin")}
                    className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "admin" ? "bg-white text-primary shadow-sm" : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"}`}
                  >
                    Administração
                  </button>
                </nav>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col">
              {activeTab === "home" ? <Home /> : <Admin />}
            </main>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
