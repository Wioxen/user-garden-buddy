import { useState } from "react";
import { cadastrarUsuario } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const CadastroForm = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setFeedback({ type: "error", msg: "Todos os campos são obrigatórios." });
      return;
    }

    if (senha.length < 6) {
      setFeedback({ type: "error", msg: "Senha deve ter no mínimo 6 caracteres." });
      return;
    }

    setLoading(true);
    try {
      const res = await cadastrarUsuario({ nome: nome.trim(), email: email.trim(), senha });
      if (res.error) {
        setFeedback({ type: "error", msg: res.error });
      } else {
        setFeedback({ type: "success", msg: res.message || "Cadastrado com sucesso!" });
        setNome("");
        setEmail("");
        setSenha("");
      }
    } catch {
      setFeedback({ type: "error", msg: "Erro ao conectar com o servidor. Verifique se o backend está rodando." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <UserPlus className="h-6 w-6 text-primary" />
          Cadastro de Usuário
        </CardTitle>
        <CardDescription>Preencha os dados para criar um novo cadastro</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={150} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={150} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" placeholder="Mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} maxLength={255} />
          </div>

          {feedback && (
            <div className={`flex items-center gap-2 rounded-md p-3 text-sm ${feedback.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {feedback.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {feedback.msg}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cadastrando...</> : "Cadastrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CadastroForm;
