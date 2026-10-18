import { useState } from "react";
import { Hexagon, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EntrarProps {
  aoEntrar: () => void;
}

export default function Entrar({ aoEntrar }: EntrarProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");

  const aoEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }
    if (email === "admin@nexohub.com" && senha === "admin123") {
      localStorage.setItem("nexohub_auth", "true");
      aoEntrar();
    } else {
      setErro("Credenciais inválidas");
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
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErro(""); }}
              placeholder="admin@nexohub.com"
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Senha</Label>
            <div className="relative">
              <Input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => { setSenha(e.target.value); setErro(""); }}
                placeholder="••••••••"
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground pr-10"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {erro && (
            <p className="text-xs text-destructive">{erro}</p>
          )}

          <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">
            Entrar
          </Button>

          <p className="text-[10px] text-muted-foreground text-center">
            Use: admin@nexohub.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
