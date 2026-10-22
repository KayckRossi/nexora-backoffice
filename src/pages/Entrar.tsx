import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Hexagon, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ApiError, modoDemonstracao, obterApiUrl } from "@/lib/http";
import { destinoSeguro, entrar } from "@/lib/auth";

export default function Entrar() {
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [manterConectado, setManterConectado] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const demonstracao = modoDemonstracao();

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }
    setCarregando(true);
    setErro("");
    try {
      await entrar(email, senha, manterConectado);
      navegar(destinoSeguro(parametros.get("voltar")), { replace: true });
    } catch (falha) {
      setErro(falha instanceof ApiError && falha.status === 401
        ? "E-mail ou senha incorretos."
        : falha instanceof Error ? falha.message : "Não foi possível entrar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Hexagon className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">NexoHub</h1>
            <p className="text-xs text-muted-foreground mt-1">Backoffice Admin</p>
          </div>
        </div>

        <form onSubmit={aoEnviar} className="glass-card rounded-xl p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErro(""); }}
              placeholder="voce@nexohub.com"
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha" className="text-xs text-muted-foreground">Senha</Label>
            <div className="relative">
              <Input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => { setSenha(e.target.value); setErro(""); }}
                placeholder="••••••••"
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground pr-10"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="manter-conectado"
              checked={manterConectado}
              onChange={(e) => setManterConectado(e.target.checked)}
              className="w-4 h-4 rounded border-input"
            />
            <Label htmlFor="manter-conectado" className="text-xs font-normal text-muted-foreground cursor-pointer">
              Manter conectado
            </Label>
          </div>

          {erro && (
            <p role="alert" className="text-xs text-destructive">{erro}</p>
          )}

          <Button type="submit" disabled={carregando} className="w-full gradient-primary text-primary-foreground border-0">
            {carregando ? "Entrando..." : "Entrar"}
          </Button>

          <p className="text-[10px] text-muted-foreground text-center break-all">
            {demonstracao
              ? "Modo demonstração: qualquer senha entra (ex.: rafael@nexohub.com)"
              : `Servidor: ${obterApiUrl()}`}
          </p>
        </form>
      </div>
    </div>
  );
}
