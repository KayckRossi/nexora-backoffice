import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, AlertCircle, Sparkles } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnTo } from "@/lib/safeReturnTo";
import { CREDENCIAIS_DEMO } from "@/api/demo/credenciais";
import { erpConfigurado, linkErp } from "@/lib/links";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo();

  const handlePreencherDemo = (credencial) => {
    setEmail(credencial.email);
    setPassword(credencial.senha);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.login(email, password);
      window.location.href = returnTo;
    } catch (err) {
      setError(err?.status === 401
        ? "E-mail ou senha incorretos. Por favor, verifique seus dados de acesso."
        : err?.message || "Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Bem-vindo de volta"
      subtitle="Acesse a retaguarda: caixa, compras, fornecedores e usuários"
      footer={erpConfigurado && (
        <p className="text-snow/70 text-sm">
          A conta da empresa é criada no{" "}
          <a href={linkErp("/cadastro")} className="text-pearl font-semibold hover:underline ml-0.5">
            ERP & PDV
          </a>
        </p>
      )}
    >
      {/* Credenciais de teste existem apenas no modo demonstração */}
      {authApi.modoDemo && (<>
      <div className="mb-5 p-3.5 rounded-xl bg-onyx/90 border border-pearl/25 text-xs">
        <span className="font-semibold text-pearl flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-pearl" />
          Credenciais de Acesso (Teste)
        </span>
        <div className="space-y-1.5">
          {CREDENCIAIS_DEMO.map((credencial) => (
            <div key={credencial.email} className="flex items-center justify-between gap-2">
              <p className="text-snow/75 min-w-0">
                <span className="text-snow/50">{credencial.perfil}:</span>{" "}
                <span className="font-mono">{credencial.email} / {credencial.senha}</span>
              </p>
              <button
                type="button"
                onClick={() => handlePreencherDemo(credencial)}
                className="shrink-0 text-[11px] text-pearl font-medium hover:underline bg-pearl/15 px-2 py-0.5 rounded-md hover:bg-pearl/25 transition-colors cursor-pointer"
                aria-label={`Usar a conta de ${credencial.perfil}`}
              >
                Usar
              </button>
            </div>
          ))}
        </div>
      </div>
      </>)}

      {/* Alerta de erro */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-danger/15 border border-danger/30 text-snow flex items-start gap-2.5 text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulário de Login */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo E-mail */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-snow/90">
            E-mail corporativo ou pessoal
          </Label>
          <div className="relative group">
            <Mail
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-snow/40 pointer-events-none transition-colors group-focus-within:text-pearl"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-onyx/70 border-snow/15 focus:border-pearl focus:ring-2 focus:ring-pearl/20 text-snow placeholder:text-snow/30 rounded-xl transition-all"
              required
            />
          </div>
        </div>

        {/* Campo Senha */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-snow/90">
              Senha
            </Label>
            <Link
              to="/esqueci-senha"
              className="text-xs text-pearl hover:text-pearl/80 hover:underline transition-colors font-medium"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative group">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-snow/40 pointer-events-none transition-colors group-focus-within:text-pearl"
              aria-hidden="true"
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-11 h-12 bg-onyx/70 border-snow/15 focus:border-pearl focus:ring-2 focus:ring-pearl/20 text-snow placeholder:text-snow/30 rounded-xl transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-snow/40 hover:text-snow transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-pearl cursor-pointer"
              aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-pearl" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Lembrar de mim */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-snow/70 hover:text-snow transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-snow/20 bg-onyx text-verdigris focus:ring-pearl/30 focus:ring-offset-graphite cursor-pointer"
            />
            <span>Lembrar de mim neste dispositivo</span>
          </label>
        </div>

        {/* Botão de Envio */}
        <Button
          type="submit"
          className="w-full h-12 font-semibold text-snow bg-verdigris hover:bg-verdigris-hover rounded-xl shadow-lg shadow-verdigris/25 hover:shadow-verdigris/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2 cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-snow" />
              Acessando sistema...
            </>
          ) : (
            "Acessar Sistema"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
