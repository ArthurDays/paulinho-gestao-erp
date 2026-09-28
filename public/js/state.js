/**
 * Gerenciador de Estado Reativo
 * Paulinho Gestão
 */

const State = {
  materiais: [],
  parceiros: [],
  romaneios: [],
  estantes: [],
  pecas: [],
  veiculos: [],
  metricas: {},

  // Estado da Pesagem Atual no Balcão
  pesagemAtual: {
    tipo: 'COMPRA', // COMPRA (Pagar Fornecedor) ou VENDA (Receber de Cliente)
    parceiroSelecionado: null,
    materialSelecionado: null,
    pesoBruto: 0.0,
    tara: 0.0,
    descontoImpurezaPct: 0.0,
    descontoKg: 0.0,
    itens: []
  },

  // Simulação da Balança
  balancaAtiva: true,
  balancaEstavel: true,

  // Ouvintes de evento
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  },

  setMateriais(list) {
    this.materiais = list;
    this.emit('materiais:updated', list);
  },

  setParceiros(list) {
    this.parceiros = list;
    this.emit('parceiros:updated', list);
  },

  setEstoque(data) {
    this.estantes = data.estantes || [];
    this.pecas = data.pecas || [];
    this.emit('estoque:updated', data);
  },

  setVeiculos(list) {
    this.veiculos = list;
    this.emit('desmanche:updated', list);
  },

  setMetricas(m) {
    this.metricas = m;
    this.emit('metricas:updated', m);
  },

  // Cálculos da Balança
  calcularItemAtual() {
    const p = this.pesagemAtual;
    const mat = p.materialSelecionado;
    const bruto = parseFloat(p.pesoBruto) || 0;
    const tara = parseFloat(p.tara) || 0;
    const impPct = parseFloat(p.descontoImpurezaPct) || 0;

    const liqBase = Math.max(0, bruto - tara);
    const descImpKg = liqBase * (impPct / 100);
    const liqFinal = Math.max(0, liqBase - descImpKg);

    let precoKg = 0;
    if (mat) {
      precoKg = p.tipo === 'COMPRA' ? mat.preco_compra_kg : mat.preco_venda_kg;
    }

    const subtotal = liqFinal * precoKg;

    return {
      bruto,
      tara,
      liqBase,
      descImpKg,
      liqFinal,
      precoKg,
      subtotal
    };
  },

  calcularTotalRomaneio() {
    const itens = this.pesagemAtual.itens;
    let brutoTot = 0;
    let taraTot = 0;
    let liqTot = 0;
    let valTot = 0;

    itens.forEach(it => {
      brutoTot += it.peso_bruto;
      taraTot += it.tara;
      liqTot += it.peso_faturado;
      valTot += it.subtotal;
    });

    return {
      brutoTotal: brutoTot,
      taraTotal: taraTot,
      liquidoTotal: liqTot,
      valorTotal: valTot
    };
  }
};
