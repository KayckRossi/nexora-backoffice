# Contrato da API — NexoHub Backoffice

Este documento descreve o que o backoffice (`nexora-backoffice`) espera do backend. As rotas ficam em `/api/admin/...`, separadas das rotas do ERP (`/api/...`, descritas no `CONTRATO_API_BACKEND.md` do `ProjectFront-ERP`). O servidor de demonstração em `src/api/demo.ts` implementa exatamente estas rotas e regras e serve de referência executável; `npm run test:contrato` confere um backend real contra ele (veja o fim do documento).

## 1. Convenções

As mesmas do ERP:

- **Base:** o front chama `{VITE_API_URL}/api/admin/...`.
- **Formato:** JSON, UTF-8, campos em **camelCase** como nos tipos de `src/data/tipos.ts`.
- **Datas:** strings ISO 8601. Datas só com o dia (`criadoEm`) podem vir como `2026-10-18`.
- **Ids:** string, gerada pelo backend. No `POST` o front **não** envia `id`.
- **Dinheiro:** número em reais com até 2 casas.
- **Respostas:** `GET` lista → `200` com um array (sem envelope); `POST`/`PATCH` → `200`/`201` com o registro completo.
- **Erros:** status HTTP adequado e corpo `{ "message": "texto para o usuário" }`, que o front mostra num aviso.
  - `422` validação · `401` não autenticado/token inválido · `403` sem permissão · `404` não encontrado · `409` conflito ou regra de negócio.

## 2. Autenticação

Quem entra no backoffice é um colaborador da **equipe interna** (`UsuarioInterno`), não um usuário de tenant. Token **Bearer** em todas as rotas, exceto o login. Qualquer `401` faz o front apagar o token e voltar para o login.

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| POST | `/api/admin/auth/login` | `{ "email": string, "password": string }` | `200 { "access_token": string, "user": UsuarioInterno }` · `401` credenciais inválidas ou colaborador suspenso |
| GET | `/api/admin/auth/me` | — | `200 UsuarioInterno` |
| POST | `/api/admin/auth/logout` | — | `204` (opcional: invalidar o token) |

O login atualiza `ultimoLogin`. O usuário nunca inclui a senha.

## 3. Recursos

| Método | Rota | Corpo | Observação |
|---|---|---|---|
| GET | `/api/admin/planos` | — | só leitura |
| GET · POST | `/api/admin/inquilinos` | `{ nome, cnpj?, emailContato, telefoneContato?, planoId }` | |
| PATCH | `/api/admin/inquilinos/:id` | `{ status: "ativo" \| "suspenso" }` | |
| GET · POST | `/api/admin/usuarios` | `{ nome, email, inquilinoId, papel: "admin" \| "gerente" \| "usuario" }` | usuários dos tenants |
| PATCH | `/api/admin/usuarios/:id` | `{ status: "ativo" \| "suspenso" }` | |
| POST | `/api/admin/usuarios/:id/redefinir-senha` | — | envia o e-mail de redefinição · `204` |
| GET · POST | `/api/admin/equipe` | `{ nome, email, papel: "superadmin" \| "admin" \| "suporte" \| "financeiro", departamento }` | equipe interna |
| PATCH | `/api/admin/equipe/:id` | `{ status: "ativo" \| "suspenso" }` | |
| POST | `/api/admin/equipe/:id/redefinir-senha` | — | `204` |
| GET · POST | `/api/admin/despesas` | `{ descricao, categoria, custoMensal, fornecedor?, observacoes? }` | `categoria`: `infraestrutura`, `nuvem`, `ferramentas`, `suporte`, `outros` |
| PATCH | `/api/admin/despesas/:id` | `{ status: "ativo" \| "cancelado" }` | |
| GET | `/api/admin/auditoria` | — | do mais recente para o mais antigo |

O **`PATCH` só altera o `status`**: os outros campos do corpo são ignorados (contagens, papel e plano têm regras próprias e não mudam por aí). Não há `DELETE`: registros são suspensos ou cancelados.

### 3.1 Campos preenchidos pelo backend

- `Inquilino`: `id`, `slug` (do nome, sem acentos), `status: "ativo"`, `qtdUsuarios: 0`, `maxUsuarios` (do plano), `criadoEm`.
- `Usuario` e `UsuarioInterno`: `id`, `status: "ativo"`, `ultimoLogin: null` (até o primeiro login), `criadoEm`.
- `Despesa`: `id`, `status: "ativo"`, `custoMensal` arredondado para 2 casas.
- `RegistroAuditoria`: tudo (veja 3.3).

### 3.2 Regras de negócio

| Regra | Erro |
|---|---|
| Nome, e-mail válido e plano existente no tenant | `422` |
| Dois tenants com o mesmo `slug` | `409` |
| Usuário novo em tenant suspenso | `409` |
| Usuário novo além de `maxUsuarios` do tenant (`qtdUsuarios` conta também os suspensos) | `409` |
| E-mail repetido entre usuários, ou entre colaboradores | `409` |
| Criar usuário soma 1 em `qtdUsuarios` do tenant | — |
| Só `superadmin` e `admin` criam, suspendem ou redefinem senha na equipe interna | `403` |
| Colaborador desativando a si mesmo | `409` |
| `custoMensal` menor ou igual a zero, ou categoria fora da lista | `422` |
| Status fora dos valores aceitos pelo recurso | `422` |
| Registro inexistente | `404` |

### 3.3 Auditoria

Toda gravação gera um registro `{ acao, ator, alvo, inquilinoId, nomeInquilino, detalhes, dataHora }`, em que `ator` é o e-mail do colaborador do token. `inquilinoId` e `nomeInquilino` ficam vazios quando a ação não é de um tenant. Ações usadas:

`inquilino.criado` · `inquilino.suspenso` · `inquilino.reativado` · `usuario.criado` · `usuario.suspenso` · `usuario.reativado` · `usuario.senha_redefinida` · `equipe.criado` · `equipe.suspenso` · `equipe.reativado` · `equipe.senha_redefinida` · `despesa.criada` · `despesa.cancelado` · `despesa.reativado`

## 4. CORS e endereço

Iguais aos do ERP: liberar a origem do front, os cabeçalhos `Authorization`, `Content-Type` e `ngrok-skip-browser-warning` e os métodos `GET, POST, PATCH`. Sem cookies.

**Apontar o front para o backend sem rebuild:** abra o backoffice com `?api=https://endereco-do-backend`. O endereço fica salvo no navegador; `?api=demo` volta para o modo demonstração.

## 5. Conferir o backend contra o contrato

```bash
CONTRATO_API_URL=https://minha-api CONTRATO_EMAIL=admin@nexohub.com CONTRATO_SENHA=senha npm run test:contrato
```

Para conferir também o `403` da equipe interna, informe um colaborador de suporte em `CONTRATO_EMAIL_SUPORTE` e `CONTRATO_SENHA_SUPORTE`. Sem `CONTRATO_API_URL` os testes rodam contra o servidor de demonstração. Use um banco de testes: os testes criam tenants, usuários, colaboradores e gastos (e não há rota para apagá-los).
