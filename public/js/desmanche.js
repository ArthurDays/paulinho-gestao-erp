/**
 * Módulo Desmanche & Linha de Desmontagem Mecânica (Zona Laranja)
 * Paulinho Gestão
 */

const DesmancheModule = {
  veiculoSelecionado: null,

  init() {
    this.bindEvents();
    this.renderBaias();
  },

  bindEvents() {
    State.on('desmanche:updated', () => this.renderBaias());
  },

  renderBaias() {
    const container = document.getElementById('dismantle-bays-container');
    if (!container) return;

    container.innerHTML = '';

    State.veiculos.forEach(v => {
      const card = document.createElement('div');
      card.className = 'bay-card';

      const isDescontaminado = v.descontaminado;

      card.innerHTML = `
        <div class="bay-card-header">
          <span class="bay-badge">${v.baia}</span>
          <span style="font-size: 0.8rem; font-weight: 700; color: ${v.status === 'Em Desmontagem' ? '#fb923c' : '#a3e635'};">
            ${v.status}
          </span>
        </div>

        <div class="vehicle-info-block">
          <div class="vehicle-title">${v.marca_modelo}</div>
          <div class="vehicle-details">
            <span class="vehicle-detail-item"><strong>Placa:</strong> ${v.placa}</span>
            <span class="vehicle-detail-item"><strong>Ano:</strong> ${v.ano}</span>
            <span class="vehicle-detail-item"><strong>Baixa:</strong> ${v.certidao_baixa}</span>
            <span class="vehicle-detail-item" style="color: #60a5fa;"><strong>Chassi:</strong> ${v.chassi}</span>
          </div>
        </div>

        <div style="margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">
            <span>Progresso da Desmontagem</span>
            <span style="color: var(--color-desmanche-light);">${v.progresso}%</span>
          </div>
          <div class="shelf-progress-bar">
            <div class="shelf-progress-fill" style="width: ${v.progresso}%; background: linear-gradient(90deg, #ea580c, #fb923c);"></div>
          </div>
        </div>

        <div class="fluid-checklist">
          <div class="fluid-checklist-title">
            <span>Protocolo de Descontaminação Ambiental (Lei 12.977)</span>
          </div>
          <div class="fluid-items-grid">
            <div class="fluid-item ${isDescontaminado ? 'checked' : ''}">
              ${isDescontaminado ? '✓' : '○'} Óleo Motor (${v.fluidos_drenados.oleo_motor}L)
            </div>
            <div class="fluid-item ${isDescontaminado ? 'checked' : ''}">
              ${isDescontaminado ? '✓' : '○'} Óleo Câmbio (${v.fluidos_drenados.oleo_cambio}L)
            </div>
            <div class="fluid-item ${isDescontaminado ? 'checked' : ''}">
              ${isDescontaminado ? '✓' : '○'} Arrefecimento (${v.fluidos_drenados.arrefecimento}L)
            </div>
            <div class="fluid-item ${isDescontaminado ? 'checked' : ''}">
              ${isDescontaminado ? '✓' : '○'} Bateria Chumbo
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
          <span>Autopeças geradas: <strong>${v.pecas_geradas} un</strong></span>
          <span>Sucata metálica: <strong>${v.sucata_gerada_kg} kg</strong></span>
        </div>

        <div style="display: flex; gap: 0.5rem;">
          ${!isDescontaminado 
            ? `<button class="btn btn-orange" style="flex: 1; font-size: 0.85rem;" onclick="DesmancheModule.abrirModalDescontaminacao('${v.id}')">
                Descontaminar Fluídos
               </button>`
            : `<button class="btn btn-primary" style="flex: 1; font-size: 0.85rem;" onclick="DesmancheModule.abrirModalTriagem('${v.id}')">
                Extrair Peça / Sucata
               </button>`
          }
        </div>
      `;

      container.appendChild(card);
    });
  },

  abrirModalDescontaminacao(veiculoId) {
    this.veiculoSelecionado = State.veiculos.find(v => v.id === veiculoId);
    if (!this.veiculoSelecionado) return;

    const modal = document.getElementById('modal-descontaminacao');
    const nomeEl = document.getElementById('descont-veiculo-nome');
    if (nomeEl) nomeEl.textContent = `${this.veiculoSelecionado.marca_modelo} (${this.veiculoSelecionado.placa})`;
    if (modal) modal.classList.add('open');
  },

  async confirmarDescontaminacao() {
    if (!this.veiculoSelecionado) return;

    const fluidos = {
      oleo_motor: 4.5,
      oleo_cambio: 5.0,
      arrefecimento: 6.5,
      fluido_freio: 0.8,
      bateria_chumbo: true,
      gas_ac: true
    };

    try {
      const res = await API.descontaminarVeiculo(this.veiculoSelecionado.id, fluidos);
      if (res.success) {
        document.getElementById('modal-descontaminacao').classList.remove('open');
        showToast(`Veículo ${this.veiculoSelecionado.placa} descontaminado e encaminhado para o Elevador de Desmanche!`, 'success');
        
        const data = await API.getDesmanche();
        State.setVeiculos(data.veiculos);
      }
    } catch (err) {
      showToast('Erro ao descontaminar: ' + err.message, 'warning');
    }
  },

  abrirModalTriagem(veiculoId) {
    this.veiculoSelecionado = State.veiculos.find(v => v.id === veiculoId);
    if (!this.veiculoSelecionado) return;

    const modal = document.getElementById('modal-triagem');
    const nomeEl = document.getElementById('triagem-veiculo-nome');
    if (nomeEl) nomeEl.textContent = `${this.veiculoSelecionado.marca_modelo} (${this.veiculoSelecionado.placa})`;
    if (modal) modal.classList.add('open');
  },

  async salvarTriagem(tipoDestino) {
    if (!this.veiculoSelecionado) return;

    let payload = {
      veiculo_id: this.veiculoSelecionado.id,
      destino: tipoDestino
    };

    if (tipoDestino === 'ESTOQUE') {
      const desc = document.getElementById('triagem-peca-desc')?.value;
      const preco = parseFloat(document.getElementById('triagem-peca-preco')?.value) || 250;
      const estante = document.getElementById('triagem-peca-estante')?.value || 'EST-01';

      if (!desc) {
        showToast('Informe a descrição da peça extraída!', 'warning');
        return;
      }

      payload.descricao = desc;
      payload.preco_venda = preco;
      payload.estante_id = estante;
      payload.codigo_oem = 'OEM-' + Math.floor(Math.random() * 899999 + 100000);
      payload.categoria = 'Mecânica';
      payload.veiculo_origem = `${this.veiculoSelecionado.marca_modelo} (${this.veiculoSelecionado.placa})`;
    } else {
      const peso = parseFloat(document.getElementById('triagem-sucata-peso')?.value) || 25;
      payload.peso = peso;
      payload.material = 'Ferro Sucata Pesada';
    }

    try {
      const res = await API.processarTriagem(payload);
      if (res.success) {
        document.getElementById('modal-triagem').classList.remove('open');
        showToast(
          tipoDestino === 'ESTOQUE' 
            ? 'Peça catalogada e adicionada às Prateleiras!' 
            : 'Sucata metálica pesada enviada ao lote de reciclagem!', 
          'success'
        );

        // Recarrega desmanche, estoque e métricas
        const desmancheData = await API.getDesmanche();
        State.setVeiculos(desmancheData.veiculos);

        const estoqueData = await API.getEstoque();
        State.setEstoque(estoqueData);

        const metricas = await API.getMetricas();
        State.setMetricas(metricas);
        App.updateKpis();
      }
    } catch (err) {
      showToast('Erro ao processar triagem: ' + err.message, 'warning');
    }
  }
};
