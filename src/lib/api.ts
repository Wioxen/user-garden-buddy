const API_BASE = "http://localhost:3001/api";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  data_criacao: string;
}

export async function cadastrarUsuario(data: {
  nome: string;
  email: string;
  senha: string;
}): Promise<{ message?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const res = await fetch(`${API_BASE}/usuarios`);
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return res.json();
}
