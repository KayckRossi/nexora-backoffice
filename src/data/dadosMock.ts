import { Inquilino, Usuario, RegistroAuditoria, Plano, UsuarioInterno, Despesa } from "./tipos";

export const planos: Plano[] = [
  { id: "starter", nome: "Starter", maxUsuarios: 5, preco: 99, funcionalidades: ["ERP Básico", "Suporte Email"] },
  { id: "professional", nome: "Professional", maxUsuarios: 25, preco: 299, funcionalidades: ["ERP Completo", "Suporte Prioritário", "API Access"] },
  { id: "enterprise", nome: "Enterprise", maxUsuarios: 100, preco: 799, funcionalidades: ["ERP Completo", "Suporte 24/7", "API Access", "White Label", "SLA 99.9%"] },
];

export const inquilinos: Inquilino[] = [
  { id: "t1", nome: "Construtora Alfa", slug: "alfa", planoId: "enterprise", status: "ativo", qtdUsuarios: 42, maxUsuarios: 100, criadoEm: "2024-01-15", emailContato: "admin@alfa.com.br", telefoneContato: "(11) 99999-0001" },
  { id: "t2", nome: "Logística Beta", slug: "beta", planoId: "professional", status: "ativo", qtdUsuarios: 18, maxUsuarios: 25, criadoEm: "2024-03-22", emailContato: "ti@beta.com.br", telefoneContato: "(21) 99999-0002" },
  { id: "t3", nome: "Comércio Gamma", slug: "gamma", planoId: "starter", status: "ativo", qtdUsuarios: 4, maxUsuarios: 5, criadoEm: "2024-06-10", emailContato: "suporte@gamma.com.br", telefoneContato: "(31) 99999-0003" },
  { id: "t4", nome: "Indústria Delta", slug: "delta", planoId: "professional", status: "suspenso", qtdUsuarios: 12, maxUsuarios: 25, criadoEm: "2024-02-28", emailContato: "admin@delta.com.br", telefoneContato: "(41) 99999-0004" },
  { id: "t5", nome: "Tech Epsilon", slug: "epsilon", planoId: "enterprise", status: "ativo", qtdUsuarios: 67, maxUsuarios: 100, criadoEm: "2023-11-05", emailContato: "cto@epsilon.com.br", telefoneContato: "(51) 99999-0005" },
  { id: "t6", nome: "Varejo Zeta", slug: "zeta", planoId: "starter", status: "ativo", qtdUsuarios: 3, maxUsuarios: 5, criadoEm: "2025-01-20", emailContato: "admin@zeta.com.br", telefoneContato: "(61) 99999-0006" },
];

export const usuarios: Usuario[] = [
  { id: "u1", inquilinoId: "t1", nome: "Carlos Silva", email: "carlos@alfa.com.br", papel: "admin", status: "ativo", ultimoLogin: "2026-03-30T14:30:00", criadoEm: "2024-01-15" },
  { id: "u2", inquilinoId: "t1", nome: "Ana Souza", email: "ana@alfa.com.br", papel: "gerente", status: "ativo", ultimoLogin: "2026-03-31T09:15:00", criadoEm: "2024-01-20" },
  { id: "u3", inquilinoId: "t1", nome: "Pedro Lima", email: "pedro@alfa.com.br", papel: "usuario", status: "suspenso", ultimoLogin: "2026-02-15T11:00:00", criadoEm: "2024-03-01" },
  { id: "u4", inquilinoId: "t2", nome: "Maria Santos", email: "maria@beta.com.br", papel: "admin", status: "ativo", ultimoLogin: "2026-03-31T08:00:00", criadoEm: "2024-03-22" },
  { id: "u5", inquilinoId: "t2", nome: "João Costa", email: "joao@beta.com.br", papel: "usuario", status: "ativo", ultimoLogin: "2026-03-29T16:45:00", criadoEm: "2024-04-10" },
  { id: "u6", inquilinoId: "t3", nome: "Fernanda Oliveira", email: "fernanda@gamma.com.br", papel: "admin", status: "ativo", ultimoLogin: "2026-03-30T10:20:00", criadoEm: "2024-06-10" },
  { id: "u7", inquilinoId: "t4", nome: "Ricardo Mendes", email: "ricardo@delta.com.br", papel: "admin", status: "suspenso", ultimoLogin: "2026-01-10T09:00:00", criadoEm: "2024-02-28" },
  { id: "u8", inquilinoId: "t5", nome: "Juliana Ferreira", email: "juliana@epsilon.com.br", papel: "admin", status: "ativo", ultimoLogin: "2026-03-31T07:30:00", criadoEm: "2023-11-05" },
];

export const usuariosInternos: UsuarioInterno[] = [
  { id: "i1", nome: "Rafael Admin", email: "rafael@nexohub.com", papel: "superadmin", departamento: "Tecnologia", status: "ativo", ultimoLogin: "2026-03-31T10:00:00", criadoEm: "2023-01-01" },
  { id: "i2", nome: "Camila Suporte", email: "camila@nexohub.com", papel: "suporte", departamento: "Suporte", status: "ativo", ultimoLogin: "2026-03-31T09:30:00", criadoEm: "2023-06-15" },
  { id: "i3", nome: "Bruno Financeiro", email: "bruno@nexohub.com", papel: "financeiro", departamento: "Financeiro", status: "ativo", ultimoLogin: "2026-03-30T14:00:00", criadoEm: "2024-01-10" },
  { id: "i4", nome: "Larissa Dev", email: "larissa@nexohub.com", papel: "admin", departamento: "Tecnologia", status: "ativo", ultimoLogin: "2026-03-31T08:45:00", criadoEm: "2024-03-01" },
  { id: "i5", nome: "Diego Comercial", email: "diego@nexohub.com", papel: "suporte", departamento: "Comercial", status: "suspenso", ultimoLogin: "2026-02-20T11:00:00", criadoEm: "2024-06-01" },
];

