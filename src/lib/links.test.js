import { afterEach, describe, expect, it, vi } from 'vitest';

// links.js lê VITE_ERP_URL ao ser importado, então cada teste importa uma cópia nova do módulo
async function carregarLinks(url) {
  vi.resetModules();
  vi.stubEnv('VITE_ERP_URL', url);
  return import('./links.js');
}

afterEach(() => vi.unstubAllEnvs());

describe('links para o ERP & PDV', () => {
  it('monta o endereço sem barra duplicada', async () => {
    const { erpConfigurado, linkErp } = await carregarLinks('https://erp.exemplo.com/');
    expect(erpConfigurado).toBe(true);
    expect(linkErp()).toBe('https://erp.exemplo.com/');
    expect(linkErp('/produtos')).toBe('https://erp.exemplo.com/produtos');
  });

  it('sem endereço ou com endereço sem http(s):// os links não aparecem', async () => {
    for (const url of ['', 'localhost:5173', '/erp', 'ftp://erp.exemplo.com']) {
      const { erpConfigurado, linkErp } = await carregarLinks(url);
      expect(erpConfigurado, url).toBe(false);
      expect(linkErp('/produtos'), url).toBeNull();
    }
  });
});
