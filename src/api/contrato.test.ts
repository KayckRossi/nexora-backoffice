// Testes de contrato (CONTRATO_API_BACKEND.md). Por padrão rodam contra o servidor de demonstração;
// com CONTRATO_API_URL rodam contra um backend real (use um banco de testes: os testes criam registros).
import { beforeAll, describe, expect, it } from 'vitest';
import { api, ApiError, tokenStorage } from '@/lib/http';
import { entrar } from '@/lib/auth';
import { ROTAS } from '@/api/recursos';
import type { Despesa, Inquilino, Plano, RegistroAuditoria, Usuario, UsuarioInterno } from '@/data/tipos';

declare const process: { env: Record<string, string | undefined> };
const {
  CONTRATO_API_URL,
  CONTRATO_EMAIL = 'rafael@nexohub.com',
  CONTRATO_SENHA = 'demo',
  // Colaborador de suporte (sem permissão na equipe interna); contra backend real, o teste de 403 só roda se informado
  CONTRATO_EMAIL_SUPORTE = CONTRATO_API_URL ? undefined : 'camila@nexohub.com',
  CONTRATO_SENHA_SUPORTE = 'demo',
} = process.env;

const unico = () => `${Date.now()}${Math.random().toString(16).slice(2, 6)}`;
const login = () => entrar(CONTRATO_EMAIL, CONTRATO_SENHA, true);

beforeAll(async () => {
  localStorage.clear();
  if (CONTRATO_API_URL) localStorage.setItem('nexohub_api_url', CONTRATO_API_URL);
  await login();
});