export const despesas: Despesa[] = [
  { id: "e1", descricao: "Servidores AWS (EC2 + RDS)", categoria: "infraestrutura", fornecedor: "Amazon Web Services", custoMensal: 4200, status: "ativo", observacoes: "3x m5.xlarge + RDS PostgreSQL" },
  { id: "e2", descricao: "Vercel Pro (Frontend)", categoria: "nuvem", fornecedor: "Vercel", custoMensal: 120, status: "ativo", observacoes: "Plano Pro para deploy do ERP" },
  { id: "e3", descricao: "Supabase Pro", categoria: "nuvem", fornecedor: "Supabase", custoMensal: 150, status: "ativo", observacoes: "Auth, Storage e Realtime" },
  { id: "e4", descricao: "Datadog Monitoring", categoria: "ferramentas", fornecedor: "Datadog", custoMensal: 380, status: "ativo", observacoes: "APM + Logs + Infra monitoring" },
  { id: "e5", descricao: "Jira + Confluence", categoria: "ferramentas", fornecedor: "Atlassian", custoMensal: 210, status: "ativo", observacoes: "Licenças para 8 devs" },
  { id: "e6", descricao: "GitHub Enterprise", categoria: "ferramentas", fornecedor: "GitHub", custoMensal: 168, status: "ativo", observacoes: "8 seats enterprise" },
  { id: "e7", descricao: "Zendesk Support", categoria: "suporte", fornecedor: "Zendesk", custoMensal: 290, status: "ativo", observacoes: "Suite Pro para equipe de suporte" },
  { id: "e8", descricao: "Cloudflare Pro", categoria: "nuvem", fornecedor: "Cloudflare", custoMensal: 80, status: "ativo", observacoes: "CDN + WAF + DDoS Protection" },
  { id: "e9", descricao: "SendGrid", categoria: "ferramentas", fornecedor: "Twilio", custoMensal: 90, status: "ativo", observacoes: "Emails transacionais" },
  { id: "e10", descricao: "Slack Business+", categoria: "ferramentas", fornecedor: "Slack", custoMensal: 125, status: "ativo", observacoes: "Comunicação interna" },
];

export const registrosAuditoria: RegistroAuditoria[] = [
  { id: "a1", acao: "usuario.suspenso", ator: "admin@nexohub.com", alvo: "pedro@alfa.com.br", inquilinoId: "t1", nomeInquilino: "Construtora Alfa", detalhes: "Usuário suspenso por violação de termos", dataHora: "2026-03-31T10:00:00" },
  { id: "a2", acao: "inquilino.suspenso", ator: "admin@nexohub.com", alvo: "Indústria Delta", inquilinoId: "t4", nomeInquilino: "Indústria Delta", detalhes: "Tenant suspenso por inadimplência", dataHora: "2026-03-30T15:30:00" },
  { id: "a3", acao: "usuario.criado", ator: "admin@nexohub.com", alvo: "fernanda@gamma.com.br", inquilinoId: "t3", nomeInquilino: "Comércio Gamma", detalhes: "Primeiro admin do tenant criado via onboarding", dataHora: "2026-03-29T09:00:00" },
  { id: "a4", acao: "permissao.alterada", ator: "carlos@alfa.com.br", alvo: "ana@alfa.com.br", inquilinoId: "t1", nomeInquilino: "Construtora Alfa", detalhes: "Papel alterado de 'usuario' para 'gerente'", dataHora: "2026-03-28T14:00:00" },
  { id: "a5", acao: "usuario.senha_resetada", ator: "admin@nexohub.com", alvo: "joao@beta.com.br", inquilinoId: "t2", nomeInquilino: "Logística Beta", detalhes: "Reset de senha manual via suporte", dataHora: "2026-03-27T11:30:00" },
  { id: "a6", acao: "plano.atualizado", ator: "admin@nexohub.com", alvo: "Logística Beta", inquilinoId: "t2", nomeInquilino: "Logística Beta", detalhes: "Plano alterado de Starter para Professional", dataHora: "2026-03-25T16:00:00" },
  { id: "a7", acao: "usuario.excluido", ator: "ricardo@delta.com.br", alvo: "ex-user@delta.com.br", inquilinoId: "t4", nomeInquilino: "Indústria Delta", detalhes: "Usuário removido a pedido do cliente", dataHora: "2026-03-24T10:15:00" },
  { id: "a8", acao: "inquilino.criado", ator: "admin@nexohub.com", alvo: "Varejo Zeta", inquilinoId: "t6", nomeInquilino: "Varejo Zeta", detalhes: "Novo tenant criado - plano Starter", dataHora: "2026-01-20T08:00:00" },
];
