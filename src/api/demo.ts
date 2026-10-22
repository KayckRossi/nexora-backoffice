// Servidor de demonstração: responde às mesmas rotas que o backend real (CONTRATO_API_BACKEND.md),
// guardando os dados no navegador. Serve de implementação de referência do contrato, inclusive das regras.
import { ApiError } from '@/lib/http';
import { despesas, inquilinos, planos, registrosAuditoria, usuarios, usuariosInternos } from '@/data/dadosMock';
import type { Despesa, Inquilino, RegistroAuditoria, Usuario, UsuarioInterno } from '@/data/tipos';

const CHAVE = 'nexohub_demo_v1';

interface Banco {
  inquilinos: Inquilino[];
  usuarios: Usuario[];
  equipe: UsuarioInterno[];
  despesas: Despesa[];
  auditoria: RegistroAuditoria[];
}

const SEMENTE = (): Banco => JSON.parse(JSON.stringify({
  inquilinos, usuarios, equipe: usuariosInternos, despesas, auditoria: registrosAuditoria,
}));

let banco: Banco | null = null;

function carregar(): Banco {
  if (banco) return banco;
  try {
    const salvo = localStorage.getItem(CHAVE);
    banco = salvo ? { ...SEMENTE(), ...JSON.parse(salvo) } : SEMENTE();
  } catch {
    banco = SEMENTE();
  }
  return banco!;
}

function gravar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(banco)); } catch { /* storage indisponível */ }
}

export function restaurarDemonstracao() {
  banco = SEMENTE();
  gravar();
}