describe(`contrato da API do backoffice (${CONTRATO_API_URL ?? 'servidor de demonstração'})`, () => {
  it('login devolve token e colaborador sem senha; /auth/me devolve o mesmo colaborador', async () => {
    const usuario = await login();
    expect(tokenStorage.obter()).toBeTruthy();
    expect(usuario).toMatchObject({ id: expect.any(String), email: expect.any(String), papel: expect.any(String) });
    expect(usuario).not.toHaveProperty('password');
    expect(usuario).not.toHaveProperty('senha');
    const eu = await api<UsuarioInterno>('/api/admin/auth/me');
    expect(eu.id).toBe(usuario.id);
  });

  it('credenciais erradas recebem 401', async () => {
    if (!CONTRATO_API_URL) return; // no modo demonstração qualquer senha entra
    await expect(entrar(CONTRATO_EMAIL, `${CONTRATO_SENHA}-errada`)).rejects.toMatchObject({ status: 401 });
    await login();
  });

  it('rotas sem token recebem 401', async () => {
    tokenStorage.limpar();
    await expect(api(ROTAS.inquilinos)).rejects.toBeInstanceOf(ApiError);
    await expect(api(ROTAS.inquilinos)).rejects.toMatchObject({ status: 401 });
    await login();
  });

  it.each(Object.entries(ROTAS))('GET %s devolve um array de registros com id string', async (_nome, rota) => {
    const lista = await api<{ id: unknown }[]>(rota);
    expect(Array.isArray(lista)).toBe(true);
    for (const item of lista) expect(typeof item.id).toBe('string');
  });

  it('planos têm preço e limite de usuários', async () => {
    const planos = await api<Plano[]>(ROTAS.planos);
    expect(planos.length).toBeGreaterThan(0);
    for (const p of planos) expect(p).toMatchObject({ nome: expect.any(String), preco: expect.any(Number), maxUsuarios: expect.any(Number) });
  });

  it('tenant: cria, bloqueia usuários novos enquanto suspenso e respeita o limite do plano', async () => {
    const planos = await api<Plano[]>(ROTAS.planos);
    const menor = [...planos].sort((a, b) => a.maxUsuarios - b.maxUsuarios)[0];
    const nome = `Tenant Contrato ${unico()}`;

    await expect(api(ROTAS.inquilinos, { method: 'POST', body: { nome, emailContato: 'sem-arroba', planoId: menor.id } }))
      .rejects.toMatchObject({ status: 422 });

    const inquilino = await api<Inquilino>(ROTAS.inquilinos, {
      method: 'POST',
      body: { nome, cnpj: '00.000.000/0001-00', emailContato: 'contrato@exemplo.com', telefoneContato: '', planoId: menor.id },
    });
    expect(inquilino).toMatchObject({ id: expect.any(String), nome, status: 'ativo', qtdUsuarios: 0, maxUsuarios: menor.maxUsuarios });
    await expect(api(ROTAS.inquilinos, { method: 'POST', body: { nome, emailContato: 'contrato@exemplo.com', planoId: menor.id } }))
      .rejects.toMatchObject({ status: 409 });

    const novoUsuario = (n: number) => api<Usuario>(ROTAS.usuarios, {
      method: 'POST',
      body: { nome: `Usuário ${n}`, email: `contrato-${unico()}-${n}@exemplo.com`, inquilinoId: inquilino.id, papel: 'usuario' },
    });
    const primeiro = await novoUsuario(0);
    expect(primeiro).toMatchObject({ id: expect.any(String), inquilinoId: inquilino.id, status: 'ativo', ultimoLogin: null });
    await expect(api(ROTAS.usuarios, { method: 'POST', body: { nome: 'Repetido', email: primeiro.email, inquilinoId: inquilino.id, papel: 'usuario' } }))
      .rejects.toMatchObject({ status: 409 });

    const status = (valor: string) => api<Inquilino>(`${ROTAS.inquilinos}/${inquilino.id}`, { method: 'PATCH', body: { status: valor } });
    expect((await status('suspenso')).status).toBe('suspenso');
    await expect(novoUsuario(1)).rejects.toMatchObject({ status: 409 });
    await expect(status('apagado')).rejects.toMatchObject({ status: 422 });
    expect((await status('ativo')).status).toBe('ativo');

    for (let n = 1; n < menor.maxUsuarios; n++) await novoUsuario(n);
    await expect(novoUsuario(menor.maxUsuarios)).rejects.toMatchObject({ status: 409 });
    const atualizado = (await api<Inquilino[]>(ROTAS.inquilinos)).find((i) => i.id === inquilino.id);
    expect(atualizado?.qtdUsuarios).toBe(menor.maxUsuarios);
  });

  it('PATCH só altera o status; os demais campos são ignorados', async () => {
    const [inquilino] = await api<Inquilino[]>(ROTAS.inquilinos);
    const resposta = await api<Inquilino>(`${ROTAS.inquilinos}/${inquilino.id}`, {
      method: 'PATCH',
      body: { status: inquilino.status, qtdUsuarios: 0, maxUsuarios: 9999, planoId: 'outro' },
    });
    expect(resposta).toMatchObject({ qtdUsuarios: inquilino.qtdUsuarios, maxUsuarios: inquilino.maxUsuarios, planoId: inquilino.planoId });
  });

  it('registro inexistente recebe 404', async () => {
    await expect(api(`${ROTAS.usuarios}/nao-existe/redefinir-senha`, { method: 'POST' })).rejects.toMatchObject({ status: 404 });
  });

  it('gravações entram no log de auditoria com o colaborador como ator', async () => {
    const eu = await api<UsuarioInterno>('/api/admin/auth/me');
    const descricao = `Gasto Contrato ${unico()}`;
    const despesa = await api<Despesa>(ROTAS.despesas, {
      method: 'POST',
      body: { descricao, categoria: 'outros', custoMensal: 12.345, fornecedor: 'Fornecedor', observacoes: '' },
    });
    expect(despesa).toMatchObject({ id: expect.any(String), status: 'ativo', custoMensal: 12.35 });
    await expect(api(ROTAS.despesas, { method: 'POST', body: { descricao, categoria: 'outros', custoMensal: 0 } })).rejects.toMatchObject({ status: 422 });

    const log = await api<RegistroAuditoria[]>(ROTAS.auditoria);
    expect(log[0]).toMatchObject({ ator: eu.email, alvo: descricao, dataHora: expect.any(String) });
    expect(log.map((r) => r.dataHora)).toEqual([...log.map((r) => r.dataHora)].sort().reverse());
  });

  it('equipe interna: só superadmin/admin gerenciam e ninguém desativa a si mesmo', async () => {
    const eu = await api<UsuarioInterno>('/api/admin/auth/me');
    await expect(api(`${ROTAS.equipe}/${eu.id}`, { method: 'PATCH', body: { status: 'suspenso' } })).rejects.toMatchObject({ status: 409 });

    const colaborador = await api<UsuarioInterno>(ROTAS.equipe, {
      method: 'POST',
      body: { nome: 'Colaborador Contrato', email: `equipe-${unico()}@nexohub.com`, papel: 'suporte', departamento: 'Suporte' },
    });
    expect(colaborador).toMatchObject({ id: expect.any(String), papel: 'suporte', status: 'ativo', ultimoLogin: null });

    if (!CONTRATO_EMAIL_SUPORTE) return;
    await entrar(CONTRATO_EMAIL_SUPORTE, CONTRATO_SENHA_SUPORTE);
    try {
      await expect(api(ROTAS.equipe, { method: 'POST', body: { nome: 'X', email: `x-${unico()}@nexohub.com`, papel: 'admin', departamento: 'Suporte' } }))
        .rejects.toMatchObject({ status: 403 });
      await expect(api(`${ROTAS.equipe}/${colaborador.id}`, { method: 'PATCH', body: { status: 'suspenso' } })).rejects.toMatchObject({ status: 403 });
    } finally {
      await login();
    }
  });
});
