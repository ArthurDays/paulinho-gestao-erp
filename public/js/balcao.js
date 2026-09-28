/**
 * Módulo Balcão & Balança Comercial (Zona Azul)
 * Paulinho Gestão
 */

const BalcaoModule = {
  init() {
    this.bindEvents();
    this.renderMateriais();
    this.renderParceiros();
    this.updateScaleDisplay();
  },

  bindEvents() {
    // Input manual ou leitura de peso bruto
    const inputBruto = document.getElementById('input-peso-bruto');
    if (inputBruto) {
      inputBruto.addEventListener('input', (e) => {
        State.pesagemAtual.pesoBruto = parseFloat(e.target.value) || 0;
        this.updateScaleDisplay();
      });
    }

    // Input de tara
    const inputTara = document.getElementById('input-tara');
    if (inputTara) {
      inputTara.addEventListener('input', (e) => {
        State.pesagemAtual.tara = parseFloat(e.target.value) || 0;
        this.updateScaleDisplay();
      });
    }

    // Input de impureza
    const inputImpureza = document.getElementById('input-impureza');
    if (inputImpureza) {
      inputImpureza.addEventListener('input', (e) => {
        State.pesagemAtual.descontoImpurezaPct = parseFloat(e.target.value) || 0;
        this.updateScaleDisplay();
      });
    }

    // Botão Zerar
    const btnZero = document.getElementById('btn-scale-zero');
    if (btnZero) {
      btnZero.addEventListener('click', () => {
        State.pesagemAtual.pesoBruto = 0;
        if (inputBruto) inputBruto.value = '';
        this.updateScaleDisplay();
        showToast('Balança Zerada com sucesso', 'info');
      });
    }

    // Botão Tarar
    const btnTara = document.getElementById('btn-scale-tara');
    if (btnTara) {
      btnTara.addEventListener('click', () => {
        State.pesagemAtual.tara = State.pesagemAtual.pesoBruto;
        if (inputTara) inputTara.value = State.pesagemAtual.tara.toFixed(2);
        this.updateScaleDisplay();
        showToast(`Tara bloqueada em ${State.pesagemAtual.tara.toFixed(2)} kg`, 'info');
      });
    }

    // Botão Simular Balança
    const btnSimular = document.getElementById('btn-scale-simular');
    if (btnSimular) {
      btnSimular.addEventListener('click', () => {
        // Gera um peso randômico realista entre 12.0 e 85.0 kg
        const randPeso = (Math.random() * (75.0 - 8.0) + 8.0).toFixed(2);
        State.pesagemAtual.pesoBruto = parseFloat(randPeso);
        if (inputBruto) inputBruto.value = randPeso;
        this.updateScaleDisplay();
        showToast(`Leitura capturada da Balança: ${randPeso} kg`, 'success');
      });
    }

    // Alternar Tipo: Compra (Pagar Fornecedor) vs Venda (Receber)
    const selectTipo = document.getElementById('select-operacao-tipo');
    if (selectTipo) {
      selectTipo.addEventListener('change', (e) => {
        State.pesagemAtual.tipo = e.target.value;
        this.renderMateriais();
        this.updateScaleDisplay();
      });
    }

    // Seletor de Parceiro
    const selectParceiro = document.getElementById('select-parceiro');
    if (selectParceiro) {
      selectParceiro.addEventListener('change', (e) => {
        const id = e.target.value;
        State.pesagemAtual.parceiroSelecionado = State.parceiros.find(p => p.id === id) || null;
      });
    }

    // Botão Adicionar Item ao Romaneio
    const btnAdd = document.getElementById('btn-add-item-pesagem');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => this.adicionarItem());
    }

    // Botão Finalizar e Pagar/Receber
    const btnLiquidar = document.getElementById('btn-liquidar-pesagem');
    if (btnLiquidar) {
      btnLiquidar.addEventListener('click', () => this.abrirModalLiquidacao());
    }

    // Botão Limpar Romaneio
    const btnLimpar = document.getElementById('btn-limpar-romaneio');
    if (btnLimpar) {
      btnLimpar.addEventListener('click', () => this.limparRomaneio());
    }

    // Atualização de eventos do State
    State.on('materiais:updated', () => this.renderMateriais());
    State.on('parceiros:updated', () => this.renderParceiros());
  },

  updateScaleDisplay() {
    const calc = State.calcularItemAtual();
    const elBruto = document.getElementById('display-peso-bruto');
    const elTara = document.getElementById('display-peso-tara');
    const elLiq = document.getElementById('display-peso-liquido');
    const elSubtotal = document.getElementById('display-subtotal-item');

    if (elBruto) elBruto.textContent = calc.bruto.toFixed(2);
    if (elTara) elTara.textContent = calc.tara.toFixed(2);
    if (elLiq) elLiq.textContent = calc.liqFinal.toFixed(2);
    if (elSubtotal) elSubtotal.textContent = `R$ ${calc.subtotal.toFixed(2)}`;
  },

  renderMateriais() {
    const container = document.getElementById('material-selector-grid');
    if (!container) return;

    container.innerHTML = '';
    const isCompra = State.pesagemAtual.tipo === 'COMPRA';

    State.materiais.forEach(mat => {
      const card = document.createElement('div');
      card.className = `material-card ${State.pesagemAtual.materialSelecionado?.id === mat.id ? 'selected' : ''}`;
      card.style.setProperty('--card-accent', mat.cor);

      const precoExibido = isCompra ? mat.preco_compra_kg : mat.preco_venda_kg;

      card.innerHTML = `
        <div class="material-card-header">
          <span class="material-badge" style="background: ${mat.cor};">${mat.categoria}</span>
          <span style="font-size: 0.75rem; color: var(--text-dim);">${mat.id}</span>
        </div>
        <div class="material-name">${mat.nome}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; line-height: 1.2;">
          ${mat.descricao}
        </div>
        <div class="material-price">
          R$ ${precoExibido.toFixed(2)}
          <span class="material-price-label">/ kg (${isCompra ? 'Compra' : 'Venda'})</span>
        </div>
      `;

      card.addEventListener('click', () => {
        State.pesagemAtual.materialSelecionado = mat;
        document.querySelectorAll('.material-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        // Aplica tolerância de impureza padrão se não tiver
        const inputImp = document.getElementById('input-impureza');
        if (inputImp && !inputImp.value) {
          inputImp.value = '0';
          State.pesagemAtual.descontoImpurezaPct = 0;
        }

        this.updateScaleDisplay();
      });

      container.appendChild(card);
    });
  },

  renderParceiros() {
    const select = document.getElementById('select-parceiro');
    if (!select) return;

    select.innerHTML = '<option value="">-- Selecione Fornecedor ou Cliente --</option>';
    State.parceiros.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.nome} (${p.categoria} - ${p.documento})`;
      select.appendChild(opt);
    });

    if (State.parceiros.length > 0 && !State.pesagemAtual.parceiroSelecionado) {
      State.pesagemAtual.parceiroSelecionado = State.parceiros[0];
      select.value = State.parceiros[0].id;
    }
  },

  adicionarItem() {
    const mat = State.pesagemAtual.materialSelecionado;
    if (!mat) {
      showToast('Selecione um material antes de adicionar!', 'warning');
      return;
    }

    const calc = State.calcularItemAtual();
    if (calc.bruto <= 0) {
      showToast('O peso bruto deve ser superior a zero!', 'warning');
      return;
    }

    if (calc.tara >= calc.bruto) {
      showToast('A tara não pode ser maior ou igual ao peso bruto!', 'warning');
      return;
    }

    const novoItem = {
      id: 'ITM-' + Date.now(),
      material_id: mat.id,
      material_nome: mat.nome,
      categoria: mat.categoria,
      cor: mat.cor,
      peso_bruto: calc.bruto,
      tara: calc.tara,
      peso_liquido: calc.liqBase,
      impureza_pct: parseFloat(State.pesagemAtual.descontoImpurezaPct) || 0,
      peso_faturado: calc.liqFinal,
      preco_unitario: calc.precoKg,
      subtotal: calc.subtotal
    };

    State.pesagemAtual.itens.push(novoItem);
    this.renderTabelaRomaneio();

    // Limpa balança para o próximo metal
    State.pesagemAtual.pesoBruto = 0;
    State.pesagemAtual.tara = 0;
    const inBruto = document.getElementById('input-peso-bruto');
    const inTara = document.getElementById('input-tara');
    if (inBruto) inBruto.value = '';
    if (inTara) inTara.value = '';
    this.updateScaleDisplay();

    showToast(`Adicionado: ${novoItem.peso_faturado.toFixed(2)} kg de ${mat.nome}`, 'success');
  },

  removerItem(index) {
    State.pesagemAtual.itens.splice(index, 1);
    this.renderTabelaRomaneio();
  },

  renderTabelaRomaneio() {
    const tbody = document.getElementById('tbody-romaneio');
    const footTot = document.getElementById('tfoot-total');
    if (!tbody) return;

    tbody.innerHTML = '';
    const itens = State.pesagemAtual.itens;

    if (itens.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: var(--text-dim); padding: 2rem;">
            Nenhum material pesado ainda neste romaneio. Selecione o material acima e capture o peso.
          </td>
        </tr>
      `;
      if (footTot) footTot.innerHTML = '';
      return;
    }

    itens.forEach((it, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>#${idx + 1}</strong></td>
        <td>
          <span class="material-badge" style="background: ${it.cor};">${it.categoria}</span>
          <strong>${it.material_nome}</strong>
        </td>
        <td>${it.peso_bruto.toFixed(2)} kg</td>
        <td>${it.tara.toFixed(2)} kg</td>
        <td>${it.peso_liquido.toFixed(2)} kg</td>
        <td>${it.impureza_pct > 0 ? it.impureza_pct + '%' : '-'}</td>
        <td style="color: #38bdf8; font-weight: 700;">${it.peso_faturado.toFixed(2)} kg</td>
        <td>R$ ${it.preco_unitario.toFixed(2)}</td>
        <td style="font-weight: 700; color: #4ade80;">R$ ${it.subtotal.toFixed(2)}</td>
        <td>
          <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; color: #ef4444;" onclick="BalcaoModule.removerItem(${idx})">
            ✕
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    const tot = State.calcularTotalRomaneio();
    if (footTot) {
      footTot.innerHTML = `
        <tr class="table-total-row">
          <td colspan="2">TOTAL DO ROMANEIO</td>
          <td>${tot.brutoTotal.toFixed(2)} kg</td>
          <td>${tot.taraTotal.toFixed(2)} kg</td>
          <td colspan="2">-</td>
          <td style="color: #38bdf8;">${tot.liquidoTotal.toFixed(2)} kg</td>
          <td>-</td>
          <td colspan="2" style="color: #4ade80; font-size: 1.25rem;">R$ ${tot.valorTotal.toFixed(2)}</td>
        </tr>
      `;
    }
  },

  limparRomaneio() {
    State.pesagemAtual.itens = [];
    State.pesagemAtual.pesoBruto = 0;
    State.pesagemAtual.tara = 0;
    this.renderTabelaRomaneio();
    this.updateScaleDisplay();
    showToast('Romaneio limpo', 'info');
  },

  abrirModalLiquidacao() {
    if (State.pesagemAtual.itens.length === 0) {
      showToast('Adicione ao menos um item de material ao romaneio!', 'warning');
      return;
    }

    const parceiro = State.pesagemAtual.parceiroSelecionado;
    if (!parceiro) {
      showToast('Selecione o Fornecedor ou Cliente para liquidar a pesagem!', 'warning');
      return;
    }

    const tot = State.calcularTotalRomaneio();
    const modal = document.getElementById('modal-liquidacao');
    const valorEl = document.getElementById('modal-liq-valor');
    const parceiroEl = document.getElementById('modal-liq-parceiro');
    const tipoEl = document.getElementById('modal-liq-tipo');

    if (valorEl) valorEl.textContent = `R$ ${tot.valorTotal.toFixed(2)}`;
    if (parceiroEl) parceiroEl.textContent = `${parceiro.nome} (${parceiro.documento})`;
    if (tipoEl) {
      tipoEl.textContent = State.pesagemAtual.tipo === 'COMPRA' ? 'PAGAMENTO A FORNECEDOR (Saída)' : 'RECEBIMENTO DE CLIENTE (Entrada)';
      tipoEl.style.color = State.pesagemAtual.tipo === 'COMPRA' ? '#f87171' : '#4ade80';
    }

    if (modal) modal.classList.add('open');
  },

  async confirmarLiquidacao(metodo) {
    const parceiro = State.pesagemAtual.parceiroSelecionado;
    const tot = State.calcularTotalRomaneio();

    const novoRomaneio = {
      tipo: State.pesagemAtual.tipo,
      parceiro_id: parceiro ? parceiro.id : 'AVULSO',
      parceiro_nome: parceiro ? parceiro.nome : 'Cliente Avulso',
      operador: 'Paulinho (Balcão 01)',
      itens: State.pesagemAtual.itens,
      peso_bruto_total: tot.brutoTotal,
      tara_total: tot.taraTotal,
      peso_liquido_total: tot.liquidoTotal,
      valor_total: tot.valorTotal,
      metodo_pagamento: metodo,
      observacoes: `Operação concluída via ${metodo}. Balcão de atendimento.`
    };

    try {
      const res = await API.salvarPesagem(novoRomaneio);
      if (res.success) {
        document.getElementById('modal-liquidacao').classList.remove('open');
        showToast('Pesagem liquidada e registrada com sucesso!', 'success');
        
        // Atualiza métricas
        const metricas = await API.getMetricas();
        State.setMetricas(metricas);
        App.updateKpis();

        // Abre o comprovante térmico para visualização e impressão
        this.exibirReciboTermico(res.romaneio);
        this.limparRomaneio();
      }
    } catch (err) {
      showToast('Erro ao salvar pesagem no servidor: ' + err.message, 'warning');
    }
  },

  exibirReciboTermico(romaneio) {
    const modal = document.getElementById('modal-recibo');
    const corpo = document.getElementById('recibo-conteudo');
    if (!corpo || !modal) return;

    const dataFormatada = new Date(romaneio.data_hora).toLocaleString('pt-BR');

    let linhasItens = '';
    romaneio.itens.forEach(it => {
      linhasItens += `
        <div class="receipt-item-row">
          <span>${it.material_nome}</span>
        </div>
        <div class="receipt-item-row" style="color: #444; font-size: 0.8rem;">
          <span>${it.peso_faturado.toFixed(2)}kg x R$${it.preco_unitario.toFixed(2)}</span>
          <span>R$ ${it.subtotal.toFixed(2)}</span>
        </div>
      `;
    });

    corpo.innerHTML = `
      <div class="receipt-header">
        <div class="receipt-title">PAULINHO RECICLAGEM & DESMANCHE</div>
        <div style="font-size: 0.75rem;">CNPJ: 18.922.381/0001-40 - INSC: ISENTO</div>
        <div style="font-size: 0.75rem;">Rua do Aço, 450 - Polo Industrial</div>
        <div style="font-size: 0.75rem;">Tel: (11) 3982-1000 / WhatsApp Balcão</div>
      </div>

      <div style="font-size: 0.8rem; margin-bottom: 0.5rem;">
        <div><strong>TICKET:</strong> ${romaneio.id}</div>
        <div><strong>DATA/HORA:</strong> ${dataFormatada}</div>
        <div><strong>TIPO:</strong> ${romaneio.tipo === 'COMPRA' ? 'COMPRA DE SUCATA / PAGAMENTO' : 'VENDA DE MATERIAL / ENTRADA'}</div>
        <div><strong>OPERADOR:</strong> ${romaneio.operador}</div>
        <div><strong>PARCEIRO:</strong> ${romaneio.parceiro_nome}</div>
      </div>

      <div class="receipt-divider"></div>
      <div style="font-size: 0.8rem; font-weight: 700; margin-bottom: 0.4rem;">DISCRIMINAÇÃO DOS MATERIAIS:</div>
      ${linhasItens}

      <div class="receipt-divider"></div>
      <div class="receipt-item-row">
        <span>PESO BRUTO TOTAL:</span>
        <span>${romaneio.peso_bruto_total.toFixed(2)} kg</span>
      </div>
      <div class="receipt-item-row">
        <span>TARA TOTAL:</span>
        <span>${romaneio.tara_total.toFixed(2)} kg</span>
      </div>
      <div class="receipt-item-row">
        <span>PESO LÍQUIDO FATURADO:</span>
        <span>${romaneio.peso_liquido_total.toFixed(2)} kg</span>
      </div>

      <div class="receipt-divider"></div>
      <div class="receipt-total">
        <span>VALOR TOTAL:</span>
        <span>R$ ${romaneio.valor_total.toFixed(2)}</span>
      </div>
      <div class="receipt-item-row" style="font-weight: 700;">
        <span>FORMA DE LIQUIDAÇÃO:</span>
        <span>${romaneio.metodo_pagamento}</span>
      </div>

      <div class="receipt-signatures">
        <div>
          <div class="signature-line">ASSINATURA DO FORNECEDOR / CLIENTE</div>
        </div>
        <div>
          <div class="signature-line">CONFERÊNCIA DA BALANÇA / PAULINHO GESTÃO</div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 1rem; font-size: 0.7rem; color: #555;">
        * Documento operacional sem valor fiscal - Conforme Lei 12.977/2014 *
      </div>
    `;

    modal.classList.add('open');
  }
};