const novoId = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random().toString(16).slice(2)}`);
const agora = () => new Date().toISOString();
const hoje = () => agora().slice(0, 10);
const atraso = () => new Promise((resolve) => setTimeout(resolve, 120));
const copia = <T,>(valor: T): T => JSON.parse(JSON.stringify(valor));
const slug = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function exigir(condicao: unknown, status: number, mensagem: string): asserts condicao {
  if (!condicao) throw new ApiError(status, mensagem);
}

function auditar(ator: UsuarioInterno, acao: string, alvo: string, detalhes: string, inquilino?: Inquilino) {
  carregar().auditoria.unshift({
    id: novoId(), acao, ator: ator.email, alvo, detalhes,
    inquilinoId: inquilino?.id ?? '', nomeInquilino: inquilino?.nome ?? '', dataHora: agora(),
  });
}

function usuarioDoToken(token: string | null) {
  const id = token?.startsWith('demo:') ? token.slice(5) : null;
  return carregar().equipe.find((u) => u.id === id && u.status === 'ativo') ?? null;
}

type Corpo = Record<string, unknown>;
const texto = (corpo: Corpo, campo: string) => String(corpo[campo] ?? '').trim();

export async function responderDemo<T>(method: string, caminho: string, body: unknown, token: string | null): Promise<T> {
  await atraso();
  const [rota] = caminho.split('?');
  const dados = carregar();
  const corpo = (body ?? {}) as Corpo;

  if (rota === '/api/admin/auth/login' && method === 'POST') {
    // Modo demonstração: qualquer senha entra; o e-mail de um colaborador entra como ele
    const email = texto(corpo, 'email').toLowerCase();
    const colaborador = dados.equipe.find((u) => u.email === email);
    exigir(!colaborador || colaborador.status === 'ativo', 401, 'Usuário desativado.');
    const usuario = colaborador ?? dados.equipe.find((u) => u.papel === 'superadmin')!;
    usuario.ultimoLogin = agora();
    gravar();
    return { access_token: `demo:${usuario.id}`, user: copia(usuario) } as T;
  }

  const eu = usuarioDoToken(token);
  exigir(eu, 401, 'Sessão expirada. Entre novamente.');

  const partes = rota.replace(/^\/api\/admin\//, '').split('/').filter(Boolean);
  const [colecao, id, acao] = partes;
  // auth/me e auth/logout são rotas fixas, não "auth/:id"
  const rotaDe = colecao === 'auth' ? `${method} ${partes.join('/')}` : `${method} ${colecao}${id ? '/:id' : ''}${acao ? `/${acao}` : ''}`;

  switch (rotaDe) {
    case 'GET auth/me': return copia(eu) as T;
    case 'POST auth/logout': return null as T;
    case 'GET planos': return copia(planos) as T;
    case 'GET inquilinos': return copia(dados.inquilinos) as T;
    case 'GET usuarios': return copia(dados.usuarios) as T;
    case 'GET equipe': return copia(dados.equipe) as T;
    case 'GET despesas': return copia(dados.despesas) as T;
    case 'GET auditoria': return copia([...dados.auditoria].sort((a, b) => b.dataHora.localeCompare(a.dataHora))) as T;

    case 'POST inquilinos': {
      const nome = texto(corpo, 'nome');
      const plano = planos.find((p) => p.id === corpo.planoId);
      exigir(nome, 422, 'Informe o nome da empresa.');
      exigir(texto(corpo, 'emailContato').includes('@'), 422, 'Informe um e-mail de contato válido.');
      exigir(plano, 422, 'Selecione um plano.');
      exigir(!dados.inquilinos.some((i) => i.slug === slug(nome)), 409, 'Já existe um tenant com esse nome.');
      const inquilino: Inquilino = {
        id: novoId(), nome, slug: slug(nome), cnpj: texto(corpo, 'cnpj'), planoId: plano.id, status: 'ativo',
        qtdUsuarios: 0, maxUsuarios: plano.maxUsuarios, criadoEm: hoje(),
        emailContato: texto(corpo, 'emailContato'), telefoneContato: texto(corpo, 'telefoneContato'),
      };
      dados.inquilinos.push(inquilino);
      auditar(eu, 'inquilino.criado', nome, `Tenant criado no plano ${plano.nome}`, inquilino);
      gravar();
      return copia(inquilino) as T;
    }

    case 'POST usuarios': {
      const inquilino = dados.inquilinos.find((i) => i.id === corpo.inquilinoId);
      const email = texto(corpo, 'email').toLowerCase();
      exigir(texto(corpo, 'nome'), 422, 'Informe o nome.');
      exigir(email.includes('@'), 422, 'Informe um e-mail válido.');
      exigir(['admin', 'gerente', 'usuario'].includes(String(corpo.papel)), 422, 'Selecione o papel.');
      exigir(inquilino, 422, 'Selecione o tenant.');
      exigir(inquilino.status === 'ativo', 409, 'O tenant está suspenso.');
      exigir(inquilino.qtdUsuarios < inquilino.maxUsuarios, 409, `Limite de ${inquilino.maxUsuarios} usuários do plano atingido.`);
      exigir(!dados.usuarios.some((u) => u.email === email), 409, 'Já existe um usuário com esse e-mail.');
      const usuario: Usuario = {
        id: novoId(), inquilinoId: inquilino.id, nome: texto(corpo, 'nome'), email,
        papel: corpo.papel as Usuario['papel'], status: 'ativo', ultimoLogin: null, criadoEm: hoje(),
      };
      dados.usuarios.push(usuario);
      inquilino.qtdUsuarios += 1;
      auditar(eu, 'usuario.criado', email, `Usuário criado com papel ${usuario.papel}`, inquilino);
      gravar();
      return copia(usuario) as T;
    }

    case 'POST equipe': {
      exigir(['superadmin', 'admin'].includes(eu.papel), 403, 'Só administradores gerenciam a equipe interna.');
      const email = texto(corpo, 'email').toLowerCase();
      exigir(texto(corpo, 'nome'), 422, 'Informe o nome.');
      exigir(email.includes('@'), 422, 'Informe um e-mail válido.');
      exigir(['superadmin', 'admin', 'suporte', 'financeiro'].includes(String(corpo.papel)), 422, 'Selecione o cargo.');
      exigir(texto(corpo, 'departamento'), 422, 'Selecione o departamento.');
      exigir(!dados.equipe.some((u) => u.email === email), 409, 'Já existe um colaborador com esse e-mail.');
      const colaborador: UsuarioInterno = {
        id: novoId(), nome: texto(corpo, 'nome'), email, papel: corpo.papel as UsuarioInterno['papel'],
        departamento: texto(corpo, 'departamento'), status: 'ativo', ultimoLogin: null, criadoEm: hoje(),
      };
      dados.equipe.push(colaborador);
      auditar(eu, 'equipe.criado', email, `Colaborador criado como ${colaborador.papel}`);
      gravar();
      return copia(colaborador) as T;
    }

    case 'POST despesas': {
      const custo = Number(corpo.custoMensal);
      exigir(texto(corpo, 'descricao'), 422, 'Informe a descrição.');
      exigir(['infraestrutura', 'nuvem', 'ferramentas', 'suporte', 'outros'].includes(String(corpo.categoria)), 422, 'Selecione a categoria.');
      exigir(Number.isFinite(custo) && custo > 0, 422, 'Informe um custo mensal maior que zero.');
      const despesa: Despesa = {
        id: novoId(), descricao: texto(corpo, 'descricao'), categoria: corpo.categoria as Despesa['categoria'],
        fornecedor: texto(corpo, 'fornecedor'), custoMensal: Math.round(custo * 100) / 100, status: 'ativo',
        observacoes: texto(corpo, 'observacoes'),
      };
      dados.despesas.push(despesa);
      auditar(eu, 'despesa.criada', despesa.descricao, `Custo mensal de R$ ${despesa.custoMensal.toFixed(2)}`);
      gravar();
      return copia(despesa) as T;
    }

    case 'PATCH inquilinos/:id':
    case 'PATCH usuarios/:id':
    case 'PATCH equipe/:id':
    case 'PATCH despesas/:id': {
      if (colecao === 'equipe') exigir(['superadmin', 'admin'].includes(eu.papel), 403, 'Só administradores gerenciam a equipe interna.');
      const lista = dados[colecao as 'inquilinos' | 'usuarios' | 'equipe' | 'despesas'] as unknown as ({ id: string; status: string } & Corpo)[];
      const registro = lista.find((r) => r.id === id);
      exigir(registro, 404, 'Registro não encontrado.');
      // Só o status muda por aqui; os demais campos do corpo são ignorados (contagens, papel e plano têm regras próprias)
      const status = String(corpo.status ?? '');
      const validos = colecao === 'despesas' ? ['ativo', 'cancelado'] : ['ativo', 'suspenso'];
      exigir(validos.includes(status), 422, 'Status inválido.');
      exigir(!(colecao === 'equipe' && id === eu.id && status === 'suspenso'), 409, 'Você não pode desativar a si mesmo.');
      registro.status = status;
      const nome = String(registro.nome ?? registro.email ?? registro.descricao);
      const inquilino = colecao === 'inquilinos' ? registro as unknown as Inquilino
        : colecao === 'usuarios' ? dados.inquilinos.find((i) => i.id === registro.inquilinoId) : undefined;
      const evento = { ativo: 'reativado', suspenso: 'suspenso', cancelado: 'cancelado' }[status];
      auditar(eu, `${colecao === 'inquilinos' ? 'inquilino' : colecao === 'usuarios' ? 'usuario' : colecao === 'equipe' ? 'equipe' : 'despesa'}.${evento}`,
        colecao === 'usuarios' || colecao === 'equipe' ? String(registro.email) : nome, `Status alterado para ${status}`, inquilino);
      gravar();
      return copia(registro) as T;
    }

    case 'POST usuarios/:id/redefinir-senha':
    case 'POST equipe/:id/redefinir-senha': {
      if (colecao === 'equipe') exigir(['superadmin', 'admin'].includes(eu.papel), 403, 'Só administradores gerenciam a equipe interna.');
      const lista = colecao === 'usuarios' ? dados.usuarios : dados.equipe;
      const pessoa = (lista as (Usuario | UsuarioInterno)[]).find((u) => u.id === id);
      exigir(pessoa, 404, 'Registro não encontrado.');
      const inquilino = 'inquilinoId' in pessoa ? dados.inquilinos.find((i) => i.id === pessoa.inquilinoId) : undefined;
      auditar(eu, `${colecao === 'usuarios' ? 'usuario' : 'equipe'}.senha_redefinida`, pessoa.email, 'E-mail de redefinição de senha enviado', inquilino);
      gravar();
      return null as T;
    }
  }
  throw new ApiError(404, `Rota não encontrada: ${method} ${rota}`);
}
