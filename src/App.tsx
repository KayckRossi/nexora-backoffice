import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LayoutApp from "@/components/LayoutApp";
import { RotaProtegida } from "@/components/RotaProtegida";
import { ApiError } from "@/lib/http";
import PainelPrincipal from "@/pages/PainelPrincipal";
import Inquilinos from "@/pages/Inquilinos";
import PaginaUsuarios from "@/pages/PaginaUsuarios";
import EquipeInterna from "@/pages/EquipeInterna";
import LogAuditoria from "@/pages/LogAuditoria";
import Faturamento from "@/pages/Faturamento";
import Licencas from "@/pages/Licencas";
import Despesas from "@/pages/Despesas";
import Entrar from "@/pages/Entrar";
import NaoEncontrado from "@/pages/NaoEncontrado";

function RolarParaTopo() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const clienteConsulta = new QueryClient({
  defaultOptions: {
    // 401 já leva ao login; repetir só faz sentido para falhas de rede/servidor
    queries: { retry: (falhas, erro) => falhas < 2 && !(erro instanceof ApiError && erro.status < 500 && erro.status > 0), refetchOnWindowFocus: false },
  },
});

const ROTAS = [
  { path: "/", element: <PainelPrincipal /> },
  { path: "/inquilinos", element: <Inquilinos /> },
  { path: "/usuarios", element: <PaginaUsuarios /> },
  { path: "/equipe", element: <EquipeInterna /> },
  { path: "/auditoria", element: <LogAuditoria /> },
  { path: "/faturamento", element: <Faturamento /> },
  { path: "/licencas", element: <Licencas /> },
  { path: "/despesas", element: <Despesas /> },
];

const App = () => (
  <QueryClientProvider client={clienteConsulta}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RolarParaTopo />
        <Routes>
          <Route path="/login" element={<Entrar />} />
          {ROTAS.map(({ path, element }) => (
            <Route key={path} path={path} element={<RotaProtegida><LayoutApp>{element}</LayoutApp></RotaProtegida>} />
          ))}
          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
