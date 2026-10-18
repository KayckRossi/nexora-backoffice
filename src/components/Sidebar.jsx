import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ExternalLink, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { ROTAS_BACKOFFICE } from '@/lib/rotas';
import { erpConfigurado, linkErp, propsLinkExterno } from '@/lib/links';

// Agrupa as telas do backoffice (src/lib/rotas.js); cada item só aparece para perfis com a permissão
const GRUPOS = ROTAS_BACKOFFICE.reduce((grupos, rota) => {
  const item = { to: rota.caminho, label: rota.rotulo, icon: rota.icone, permissao: rota.permissao };
  const grupo = grupos.find((g) => g.titulo === rota.grupo);
  if (grupo) grupo.itens.push(item);
  else grupos.push({ titulo: rota.grupo, itens: [item] });
  return grupos;
}, []);

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile, onToggleCollapse }) {
  const width = collapsed ? 'w-20' : 'w-64';
  const { pode } = useAuth();
  const grupos = GRUPOS
    .map((grupo) => ({ ...grupo, itens: grupo.itens.filter((item) => pode(item.permissao)) }))
    .filter((grupo) => grupo.itens.length);

  const content = (
    <div className={`flex h-full flex-col bg-onyx border-r border-[rgba(125,226,209,0.10)] transition-all duration-300 ${width}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-[rgba(125,226,209,0.10)] shrink-0">
        <div className="w-9 h-9 rounded-lg bg-verdigris flex items-center justify-center shrink-0 shadow-lg shadow-verdigris/20">
          <span className="text-snow font-bold text-lg">N</span>
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <p className="font-semibold text-snow leading-tight">Nexora</p>
            <p className="text-xs text-snow/50">Backoffice</p>
          </motion.div>
        )}
        <button
          onClick={onCloseMobile}
          className="ml-auto md:hidden text-snow/60 hover:text-pearl p-1"
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Menu principal">
        {grupos.map((grupo, indiceGrupo) => (
          <div key={grupo.titulo} className={indiceGrupo ? 'pt-3' : ''}>
            {collapsed
              ? indiceGrupo > 0 && <div className="mx-3 mb-3 border-t border-[rgba(125,226,209,0.10)]" />
              : <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-snow/35">{grupo.titulo}</p>}
            <div className="space-y-1">
              {grupo.itens.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    aria-label={item.label}
                    title={item.label}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `relative flex items-center py-2.5 rounded-lg transition-all duration-200 group ${
                        collapsed
                          ? 'justify-center px-0'
                          : isActive
                            ? 'pl-4 pr-3 gap-3'
                            : 'px-3 gap-3'
                      } ${
                        isActive
                          ? 'text-pearl bg-verdigris-light font-medium'
                          : 'text-snow/70 hover:text-snow hover:bg-graphite-hover'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="active-bar"
                            className={`absolute ${collapsed ? 'left-1' : 'left-1.5'} top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-verdigris shadow-[0_0_8px_rgba(51,153,137,0.6)]`}
                          />
                        )}
                        <Icon size={20} className="shrink-0 transition-transform group-hover:scale-105" />
                        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Atalho para o ERP & PDV (outro app), quando VITE_ERP_URL está definida */}
      {erpConfigurado && (
        <a
          href={linkErp()}
          {...propsLinkExterno}
          title="Abrir o ERP & PDV em outra aba"
          className={`flex items-center gap-3 mx-3 mb-3 py-2.5 rounded-lg text-snow/70 hover:text-snow hover:bg-graphite-hover transition-colors ${collapsed ? 'justify-center px-0' : 'px-3'}`}
        >
          <ShoppingCart size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium flex-1">ERP & PDV</span>}
          {!collapsed && <ExternalLink size={14} className="text-snow/40" />}
        </a>
      )}

      {/* Collapse toggle (desktop) */}
      <button
        onClick={onToggleCollapse}
        className="hidden md:flex items-center justify-center gap-2 h-12 border-t border-[rgba(125,226,209,0.10)] text-snow/60 hover:text-pearl transition-colors"
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        <ChevronLeft size={18} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        {!collapsed && <span className="text-xs">Recolher</span>}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block shrink-0">{content}</aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full z-50 md:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
