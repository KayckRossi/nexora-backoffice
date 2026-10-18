import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

function RolarParaTopo() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LayoutApp from "@/components/LayoutApp";
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

const clienteConsulta = new QueryClient();

const App = () => {
  const [estaAutenticado, setEstaAutenticado] = useState(
    () => localStorage.getItem("nexohub_auth") === "true"
  );

  if (!estaAutenticado) {
    return (
      <QueryClientProvider client={clienteConsulta}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Entrar aoEntrar={() => setEstaAutenticado(true)} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const aoSair = () => {
    localStorage.removeItem("nexohub_auth");
    setEstaAutenticado(false);
  };

  return (
    <QueryClientProvider client={clienteConsulta}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RolarParaTopo />
          <LayoutApp aoSair={aoSair}>
            <Routes>
              <Route path="/" element={<PainelPrincipal />} />
              <Route path="/inquilinos" element={<Inquilinos />} />
              <Route path="/usuarios" element={<PaginaUsuarios />} />
              <Route path="/equipe" element={<EquipeInterna />} />
              <Route path="/auditoria" element={<LogAuditoria />} />
              <Route path="/faturamento" element={<Faturamento />} />
              <Route path="/licencas" element={<Licencas />} />
              <Route path="/despesas" element={<Despesas />} />
              <Route path="*" element={<NaoEncontrado />} />
            </Routes>
          </LayoutApp>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
