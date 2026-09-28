/**
 * Módulo de Sincronização de Inventário & Planilhas (CSV / Google Sheets)
 * Paulinho Gestão - Ferro Velho & Auto Desmanche
 */

const SyncModule = {
  parsedRows: [],
  syncHistorico: [],

  async init() {
    this.bindEvents();
    await this.carregarHistorico();
  },

  bindEvents() {
    // Botão de Download do Template CSV
    const btnDownload = document.getElementById('btn-download-template-csv');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        window.location.href = API.getTemplateCsvUrl();
        showToast('Template CSV baixado com sucesso!', 'info');
      });
    }

    // Input de Arquivo CSV
    const fileInput = document.getElementById('sync-csv-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const textarea = document.getElementById('sync-csv-textarea');
          if (textarea) textarea.value = content;
          this.parseAndPreview(content);
        };
        reader.readAsText(file, 'UTF-8');
      });
    }

    // Botão de Processar Pré-visualização
    const btnPreview = document.getElementById('btn-sync-preview');
    if (btnPreview) {
      btnPreview.addEventListener('click', () => {
        const textarea = document.getElementById('sync-csv-textarea');
        const content = textarea ? textarea.value.trim() : '';
        if (!content) {
          showToast('Cole o conteúdo CSV ou selecione um arquivo primeiro.', 'warning');
          return;
        }
        this.parseAndPreview(content);
      });
    }

    // Botão de Confirmar Sincronização
    const btnConfirmSync = document.getElementById('btn-confirm-sync');
    if (btnConfirmSync) {
      btnConfirmSync.addEventListener('click', () => this.executarSincronizacao());
    }

    // Botão de Disparo do Webhook Google Sheets
    const btnTriggerWebhook = document.getElementById('btn-trigger-webhook-sync');
    if (btnTriggerWebhook) {
      btnTriggerWebhook.addEventListener('click', () => this.dispararWebhookSheets());
    }

    // Botão de Limpar Área
    const btnClear = document.getElementById('btn-sync-clear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        const textarea = document.getElementById('sync-csv-textarea');
        if (textarea) textarea.value = '';
        this.parsedRows = [];
        this.renderPreviewTable([]);
        const btnSync = document.getElementById('btn-confirm-sync');
        if (btnSync) btnSync.disabled = true;
      });
    }
  },

  async carregarHistorico() {
    try {
      this.syncHistorico = await API.getSyncHistorico();
      this.renderHistoricoTable(this.syncHistorico);
    } catch (e) {
      console.warn('Erro ao carregar histórico de sync:', e);
    }
  },

  parseAndPreview(csvText) {
    const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) {
      showToast('O arquivo CSV deve conter cabeçalho e ao menos uma linha de dados.', 'warning');
      return;
    }

    const separator = lines[0].includes(';') ? ';' : ',';
    const rows = [];

    // Ignora linha 0 (cabeçalho)
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(separator);
      if (cols.length >= 6) {
        rows.push({
          id: cols[0] ? cols[0].trim() : `PC-AUTO-${i}`,
          codigo_oem: cols[1] ? cols[1].trim() : 'OEM-PENDENTE',
          descricao: cols[2] ? cols[2].trim() : 'Peça Desconhecida',
          categoria: cols[3] ? cols[3].trim() : 'Geral',
          veiculo_origem: cols[4] ? cols[4].trim() : 'N/A',
          estante_id: cols[5] ? cols[5].trim() : 'EST-01',
          nivel: cols[6] ? parseInt(cols[6].trim(), 10) || 2 : 2,
          posicao: cols[7] ? cols[7].trim() : 'N2-P01',
          preco_custo: cols[8] ? parseFloat(cols[8].trim()) || 0 : 0,
          preco_venda: cols[9] ? parseFloat(cols[9].trim()) || 0 : 0,
          quantidade: cols[10] ? parseInt(cols[10].trim(), 10) || 1 : 1,
          condicao: cols[11] ? cols[11].trim() : 'Grau B - Bom Estado'
        });
      }
    }

    this.parsedRows = rows;
    this.renderPreviewTable(rows);

    const btnSync = document.getElementById('btn-confirm-sync');
    if (btnSync) {
      btnSync.disabled = rows.length === 0;
    }

    const countBadge = document.getElementById('sync-preview-count');
    if (countBadge) {
      countBadge.textContent = `${rows.length} registros prontos para sincronização`;
    }

    showToast(`${rows.length} itens extraídos e prontos para conferência.`, 'info');
  },

  renderPreviewTable(rows) {
    const tbody = document.getElementById('sync-preview-tbody');
    if (!tbody) return;

    if (rows.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            Nenhum dado carregado. Selecione um arquivo CSV ou cole dados para pré-visualizar.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = rows.map((r, idx) => `
      <tr>
        <td style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">${r.id}</td>
        <td>
          <span style="font-family: var(--font-mono); font-weight: 700; color: var(--primary); background: rgba(234,88,12,0.08); padding: 0.2rem 0.4rem; border-radius: 4px;">
            ${r.codigo_oem}
          </span>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${r.descricao}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${r.veiculo_origem}</div>
        </td>
        <td>
          <span class="badge" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; font-size: 0.75rem;">
            ${r.categoria}
          </span>
        </td>
        <td>
          <span style="font-weight: 700; color: #0284c7;">${r.estante_id}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">(${r.posicao})</span>
        </td>
        <td style="font-weight: 700; color: #16a34a; font-family: var(--font-mono);">
          R$ ${r.preco_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </td>
        <td style="text-align: center; font-weight: 700;">${r.quantidade}</td>
        <td>
          <span class="badge" style="background: rgba(34, 197, 94, 0.1); color: #16a34a; font-size: 0.75rem;">
            Validado
          </span>
        </td>
      </tr>
    `).join('');
  },

  renderHistoricoTable(historico) {
    const tbody = document.getElementById('sync-historico-tbody');
    if (!tbody) return;

    if (!historico || historico.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            Nenhuma sincronização registrada até o momento.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = historico.map(h => `
      <tr>
        <td style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">${h.id}</td>
        <td style="font-size: 0.82rem; color: var(--text-muted);">${new Date(h.data_hora).toLocaleString('pt-BR')}</td>
        <td>
          <span class="badge" style="background: ${h.origem.includes('CSV') ? 'rgba(2, 132, 199, 0.1)' : 'rgba(234, 88, 12, 0.1)'}; color: ${h.origem.includes('CSV') ? '#0284c7' : '#ea580c'}; font-size: 0.75rem;">
            ${h.origem}
          </span>
        </td>
        <td style="font-weight: 700; color: #16a34a;">+${h.itens_adicionados} novos</td>
        <td style="font-weight: 700; color: #eab308;">${h.itens_atualizados} atualizados</td>
        <td>
          <span class="badge" style="background: rgba(34, 197, 94, 0.1); color: #16a34a; font-weight: 700; font-size: 0.75rem;">
            ${h.status}
          </span>
        </td>
      </tr>
    `).join('');
  },

  async executarSincronizacao() {
    const textarea = document.getElementById('sync-csv-textarea');
    const csvContent = textarea ? textarea.value.trim() : '';

    if (!csvContent && this.parsedRows.length === 0) {
      showToast('Nenhum dado para sincronizar.', 'warning');
      return;
    }

    const btnSync = document.getElementById('btn-confirm-sync');
    if (btnSync) {
      btnSync.disabled = true;
      btnSync.innerHTML = '<span class="loading-spinner"></span> Sincronizando...';
    }

    try {
      const payload = csvContent ? { csv_text: csvContent } : { items: this.parsedRows };
      const res = await API.importarPlanilha(payload);

      if (res.success) {
        showToast(`Sucesso! ${res.adicionados} novos itens e ${res.atualizados} atualizados.`, 'success');
        
        // Recarregar estoque no app
        const novoEstoque = await API.getEstoque();
        State.setEstoque(novoEstoque);
        PrateleirasModule.renderEstoque();
        PrateleirasModule.renderEstantes();

        // Atualizar métricas
        const metricas = await API.getMetricas();
        State.setMetricas(metricas);
        App.updateKpis();

        // Recarregar histórico
        await this.carregarHistorico();

        // Limpar área de preview
        if (textarea) textarea.value = '';
        this.parsedRows = [];
        this.renderPreviewTable([]);
      } else {
        showToast('Erro ao sincronizar dados: ' + (res.message || 'Erro desconhecido'), 'warning');
      }
    } catch (e) {
      console.error('Erro na sincronização:', e);
      showToast('Falha na conexão com o servidor ao sincronizar: ' + e.message, 'warning');
    } finally {
      if (btnSync) {
        btnSync.disabled = false;
        btnSync.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Confirmar & Sincronizar ao Banco
        `;
      }
    }
  },

  async dispararWebhookSheets() {
    const btnWebhook = document.getElementById('btn-trigger-webhook-sync');
    if (btnWebhook) {
      btnWebhook.disabled = true;
      btnWebhook.innerHTML = '<span class="loading-spinner"></span> Conectando ao Google Sheets API...';
    }

    // Exemplo de carga remota do Google Sheets
    const sampleItems = [
      {
        codigo_oem: "04E145749F",
        descricao: "Intercooler Radiador de Ar Turbo Jetta TSI",
        categoria: "Mecânica",
        veiculo_origem: "Volkswagen Jetta TSI 2.0 (VD-001)",
        estante_id: "EST-03",
        nivel: 2,
        posicao: "N2-P04",
        preco_custo: 280.0,
        preco_venda: 740.0,
        quantidade: 1,
        condicao: "Grau A - Excelente"
      },
      {
        codigo_oem: "51989021-ALT",
        descricao: "Bomba Direção Eletro-Hidráulica Compass",
        categoria: "Direção",
        veiculo_origem: "Jeep Compass Longitude (VD-002)",
        estante_id: "EST-06",
        nivel: 3,
        posicao: "N3-CX08",
        preco_custo: 350.0,
        preco_venda: 890.0,
        quantidade: 2,
        condicao: "Grau A - Excelente"
      },
      {
        codigo_oem: "7089123-VALV",
        descricao: "Válvula Termostática com Carcaça Alumínio Onix",
        categoria: "Arrefecimento",
        veiculo_origem: "Chevrolet Onix Plus 1.0 (VD-003)",
        estante_id: "EST-04",
        nivel: 1,
        posicao: "N1-P02",
        preco_custo: 65.0,
        preco_venda: 210.0,
        quantidade: 3,
        condicao: "Grau A - Excelente"
      }
    ];

    try {
      const res = await API.importarPlanilha({ items: sampleItems });
      if (res.success) {
        showToast(`Webhook executado! ${res.adicionados} novos itens e ${res.atualizados} atualizados direto do Google Sheets.`, 'success');
        
        const novoEstoque = await API.getEstoque();
        State.setEstoque(novoEstoque);
        PrateleirasModule.renderEstoque();
        PrateleirasModule.renderEstantes();

        const metricas = await API.getMetricas();
        State.setMetricas(metricas);
        App.updateKpis();

        await this.carregarHistorico();
      }
    } catch (e) {
      showToast('Erro ao acionar webhook: ' + e.message, 'warning');
    } finally {
      if (btnWebhook) {
        btnWebhook.disabled = false;
        btnWebhook.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Sincronizar Planilha Agora (Webhook)
        `;
      }
    }
  }
};
