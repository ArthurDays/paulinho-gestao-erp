/**
 * Camada de Comunicação com Backend REST (Python 3.14)
 * Paulinho Gestão - Ferro Velho & Auto Desmanche
 */

const API = {
  baseUrl: '',

  async getMateriais() {
    const res = await fetch(`${this.baseUrl}/api/materiais`);
    return await res.json();
  },

  async getParceiros() {
    const res = await fetch(`${this.baseUrl}/api/parceiros`);
    return await res.json();
  },

  async getPesagens() {
    const res = await fetch(`${this.baseUrl}/api/pesagens`);
    return await res.json();
  },

  async salvarPesagem(romaneio) {
    const res = await fetch(`${this.baseUrl}/api/pesagens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(romaneio)
    });
    return await res.json();
  },

  async cadastrarParceiro(parceiro) {
    const res = await fetch(`${this.baseUrl}/api/parceiros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parceiro)
    });
    return await res.json();
  },

  async getEstoque() {
    const res = await fetch(`${this.baseUrl}/api/estoque`);
    return await res.json();
  },

  async venderPeca(pecaId) {
    const res = await fetch(`${this.baseUrl}/api/estoque/vender`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pecaId })
    });
    return await res.json();
  },

  async getDesmanche() {
    const res = await fetch(`${this.baseUrl}/api/desmanche`);
    return await res.json();
  },

  async descontaminarVeiculo(veiculoId, fluidos) {
    const res = await fetch(`${this.baseUrl}/api/desmanche/descontaminar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: veiculoId, fluidos })
    });
    return await res.json();
  },

  async processarTriagem(payload) {
    const res = await fetch(`${this.baseUrl}/api/desmanche/triagem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async getMetricas() {
    const res = await fetch(`${this.baseUrl}/api/metricas`);
    return await res.json();
  },

  async getSyncHistorico() {
    const res = await fetch(`${this.baseUrl}/api/sync/historico`);
    return await res.json();
  },

  async importarPlanilha(payload) {
    const res = await fetch(`${this.baseUrl}/api/sync/planilha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  getTemplateCsvUrl() {
    return `${this.baseUrl}/api/sync/template-csv`;
  }
};
