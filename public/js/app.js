/**
 * Orquestrador Geral da Aplicação (App Shell)
 * Paulinho Gestão - Ferro Velho & Auto Desmanche
 * Design System Moderno com Sidebar
 */

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-weight: 700;">${type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ'}</span>
    <span style="font-size: 0.88rem;">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

const PAGE_TITLES = {
  'tab-visao-geral': 'Planta Geral',
  'tab-balcao': 'Balcão & Balança',
  'tab-prateleiras': 'Prateleiras (Estoque)',
  'tab-desmanche': 'Desmanche (Pátio)',
  'tab-sync': 'Sincronização & Planilhas',
  'tab-specsfy': 'Terminal Specsfy'
};

const App = {
  currentTab: 'tab-visao-geral',

  async init() {
    this.bindGlobalEvents();

    try {
      // Carregamento inicial de dados da API
      const [materiais, parceiros, estoque, desmanche, metricas] = await Promise.all([
        API.getMateriais(),
        API.getParceiros(),
        API.getEstoque(),
        API.getDesmanche(),
        API.getMetricas()
      ]);

      State.setMateriais(materiais);
      State.setParceiros(parceiros);
      State.setEstoque(estoque);
      State.setVeiculos(desmanche.veiculos);
      State.setMetricas(metricas);

      // Inicialização dos submódulos
      BalcaoModule.init();
      PrateleirasModule.init();
      DesmancheModule.init();
      FloorplanModule.init();
      if (typeof SyncModule !== 'undefined') {
        SyncModule.init();
      }

      this.updateKpis();
      showToast('Sistema operacional carregado com sucesso!', 'success');
    } catch (err) {
      console.error('Erro na inicialização:', err);
      showToast('Erro ao conectar ao servidor backend: ' + err.message, 'warning');
    }
  },

  bindGlobalEvents() {
    // Sidebar navigation items
    const navItems = document.querySelectorAll('.sidebar-nav-item[data-tab]');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const target = item.dataset.tab;
        this.switchTab(target);
      });
    });

    // Floorplan hotspot navigation
    document.querySelectorAll('.hotspot-overlay[data-zone]').forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        const target = hotspot.dataset.zone;
        this.switchTab(target);
      });
    });

    // Fechamento de modais
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
        }
      });
    });

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) modal.classList.remove('open');
      });
    });

    // Impressão do Recibo Térmico
    const btnImprimir = document.getElementById('btn-imprimir-recibo-termico');
    if (btnImprimir) {
      btnImprimir.addEventListener('click', () => {
        window.print();
      });
    }

    // Controles do Terminal Specsfy
    const btnRefreshSpec = document.getElementById('btn-refresh-specsfy');
    if (btnRefreshSpec) {
      btnRefreshSpec.addEventListener('click', () => this.carregarTerminalSpecsfy('status'));
    }

    const btnTestsSpec = document.getElementById('btn-run-tests-specsfy');
    if (btnTestsSpec) {
      btnTestsSpec.addEventListener('click', () => this.carregarTerminalSpecsfy('test'));
    }
  },

  async carregarTerminalSpecsfy(cmd = 'status') {
    const el = document.getElementById('terminal-specsfy-output');
    if (!el) return;
    el.textContent = `specsfy@paulinho-gestao: ~$ specsfy ${cmd}\nExecutando comando e analisando especificações...`;

    try {
      const res = await fetch(`/api/specsfy/status?cmd=${cmd}`);
      const data = await res.json();
      el.textContent = data.output || 'Nenhuma saída retornada.';
    } catch (e) {
      el.textContent = `Erro ao carregar Specsfy: ${e.message}`;
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav-item[data-tab]').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tabId);
    });

    // Update view panels
    document.querySelectorAll('.view-panel').forEach(section => {
      section.classList.toggle('active', section.id === tabId);
    });

    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumb-page');
    if (breadcrumb && PAGE_TITLES[tabId]) {
      breadcrumb.textContent = PAGE_TITLES[tabId];
    }

    // Load specsfy terminal on tab switch
    if (tabId === 'tab-specsfy') {
      this.carregarTerminalSpecsfy('status');
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateKpis() {
    const m = State.metricas;
    const elPago = document.getElementById('kpi-total-pago');
    const elVenda = document.getElementById('kpi-total-venda');
    const elKg = document.getElementById('kpi-total-kg');
    const elPecas = document.getElementById('kpi-pecas-disponiveis');
    const elVeiculos = document.getElementById('kpi-veiculos-desmanche');

    if (elPago) elPago.textContent = `R$ ${(m.total_pago_fornecedores || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (elVenda) elVenda.textContent = `R$ ${(m.total_vendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (elKg) elKg.textContent = `${(m.total_kg_hoje || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg`;
    if (elPecas) elPecas.textContent = `${m.pecas_disponiveis || 0} un`;
    if (elVeiculos) elVeiculos.textContent = `${m.veiculos_em_desmanche || 0} ativos`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
