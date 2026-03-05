import { useState } from "react";
import CadastroForm from "@/components/CadastroForm";
import UsuariosLista from "@/components/UsuariosLista";
import { Database } from "lucide-react";

const Index = () => {
  const [tab, setTab] = useState<"cadastro" | "lista">("cadastro");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Sistema de Cadastro</h1>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">MySQL</span>
          </div>
          <nav className="flex gap-1">
            <button
              onClick={() => setTab("cadastro")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === "cadastro" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
            >
              Cadastro
            </button>
            <button
              onClick={() => setTab("lista")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === "lista" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
            >
              Listagem
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto flex justify-center px-4 py-10">
        {tab === "cadastro" ? <CadastroForm /> : <UsuariosLista />}
      </main>

      {/* Footer info */}
      <footer className="fixed bottom-0 inset-x-0 border-t bg-background px-4 py-2">
        <p className="text-center text-xs text-muted-foreground">
          Backend: <code className="rounded bg-muted px-1">cd server && npm install && npm start</code> → API em <code className="rounded bg-muted px-1">http://localhost:3001</code>
        </p>
      </footer>
    </div>
  );
};

export default Index;
