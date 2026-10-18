// Endereço do ERP & PDV (outro repositório), definido em VITE_ERP_URL.
// Só vale um endereço completo (http:// ou https://): sem ele, os links que levam ao ERP não aparecem.
const valor = (import.meta.env.VITE_ERP_URL || '').trim().replace(/\/+$/, '');
const URL_ERP = /^https?:\/\/[^/]/i.test(valor) ? valor : '';

export const erpConfigurado = Boolean(URL_ERP);

export const linkErp = (caminho = '/') => (erpConfigurado ? `${URL_ERP}${caminho}` : null);

// O ERP abre em outra aba, para não perder o que está em andamento aqui (ex.: uma compra sendo montada)
export const propsLinkExterno = { target: '_blank', rel: 'noopener noreferrer' };
