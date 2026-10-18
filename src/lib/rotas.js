import { Banknote, ShoppingBasket, Truck, Tags, UserCog, ScrollText } from 'lucide-react';

// Telas do backoffice e a permissão exigida (src/lib/permissoes.js).
// A ordem define o menu e a tela inicial de cada perfil.
export const ROTAS_BACKOFFICE = [
  { caminho: '/caixa', rotulo: 'Caixa', icone: Banknote, permissao: 'pdv.operar', grupo: 'Retaguarda' },
  { caminho: '/compras', rotulo: 'Compras', icone: ShoppingBasket, permissao: 'compras.gerenciar', grupo: 'Retaguarda' },
  { caminho: '/fornecedores', rotulo: 'Fornecedores', icone: Truck, permissao: 'fornecedores.gerenciar', grupo: 'Retaguarda' },
  { caminho: '/categorias', rotulo: 'Categorias', icone: Tags, permissao: 'categorias.gerenciar', grupo: 'Retaguarda' },
  { caminho: '/usuarios', rotulo: 'Usuários', icone: UserCog, permissao: 'usuarios.gerenciar', grupo: 'Administração' },
  { caminho: '/auditoria', rotulo: 'Auditoria', icone: ScrollText, permissao: 'auditoria.ver', grupo: 'Administração' },
];
