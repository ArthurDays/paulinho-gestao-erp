/**
 * Módulo Planta Baixa Interativa Esquemática (Blueprint Moderno)
 * Paulinho Gestão - Ferro Velho & Auto Desmanche
 */

const FloorplanModule = {
  selectedEstanteId: null,

  init() {
    this.atualizarMetricasPlanta();
    this.bindEvents();

    State.on('estoque:updated', () => this.atualizarMetricasPlanta());
    State.on('desmanche:updated', () => this.atualizarMetricasPlanta());
  },

  bindEvents() {
    // Fechamento do Drawer Retrátil
    const btnClose = document.getElementById('btn-close-floorplan-drawer');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.fecharDrawer());
    }

    const backdrop = document.getElementById('floorplan-drawer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.fecharDrawer();
      });
    }

    // Clique em cada estante individual do blueprint
    document.querySelectorAll('.blueprint-shelf-card[data-shelf-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const shelfId = card.dataset.shelfId;
        this.abrirDrawerEstante(shelfId);
      });
    });
  },

  atualizarMetricasPlanta() {
    if (!State.estantes) return;

    State.estantes.forEach(est => {
      const pct = Math.min(100, Math.round((est.ocupacao / est.capacidade_max) * 100));
      
      // Atualizar badge %
      const elPct = document.getElementById(`bp-pct-${est.id}`);
      if (elPct) {
        elPct.textContent = `${pct}%`;
        elPct.className = `shelf-pct-badge ${
          pct >= 90 ? 'pct-danger' : pct >= 75 ? 'pct-warning' : 'pct-normal'
        }`;
      }

      // Atualizar barra de progresso
      const elBar = document.getElementById(`bp-bar-${est.id}`);
      if (elBar) {
        elBar.style.width = `${pct}%`;
        elBar.className = `shelf-bar-fill ${
          pct >= 90 ? 'fill-danger' : pct >= 75 ? 'fill-warning' : 'fill-normal'
        }`;
      }

      // Atualizar texto de contagem
      const elCount = document.getElementById(`bp-count-${est.id}`);
      if (elCount) {
        elCount.textContent = `${est.ocupacao} de ${est.capacidade_max} itens`;
      }
    });

    // Atualizar métricas do balcão na planta
    const elBalcaoKg = document.getElementById('bp-balcao-kg');
    if (elBalcaoKg) {
      elBalcaoKg.textContent = `${(State.metricas?.total_kg_hoje || 1450.5).toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg`;
    }

    const elBalcaoCompras = document.getElementById('bp-balcao-compras');
    if (elBalcaoCompras) {
      elBalcaoCompras.textContent = `R$ ${(State.metricas?.total_pago_fornecedores || 2130.8).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    const elBalcaoVendas = document.getElementById('bp-balcao-vendas');
    if (elBalcaoVendas) {
      elBalcaoVendas.textContent = `R$ ${(State.metricas?.total_vendas || 1840.0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
  },

  abrirDrawerEstante(estanteId) {
    this.selectedEstanteId = estanteId;
    const est = State.estantes.find(e => e.id === estanteId);
    if (!est) return;

    const drawer = document.getElementById('floorplan-shelf-drawer');
    const backdrop = document.getElementById('floorplan-drawer-backdrop');
    if (!drawer || !backdrop) return;

    const pct = Math.min(100, Math.round((est.ocupacao / est.capacidade_max) * 100));

    // Elementos do Drawer
    const elId = document.getElementById('drawer-shelf-id');
    const elTitulo = document.getElementById('drawer-shelf-title');
    const elAla = document.getElementById('drawer-shelf-wing');
    const elOcupacao = document.getElementById('drawer-shelf-occupancy');
    const elProgress = document.getElementById('drawer-shelf-progress-fill');
    const elPecasContainer = document.getElementById('drawer-shelf-pecas-list');

    if (elId) elId.textContent = est.id;
    if (elTitulo) elTitulo.textContent = est.titulo;
    if (elAla) elAla.textContent = `Ala ${est.ala} • Posição #${est.posicao}`;
    if (elOcupacao) elOcupacao.textContent = `${est.ocupacao} de ${est.capacidade_max} itens (${pct}%)`;
    if (elProgress) elProgress.style.width = `${pct}%`;

    // Renderiza peças alocadas
    if (elPecasContainer) {
      const pecasEstante = State.pecas.filter(p => p.estante_id === est.id);
      if (pecasEstante.length === 0) {
        elPecasContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 1.5rem;">Nenhuma peça catalogada nesta estante no momento.</div>';
      } else {
        elPecasContainer.innerHTML = pecasEstante.map(p => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0.85rem; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; margin-bottom: 0.4rem;">
            <div>
              <div style="font-weight: 700; font-size: 0.82rem; color: #0f172a;">${p.descricao}</div>
              <div style="font-size: 0.72rem; color: #64748b;">OEM: <strong style="font-family: var(--font-mono);">${p.codigo_oem}</strong> • Pos: <strong style="color: #ea580c;">${p.posicao}</strong></div>
            </div>
            <div style="text-align: right;">
              <div style="font-family: var(--font-mono); font-weight: 800; font-size: 0.85rem; color: #15803d;">R$ ${p.preco_venda.toFixed(2)}</div>
              <button onclick="PrateleirasModule.venderPecaNoBalcao('${p.id}')" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; font-weight: 700; background: #22c55e; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 0.2rem;">
                Extrair / Vender
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // Botão de Ir para Prateleiras
    const btnGo = document.getElementById('drawer-btn-view-prateleiras');
    if (btnGo) {
      btnGo.onclick = () => {
        this.fecharDrawer();
        App.switchTab('tab-prateleiras');
        if (typeof PrateleirasModule.filtrarPorEstante === 'function') {
          PrateleirasModule.filtrarPorEstante(est.id);
        }
      };
    }

    backdrop.classList.add('open');
  },

  fecharDrawer() {
    const backdrop = document.getElementById('floorplan-drawer-backdrop');
    if (backdrop) backdrop.classList.remove('open');
  }
};
