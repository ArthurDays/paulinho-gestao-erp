/**
 * Módulo Prateleiras & Armazém Vertical (Zona Verde)
 * Paulinho Gestão - Design System Enterprise
 * Layout estruturado em Grid responsivo, Cards isolados e Progress Bar semântica
 */

const PrateleirasModule = {
  activeWingFilter: 'TODAS', // 'TODAS' | 'Esquerda' | 'Direita'
  selectedEstanteId: null,

  init() {
    this.bindEvents();
    this.renderEstantes();
    this.renderTabelaPecas();
  },

  bindEvents() {
    const inputBusca = document.getElementById('input-busca-peca');
    if (inputBusca) {
      inputBusca.addEventListener('input', () => this.renderTabelaPecas());
    }

    const selectCategoria = document.getElementById('select-filtro-categoria');
    if (selectCategoria) {
      selectCategoria.addEventListener('change', () => this.renderTabelaPecas());
    }

    // Filtros de Ala (Esquerda, Direita, Todas)
    document.querySelectorAll('.wing-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.wing-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeWingFilter = btn.dataset.wing;
        this.renderEstantes();
      });
    });

    State.on('estoque:updated', () => {
      this.renderEstantes();
      this.renderTabelaPecas();
    });
  },

  renderEstantes() {
    const grid = document.getElementById('shelves-grid-container');
    if (!grid) return;

    grid.innerHTML = '';

    // Filtra estantes conforme a aba selecionada
    const estantesFiltradas = State.estantes.filter(est => {
      if (this.activeWingFilter === 'TODAS') return true;
      return est.ala === this.activeWingFilter;
    });

    estantesFiltradas.forEach(est => {
      const card = document.createElement('div');
      card.className = `shelf-card ${this.selectedEstanteId === est.id ? 'active-filter' : ''}`;
      card.id = `card-${est.id}`;

      const pct = Math.min(100, Math.round((est.ocupacao / est.capacidade_max) * 100));

      // Determina cor semântica da barra de progresso (Tailwind style)
      let progressClass = 'progress-safe';
      let progressLabelColor = '#16a34a';
      if (pct >= 90) {
        progressClass = 'progress-high';
        progressLabelColor = '#ea580c';
      } else if (pct >= 75) {
        progressClass = 'progress-medium';
        progressLabelColor = '#ca8a04';
      }

      // Conta peças alocadas nessa estante por nível
      const pecasEstante = State.pecas.filter(p => p.estante_id === est.id);
      const pecasN4 = pecasEstante.filter(p => p.nivel === 4).length;
      const pecasN3 = pecasEstante.filter(p => p.nivel === 3).length;
      const pecasN2 = pecasEstante.filter(p => p.nivel === 2).length;
      const pecasN1 = pecasEstante.filter(p => p.nivel === 1).length;

      // Subtítulo e Categoria limpos
      const cleanTitle = est.titulo.includes('-') ? est.titulo.split('-')[1].trim() : est.titulo;

      card.innerHTML = `
        <!-- Cabeçalho do Card -->
        <div class="shelf-card-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="shelf-id-tag">${est.id}</span>
            <span class="shelf-wing-tag ${est.ala === 'Esquerda' ? 'wing-esq' : 'wing-dir'}">
              Ala ${est.ala}
            </span>
          </div>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Pos. ${est.posicao}</span>
        </div>

        <!-- Título e Subtítulo -->
        <div>
          <h4 class="shelf-card-title">${cleanTitle}</h4>
          <span class="shelf-card-subtitle">Capacidade física: ${est.capacidade_max} compartimentos</span>
        </div>

        <!-- Barra de Progresso Visual shadcn/Tailwind -->
        <div class="shelf-progress-container">
          <div class="shelf-progress-labels">
            <span class="shelf-progress-caption">Ocupação do Armazém</span>
            <span class="shelf-progress-pct" style="color: ${progressLabelColor};">
              ${est.ocupacao}/${est.capacidade_max} un (${pct}%)
            </span>
          </div>
          <div class="shelf-progress-track">
            <div class="shelf-progress-fill ${progressClass}" style="width: ${pct}%;"></div>
          </div>
        </div>

        <!-- Matriz dos 4 Níveis Verticais Isolados -->
        <div class="shelf-tiers-wrapper">
          <div class="shelf-tier-row" title="Nível 4 Topo: Caixas Kraft e Acessórios leves">
            <div class="shelf-tier-left">
              <span class="tier-code-badge tier-n4">N4</span>
              <span class="tier-desc-text">Topo • Caixas Kraft</span>
            </div>
            <span class="tier-count-pill">${pecasN4 > 0 ? pecasN4 + ' un' : 'Vazio'}</span>
          </div>

          <div class="shelf-tier-row" title="Nível 3 Médio-Alto: Peças Mecânicas Limpas">
            <div class="shelf-tier-left">
              <span class="tier-code-badge tier-n3">N3</span>
              <span class="tier-desc-text">Médio • Mecânica Limpa</span>
            </div>
            <span class="tier-count-pill">${pecasN3 > 0 ? pecasN3 + ' un' : 'Vazio'}</span>
          </div>

          <div class="shelf-tier-row" title="Nível 2 Médio-Baixo: Componentes Pesados">
            <div class="shelf-tier-left">
              <span class="tier-code-badge tier-n2">N2</span>
              <span class="tier-desc-text">Intermediário • Pesados</span>
            </div>
            <span class="tier-count-pill">${pecasN2 > 0 ? pecasN2 + ' un' : 'Vazio'}</span>
          </div>

          <div class="shelf-tier-row" title="Nível 1 Base: Bins e Rodas Paletes">
            <div class="shelf-tier-left">
              <span class="tier-code-badge tier-n1">N1</span>
              <span class="tier-desc-text">Base • Bins & Paletes</span>
            </div>
            <span class="tier-count-pill">${pecasN1 > 0 ? pecasN1 + ' un' : 'Vazio'}</span>
          </div>
        </div>

        <!-- Ação do Card -->
        <button class="shelf-filter-btn" onclick="PrateleirasModule.filtrarPorEstante('${est.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>${this.selectedEstanteId === est.id ? 'Filtro Ativo (Limpar)' : 'Ver Peças Alocadas'}</span>
        </button>
      `;

      grid.appendChild(card);
    });
  },

  filtrarPorEstante(estanteId) {
    const inputBusca = document.getElementById('input-busca-peca');
    if (this.selectedEstanteId === estanteId) {
      this.selectedEstanteId = null;
      if (inputBusca) inputBusca.value = '';
    } else {
      this.selectedEstanteId = estanteId;
      if (inputBusca) inputBusca.value = estanteId;
    }

    this.renderEstantes();
    this.renderTabelaPecas();

    // Scroll suave até a tabela do catálogo
    const tabelaContainer = document.getElementById('tabela-pecas-container');
    if (tabelaContainer) {
      tabelaContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  renderTabelaPecas() {
    const tbody = document.getElementById('tbody-pecas-estoque');
    if (!tbody) return;

    const query = (document.getElementById('input-busca-peca')?.value || '').toLowerCase();
    const catFiltro = document.getElementById('select-filtro-categoria')?.value || '';

    let filtradas = State.pecas.filter(p => {
      const matchQuery = p.descricao.toLowerCase().includes(query) ||
                         p.veiculo_origem.toLowerCase().includes(query) ||
                         p.codigo_oem.toLowerCase().includes(query) ||
                         p.id.toLowerCase().includes(query) ||
                         p.estante_id.toLowerCase().includes(query) ||
                         p.posicao.toLowerCase().includes(query);
      const matchCat = catFiltro ? p.categoria === catFiltro : true;
      return matchQuery && matchCat;
    });

    tbody.innerHTML = '';

    const counterEl = document.getElementById('contador-pecas-filtradas');
    if (counterEl) {
      counterEl.textContent = `${filtradas.length} de ${State.pecas.length} peças encontradas`;
    }

    if (filtradas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
            <div style="font-weight: 700; color: var(--text-main);">Nenhuma autopeça localizada</div>
            <div style="font-size: 0.82rem; margin-top: 0.25rem;">Tente ajustar os termos da busca ou limpe os filtros de categoria.</div>
          </td>
        </tr>
      `;
      return;
    }

    filtradas.forEach(p => {
      const tr = document.createElement('tr');
      const isDisponivel = p.status === 'Disponível';

      tr.innerHTML = `
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--text-main);">
          ${p.id}
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.9rem;">${p.descricao}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">
            OEM: <span style="font-family: var(--font-mono);">${p.codigo_oem}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-info" style="font-size: 0.72rem;">
            ${p.categoria}
          </span>
        </td>
        <td style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">
          ${p.veiculo_origem}
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span class="tier-code-badge tier-n${p.nivel || 1}">N${p.nivel || 1}</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-main); font-size: 0.85rem;">
              ${p.estante_id} / ${p.posicao}
            </span>
          </div>
        </td>
        <td>
          <span class="badge ${p.condicao.includes('A') ? 'badge-success' : 'badge-warning'}">
            ${p.condicao}
          </span>
        </td>
        <td style="font-weight: 800; color: var(--text-main); font-size: 1.05rem; font-family: var(--font-mono);">
          R$ ${p.preco_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </td>
        <td>
          ${isDisponivel 
            ? `<button class="btn btn-success btn-sm" onclick="PrateleirasModule.venderPecaNoBalcao('${p.id}')">
                Vender no Balcão
               </button>`
            : `<span class="badge" style="background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1;">Vendido</span>`
          }
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  async venderPecaNoBalcao(pecaId) {
    const peca = State.pecas.find(p => p.id === pecaId);
    if (!peca) return;

    if (!confirm(`Confirmar venda da peça "${peca.descricao}" por R$ ${peca.preco_venda.toFixed(2)}?`)) {
      return;
    }

    try {
      const res = await API.venderPeca(pecaId);
      if (res.success) {
        showToast(`Peça "${peca.descricao}" vendida com sucesso!`, 'success');
        const estoque = await API.getEstoque();
        State.setEstoque(estoque);
        const metricas = await API.getMetricas();
        State.setMetricas(metricas);
        App.updateKpis();
      }
    } catch (err) {
      showToast('Erro ao vender peça: ' + err.message, 'warning');
    }
  }
};
