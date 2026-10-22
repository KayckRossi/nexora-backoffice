// Autenticação: login no backend e token guardado no navegador.
import { useQuery, type QueryClient } from '@tanstack/react-query';
import { api, tokenStorage } from '@/lib/http';
import type { UsuarioInterno } from '@/data/tipos';

interface RespostaLogin {
  access_token: string;
  user: UsuarioInterno;
}

export async function entrar(email: string, senha: string, lembrar = true) {
  const resposta = await api<RespostaLogin>('/api/admin/auth/login', {
    method: 'POST',
    body: { email, password: senha },
    autenticado: false,
  });
  tokenStorage.salvar(resposta.access_token, lembrar);
  return resposta.user;
}

export async function sair(queryClient: QueryClient) {
  try { await api('/api/admin/auth/logout', { method: 'POST' }); } catch { /* sessão já encerrada */ }
  tokenStorage.limpar();
  queryClient.clear();
}

export function useUsuarioAtual() {
  return useQuery({
    queryKey: ['/api/admin/auth/me'],
    queryFn: () => api<UsuarioInterno>('/api/admin/auth/me'),
    enabled: Boolean(tokenStorage.obter()),
    staleTime: 5 * 60_000,
  });
}

// Só superadmin e admin gerenciam a equipe interna (o backend responde 403 aos demais)
export const podeGerenciarEquipe = (usuario?: UsuarioInterno) => usuario?.papel === 'superadmin' || usuario?.papel === 'admin';

// Só aceita voltar para caminhos internos (evita redirecionar para outro site após o login)
export const destinoSeguro = (destino: string | null) =>
  destino && destino.startsWith('/') && !destino.startsWith('//') ? destino : '/';
