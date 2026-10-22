export interface Plano {
  id: string;
  nome: string;
  maxUsuarios: number;
  preco: number;
  funcionalidades: string[];
}

export interface Inquilino {
  id: string;
  nome: string;
  slug: string;
  cnpj?: string;
  planoId: string;
  status: "ativo" | "suspenso";
  qtdUsuarios: number;
  maxUsuarios: number;
  criadoEm: string;
  emailContato: string;
  telefoneContato: string;
}

export interface Usuario {
  id: string;
  inquilinoId: string;
  nome: string;
  email: string;
  papel: "admin" | "gerente" | "usuario";
  status: "ativo" | "suspenso";
  ultimoLogin: string | null;
  criadoEm: string;
}

export interface UsuarioInterno {
  id: string;
  nome: string;
  email: string;
  papel: "superadmin" | "admin" | "suporte" | "financeiro";
  departamento: string;
  status: "ativo" | "suspenso";
  ultimoLogin: string | null;
  criadoEm: string;
}

export interface Despesa {
  id: string;
  descricao: string;
  categoria: "infraestrutura" | "nuvem" | "ferramentas" | "suporte" | "outros";
  fornecedor: string;
  custoMensal: number;
  status: "ativo" | "cancelado";
  observacoes: string;
}

export interface RegistroAuditoria {
  id: string;
  acao: string;
  ator: string;
  alvo: string;
  inquilinoId: string;
  nomeInquilino: string;
  detalhes: string;
  dataHora: string;
}
