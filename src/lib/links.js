// Endereço do ERP & PDV (outro repositório), definido em VITE_ERP_URL.
// Sem ele, os links que levam ao ERP não aparecem.
const URL_ERP = (import.meta.env.VITE_ERP_URL || '').replace(/\/+$/, '');

export const linkErp = (caminho = '/') => (URL_ERP ? `${URL_ERP}${caminho}` : null);
