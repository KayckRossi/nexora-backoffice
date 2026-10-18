# 🗄️ nexora-backoffice — Nexora Backoffice

Retaguarda do **Nexora ERP & PDV**: caixa, compras e entrada de mercadorias, fornecedores, categorias, usuários e auditoria. É um front-end separado do [ProjectFront-ERP](https://github.com/KayckRossi/ProjectFront-ERP) e usa **a mesma API REST**, então os dois apps enxergam os mesmos dados quando ligados ao backend.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## ✨ Telas

- **Caixa**: histórico de aberturas e fechamentos por operador, com vendas por forma de pagamento, sangrias, suprimentos e diferença (falta/sobra), e reimpressão do relatório de fechamento. O operador de caixa vê e controla só o próprio caixa.
- **Compras e entrada de mercadorias**: pedido ao fornecedor e recebimento, que soma ao estoque, atualiza o custo (com alerta de custo acima do preço) e lança a despesa no Financeiro com vencimento pelo prazo do fornecedor.
- **Fornecedores**: cadastro com CNPJ, contato e prazo de pagamento, com atalho para uma nova compra.
- **Categorias**: cadastro com cor, usada no PDV e nos relatórios do ERP.
- **Usuários e perfis**: administrador, gerente e operador de caixa; desativação (sem apagar o histórico) e envio de redefinição de senha.
- **Auditoria**: quem fez o quê e quando (vendas, cancelamentos, preços, estoque, caixa, compras, usuários).

A operação do dia a dia (PDV, abertura e fechamento de caixa na frente de loja, vendas, produtos, estoque, financeiro, relatórios e configurações) fica no **ERP & PDV**.

### Perfis de acesso
| Perfil | Acesso no backoffice |
|---|---|
| Administrador | Tudo |
| Gerente | Caixa de todos os operadores, compras, fornecedores e categorias |
| Operador de caixa | Só o próprio caixa |

O menu mostra só o que o perfil pode usar, e o backend aplica as mesmas regras (`src/lib/permissoes.js`).

---

## 🚀 Como executar

Pré-requisitos: Node.js 20.19+ ou 22.12+ e npm 10+.

```bash
git clone https://github.com/KayckRossi/nexora-backoffice.git
cd nexora-backoffice
npm install
npm run dev
```

Acesse `http://localhost:5174` (a porta 5174 permite rodar ao lado do ERP, que usa a 5173).

Sem backend configurado, o app roda em **modo demonstração**: um servidor dentro do navegador (`src/api/demo/`) responde às rotas da API com cerca de 6 meses de dados de exemplo. A tela de login mostra um usuário de cada perfil:

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@nexora.com` | `admin123` |
| Gerente | `gerente@nexora.com` | `gerente123` |
| Operador de caixa | `operador@nexora.com` | `operador123` |

> No modo demonstração, cada app guarda os próprios dados no navegador: uma compra recebida aqui não aparece no ERP. Com o backend real, os dois compartilham tudo. Para voltar aos dados iniciais, use **menu do usuário → Restaurar dados de demonstração** (administrador).

### Scripts
- `npm run dev`: ambiente de desenvolvimento.
- `npm run build` / `npm run preview`: build de produção e visualização local.
- `npm run lint` / `npm run lint:fix`: verificação do ESLint.
- `npm test`: testes, incluindo os de contrato contra o servidor de demonstração.
- `npm run test:contrato`: testes de contrato contra um backend real (veja abaixo).

---

## 🔌 Backend e integração com o ERP

O contrato da API está no repositório do ERP: [`CONTRATO_API_BACKEND.md`](https://github.com/KayckRossi/ProjectFront-ERP/blob/main/CONTRATO_API_BACKEND.md). As telas deste app usam principalmente as seções 10 a 15 (perfis, usuários, caixa, fornecedores, compras e auditoria) e a 2.1 (categorias).

Copie `.env.example` para `.env.local` e ajuste:

| Variável | Para que serve |
|---|---|
| `VITE_API_URL` | URL do backend (ex.: `http://localhost:3000`). Vazia = modo demonstração. `/` = mesma origem do front. |
| `API_PROXY_TARGET` | Só em desenvolvimento/preview: com `VITE_API_URL=/`, o Vite encaminha `/api` para este endereço e evita CORS. |
| `VITE_ERP_URL` | Endereço do ERP & PDV (ex.: `http://localhost:5173`). Mostra o atalho "ERP & PDV" no menu e os links para o ERP. Vazia = sem links. |

O backend precisa liberar **CORS** para a origem de cada front (ERP e backoffice) quando eles chamam a API diretamente. O login é feito em cada app; o token fica no navegador, por origem.

Para conferir se o backend segue o contrato (use um banco de testes):

```bash
CONTRATO_API_URL=http://localhost:3000 CONTRATO_EMAIL=admin@empresa.com CONTRATO_SENHA=senha npm run test:contrato
```

`CONTRATO_EMAIL` deve ser de um administrador. Para testar também as permissões, informe um operador em `CONTRATO_EMAIL_OPERADOR` e `CONTRATO_SENHA_OPERADOR`.

Em produção (Vercel/Netlify), defina as variáveis no projeto antes do build.

---

## 📁 Estrutura

```
├── src/
│   ├── api/            # Cliente HTTP, autenticação, hooks por recurso e testes de contrato
│   │   └── demo/       # Servidor de demonstração (cópia do ERP; implementação de referência do contrato)
│   ├── components/     # Layout, modais, cupom/relatório de caixa e componentes de UI
│   ├── hooks/          # Paginação, Esc para fechar, valor atrasado
│   ├── lib/            # Auth, tema, permissões, rotas, links para o ERP, datas, dinheiro e máscaras
│   ├── pages/          # Caixa, Compras, Fornecedores, Categorias, Usuários, Auditoria e login
│   └── App.jsx         # Roteamento
├── index.html
├── package.json
└── vite.config.js
```

---

## 📄 Licença

Este projeto é de uso privado e de propriedade de **Kayck Rossi**.
