import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { aplicarApiDaUrl, definirAoExpirarSessao } from "./lib/http";
import "./index.css";

// ?api=https://... na URL troca o backend sem precisar de novo build
aplicarApiDaUrl();

// Token recusado pelo backend (401): volta para o login lembrando a página atual
// (com BASE_PATH, os caminhos do app ficam abaixo de import.meta.env.BASE_URL)
definirAoExpirarSessao(() => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const caminho = window.location.pathname.slice(base.length) || "/";
  if (caminho === "/login") return;
  const voltar = encodeURIComponent(caminho + window.location.search);
  window.location.replace(`${base}/login?voltar=${voltar}`);
});

createRoot(document.getElementById("root")!).render(<App />);
