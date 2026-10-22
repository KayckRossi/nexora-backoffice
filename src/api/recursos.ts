// Rotas da API do backoffice (/api/admin/...) e hooks do React Query usados pelas telas.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/http';
import type { Despesa, Inquilino, Plano, RegistroAuditoria, Usuario, UsuarioInterno } from '@/data/tipos';

export const ROTAS = {
  planos: '/api/admin/planos',
  inquilinos: '/api/admin/inquilinos',
  usuarios: '/api/admin/usuarios',
  equipe: '/api/admin/equipe',
  despesas: '/api/admin/despesas',
  auditoria: '/api/admin/auditoria',
} as const;

type Colecao = Exclude<keyof typeof ROTAS, 'planos' | 'auditoria'>;

const lista = <T,>(rota: string) => () => useQuery({ queryKey: [rota], queryFn: () => api<T[]>(rota) });

export const usePlanos = lista<Plano>(ROTAS.planos);
export const useInquilinos = lista<Inquilino>(ROTAS.inquilinos);
export const useUsuarios = lista<Usuario>(ROTAS.usuarios);
export const useEquipe = lista<UsuarioInterno>(ROTAS.equipe);
export const useDespesas = lista<Despesa>(ROTAS.despesas);
export const useAuditoria = lista<RegistroAuditoria>(ROTAS.auditoria);

const avisarErro = (erro: unknown) =>
  toast({ variant: 'destructive', title: 'Não foi possível concluir', description: erro instanceof Error ? erro.message : 'Tente novamente.' });

// Toda gravação muda o log de auditoria; usuários novos também mudam a contagem do tenant
function useRecarregar(colecao: Colecao) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [ROTAS[colecao]] });
    queryClient.invalidateQueries({ queryKey: [ROTAS.auditoria] });
    if (colecao === 'usuarios') queryClient.invalidateQueries({ queryKey: [ROTAS.inquilinos] });
  };
}

export type NovoInquilino = Pick<Inquilino, 'nome' | 'cnpj' | 'emailContato' | 'telefoneContato' | 'planoId'>;
export type NovoUsuario = Pick<Usuario, 'nome' | 'email' | 'inquilinoId' | 'papel'>;
export type NovoColaborador = Pick<UsuarioInterno, 'nome' | 'email' | 'papel' | 'departamento'>;
export type NovaDespesa = Pick<Despesa, 'descricao' | 'categoria' | 'custoMensal' | 'fornecedor' | 'observacoes'>;

interface CorpoCriacao {
  inquilinos: NovoInquilino;
  usuarios: NovoUsuario;
  equipe: NovoColaborador;
  despesas: NovaDespesa;
}

export function useCriar<C extends Colecao>(colecao: C) {
  const recarregar = useRecarregar(colecao);
  return useMutation({
    mutationFn: (corpo: CorpoCriacao[C]) => api(ROTAS[colecao], { method: 'POST', body: corpo }),
    onSuccess: recarregar,
    onError: avisarErro,
  });
}

export function useAlterarStatus(colecao: Colecao) {
  const recarregar = useRecarregar(colecao);
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`${ROTAS[colecao]}/${id}`, { method: 'PATCH', body: { status } }),
    onSuccess: recarregar,
    onError: avisarErro,
  });
}

export function useRedefinirSenha(colecao: 'usuarios' | 'equipe') {
  const recarregar = useRecarregar(colecao);
  return useMutation({
    mutationFn: (pessoa: { id: string; email: string }) =>
      api(`${ROTAS[colecao]}/${pessoa.id}/redefinir-senha`, { method: 'POST' }),
    onSuccess: (_resposta, pessoa) => {
      recarregar();
      toast({ title: 'Reset enviado', description: `E-mail de redefinição enviado para ${pessoa.email}` });
    },
    onError: avisarErro,
  });
}
