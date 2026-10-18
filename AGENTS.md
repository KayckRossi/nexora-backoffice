# AGENTS.md

## Project Context

Nexora Backoffice — front-end da retaguarda do Nexora ERP & PDV, em React + Vite + Tailwind. O ERP & PDV fica em outro repositório (`KayckRossi/ProjectFront-ERP`), e os dois usam a mesma API. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions (código e textos em português).

Start with `README.md` for local setup and environment variables.

## Key Files

- `src/lib/rotas.js`: telas do backoffice, com rótulo, ícone, grupo do menu e permissão. `App.jsx` e `Sidebar` usam esta lista.
- `src/lib/links.js`: links para o ERP (`VITE_ERP_URL`); sem a variável, eles não aparecem.
- `src/api/http.js`: cliente HTTP (`VITE_API_URL`, token Bearer, aviso de sessão expirada). Sem `VITE_API_URL`, encaminha as chamadas para o servidor de demonstração.
- `src/api/*.js`: hooks do TanStack Query por recurso. As telas não chamam `fetch` diretamente.
- `src/api/demo/` e `src/lib/permissoes.js`: **cópias** do ERP. A fonte da verdade do contrato é o `CONTRATO_API_BACKEND.md` do ProjectFront-ERP, junto com o servidor de demonstração de lá.
- `src/api/contrato.test.js`: testes do contrato (rodam contra o servidor de demonstração ou contra o backend real).
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- `npm run dev` inicia o front-end na porta 5174; sem backend configurado o app roda em modo demonstração.
- Ao mudar o contrato da API, mude primeiro no ProjectFront-ERP (`CONTRATO_API_BACKEND.md`, `src/api/demo/` e `src/api/contrato.test.js`) e copie `src/api/demo/`, `src/lib/permissoes.js` e `src/api/contrato.test.js` para cá.
- Telas novas: registre em `src/lib/rotas.js` e a página em `PAGINAS` (`src/App.jsx`).
- `src/lib/datas.js`, `dinheiro.js`, `texto.js`, `mascaras.js`, `estoque.js` e `permissoes.js` usam só imports relativos, porque também rodam no servidor de demonstração e nos testes em Node.
- Run `npm run lint`, `npm test` and `npm run build` before finishing code changes.
