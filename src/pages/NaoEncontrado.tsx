import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NaoEncontrado = () => {
  const localizacao = useLocation();

  useEffect(() => {
    console.error("Erro 404: Usuário tentou acessar rota inexistente:", localizacao.pathname);
  }, [localizacao.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Ops! Página não encontrada</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NaoEncontrado;
