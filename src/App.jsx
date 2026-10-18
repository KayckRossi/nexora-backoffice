import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PaginaNaoEncontrada from '@/pages/PaginaNaoEncontrada';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import Layout from '@/components/Layout';
import RotaComPermissao, { AcessoNegado } from '@/components/RotaComPermissao';
import { ROTAS_BACKOFFICE } from '@/lib/rotas';

// Páginas carregadas sob demanda para reduzir o bundle inicial
const Login = lazy(() => import('@/pages/Login'));
const EsqueciSenha = lazy(() => import('@/pages/EsqueciSenha'));
const RedefinirSenha = lazy(() => import('@/pages/RedefinirSenha'));

const PAGINAS = {
  '/caixa': lazy(() => import('@/pages/Caixa')),
  '/compras': lazy(() => import('@/pages/Compras')),
  '/fornecedores': lazy(() => import('@/pages/Fornecedores')),
  '/categorias': lazy(() => import('@/pages/Categorias')),
  '/usuarios': lazy(() => import('@/pages/Usuarios')),
  '/auditoria': lazy(() => import('@/pages/Auditoria')),
};

// Abre a primeira tela que o perfil pode usar (o operador de caixa só vê o próprio caixa)
function Inicio() {
  const { pode } = useAuth();
  const primeira = ROTAS_BACKOFFICE.find((rota) => pode(rota.permissao));
  return primeira ? <Navigate to={primeira.caminho} replace /> : <AcessoNegado />;
}

const Carregando = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-onyx">
    <div className="w-8 h-8 border-4 border-graphite border-t-verdigris rounded-full animate-spin"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/forgot-password" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/reset-password" element={<RedefinirSenha />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Inicio />} />
            {ROTAS_BACKOFFICE.map(({ caminho, permissao }) => {
              const Pagina = PAGINAS[caminho];
              return <Route key={caminho} path={caminho} element={<RotaComPermissao permissao={permissao}><Pagina /></RotaComPermissao>} />;
            })}
          </Route>
        </Route>
        <Route path="*" element={<PaginaNaoEncontrada />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
