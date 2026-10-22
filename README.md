# NexoHub — Backoffice

Retaguarda do nexo365 (ERP & PDV): tenants, usuários dos tenants, equipe interna, auditoria, faturamento, licenças e gastos.

## Rodar

```bash
npm install
npm run dev        # http://localhost:8081
npm test           # testes (inclui o contrato contra o modo demonstração)
npm run build
```

## Backend

Sem `VITE_API_URL` o app roda em **modo demonstração**: o servidor de `src/api/demo.ts` responde às rotas e guarda os dados no navegador. Qualquer senha entra; o e-mail de um colaborador (ex.: `rafael@nexohub.com`, superadmin, ou `camila@nexohub.com`, suporte) entra como ele.

Para usar um backend real, copie `.env.example` para `.env.local` e preencha `VITE_API_URL`, ou abra o app com `?api=https://endereco-do-backend` (e `?api=demo` para voltar).

### Os dois apps num link só (ngrok)

O backoffice pode ser publicado em `/admin/`, atrás do ERP. No Git Bash, use `MSYS_NO_PATHCONV=1` antes dos comandos com `BASE_PATH`.

```bash
# backoffice (nesta pasta)
BASE_PATH=/admin/ npm run build
BASE_PATH=/admin/ npx vite preview --port 4174
# ERP (na pasta do ProjectFront-ERP)
npm run build
BACKOFFICE_PROXY_TARGET=http://localhost:4174 npx vite preview --port 4173
# túnel
ngrok http 4173
```

O ERP fica na raiz do link e o backoffice em `/admin/`.

O que o backend precisa implementar está em [CONTRATO_API_BACKEND.md](CONTRATO_API_BACKEND.md); `npm run test:contrato` com `CONTRATO_API_URL` confere um backend real.

## Estrutura

- `src/lib/http.ts`: cliente HTTP (endereço da API, token, erros, cabeçalho do ngrok).
- `src/lib/auth.ts`: login, logout e colaborador atual.
- `src/api/recursos.ts`: rotas `/api/admin/*` e hooks do React Query usados pelas telas.
- `src/api/demo.ts`: servidor de demonstração (implementação de referência do contrato).
- `src/pages/`: telas.
