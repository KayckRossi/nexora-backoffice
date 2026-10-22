import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Building2,
  Users,
  ScrollText,
  Receipt,
  Hexagon,
  Shield,
  CreditCard,
  Wallet,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { sair, useUsuarioAtual } from "@/lib/auth";

const itensNavegacao = [
  { para: "/", icone: LayoutDashboard, rotulo: "Dashboard" },
  { para: "/inquilinos", icone: Building2, rotulo: "Tenants" },
  { para: "/usuarios", icone: Users, rotulo: "Usuários Tenant" },
  { para: "/equipe", icone: Shield, rotulo: "Equipe Interna" },
  { para: "/auditoria", icone: ScrollText, rotulo: "Log Auditoria" },
  { para: "/faturamento", icone: Receipt, rotulo: "Faturamento" },
  { para: "/licencas", icone: CreditCard, rotulo: "Licenças" },
  { para: "/despesas", icone: Wallet, rotulo: "Gastos" },
];

const rotulosPapel: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  suporte: "Suporte",
  financeiro: "Financeiro",
};

export default function BarraLateral() {
  const [sobMouse, setSobMouse] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const localizacao = useLocation();
  const navegar = useNavigate();
  const clienteConsulta = useQueryClient();
  const { data: usuario } = useUsuarioAtual();
  const eMobile = useIsMobile();

  const aoSair = async () => {
    await sair(clienteConsulta);
    navegar("/login", { replace: true });
  };

  const iniciais = (usuario?.nome ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const identificacao = (comTexto: boolean) => (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-foreground">{iniciais}</span>
      </div>
      {comTexto && (
        <div className="min-w-0 overflow-hidden whitespace-nowrap">
          <p className="text-sm font-medium text-foreground truncate">{usuario?.nome ?? "..."}</p>
          <p className="text-[10px] text-muted-foreground truncate">{usuario ? rotulosPapel[usuario.papel] ?? usuario.papel : ""}</p>
        </div>
      )}
    </div>
  );

  if (eMobile) {
    return (
      <>
        <button
          onClick={() => setMenuMobileAberto(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar border border-sidebar-border text-foreground shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {menuMobileAberto && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setMenuMobileAberto(false)}
            />
            <aside className="fixed left-0 top-0 h-screen w-[260px] bg-sidebar border-r border-sidebar-border flex flex-col z-50 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Hexagon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-foreground tracking-tight">NexoHub</h1>
                    <p className="text-[10px] text-muted-foreground">Backoffice Admin</p>
                  </div>
                </div>
                <button onClick={() => setMenuMobileAberto(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {itensNavegacao.map((item) => {
                  const eAtivo = localizacao.pathname === item.para;
                  return (
                    <NavLink
                      key={item.para}
                      to={item.para}
                      onClick={() => setMenuMobileAberto(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        eAtivo
                          ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <item.icone className="w-4 h-4 flex-shrink-0" />
                      <span>{item.rotulo}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="px-3 pb-4 space-y-1">
                {identificacao(true)}
                <button
                  onClick={aoSair}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span>Sair</span>
                </button>
              </div>
            </aside>
          </>
        )}
      </>
    );
  }

  const expandido = sobMouse;

  return (
    <aside
      onMouseEnter={() => setSobMouse(true)}
      onMouseLeave={() => setSobMouse(false)}
      style={{ width: expandido ? 260 : 72 }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-all duration-200 ease-in-out"
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <Hexagon className="w-4 h-4 text-primary-foreground" />
        </div>
        {expandido && (
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="text-sm font-bold text-foreground tracking-tight">NexoHub</h1>
            <p className="text-[10px] text-muted-foreground">Backoffice Admin</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {itensNavegacao.map((item) => {
          const eAtivo = localizacao.pathname === item.para;
          return (
            <NavLink
              key={item.para}
              to={item.para}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                eAtivo
                  ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icone className="w-4 h-4 flex-shrink-0" />
              {expandido && <span className="whitespace-nowrap">{item.rotulo}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-1">
        {identificacao(expandido)}
        <button
          onClick={aoSair}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {expandido && <span className="whitespace-nowrap">Sair</span>}
        </button>
      </div>
    </aside>
  );
}
