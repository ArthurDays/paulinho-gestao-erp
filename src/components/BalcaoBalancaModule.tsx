import React, { useState, useMemo } from 'react';
import { Material, ParceiroComercial, PesagemItem, RomaneioPesagem, TipoOperacaoPesagem, MetodoLiquidacao } from '../types/erp';

interface BalcaoBalancaModuleProps {
  materiais: Material[];
  parceiros: ParceiroComercial[];
  onSalvarRomaneio?: (romaneio: RomaneioPesagem) => void;
  onEmitirNfe?: (romaneio: RomaneioPesagem) => void;
}

export const BalcaoBalancaModule: React.FC<BalcaoBalancaModuleProps> = ({
  materiais,
  parceiros,
  onSalvarRomaneio,
  onEmitirNfe
}) => {
  // Estado da Pesagem
  const [tipoOperacao, setTipoOperacao] = useState<TipoOperacaoPesagem>('COMPRA');
  const [selectedParceiroId, setSelectedParceiroId] = useState<string>(parceiros[0]?.id || '');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materiais[0]?.id || '');
  const [modoEntrada, setModoEntrada] = useState<'SUCATA' | 'VEICULO_CDV'>('SUCATA');

  // Leituras da Balança
  const [pesoBrutoInput, setPesoBrutoInput] = useState<number>(0);
  const [taraInput, setTaraInput] = useState<number>(0);
  const [impurezaPctInput, setImpurezaPctInput] = useState<number>(0);

  // Dados de Veículo para Desmonte (caso seja CDV)
  const [cdvPlaca, setCdvPlaca] = useState<string>('');
  const [cdvModelo, setCdvModelo] = useState<string>('');
  const [cdvCertidaoBaixa, setCdvCertidaoBaixa] = useState<string>('');

  // Itens do Romaneio Atual
  const [itensRomaneio, setItensRomaneio] = useState<PesagemItem[]>([]);
  const [isModalLiquidacaoOpen, setIsModalLiquidacaoOpen] = useState<boolean>(false);

  // Material selecionado
  const materialAtual = useMemo(() => {
    return materiais.find(m => m.id === selectedMaterialId) || materiais[0];
  }, [materiais, selectedMaterialId]);

  // Parceiro selecionado
  const parceiroAtual = useMemo(() => {
    return parceiros.find(p => p.id === selectedParceiroId) || parceiros[0];
  }, [parceiros, selectedParceiroId]);

  // Cálculos em Tempo Real do Item
  const calculoItem = useMemo(() => {
    const bruto = Math.max(0, pesoBrutoInput);
    const tara = Math.max(0, taraInput);
    const liqBase = Math.max(0, bruto - tara);
    const descImpKg = liqBase * (Math.max(0, impurezaPctInput) / 100);
    const liqFinal = Math.max(0, liqBase - descImpKg);

    const precoKg = materialAtual
      ? (tipoOperacao === 'COMPRA' ? materialAtual.precoCompraKg : materialAtual.precoVendaKg)
      : 0;

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
  }, [pesoBrutoInput, taraInput, impurezaPctInput, materialAtual, tipoOperacao]);

  // Totais do Romaneio
  const totaisRomaneio = useMemo(() => {
    let brutoTot = 0;
    let taraTot = 0;
    let liqTot = 0;
    let valorTot = 0;

    itensRomaneio.forEach(it => {
      brutoTot += it.pesoBrutoKg;
      taraTot += it.taraKg;
      liqTot += it.pesoFaturadoKg;
      valorTot += it.subtotal;
    });

    return { brutoTot, taraTot, liqTot, valorTot };
  }, [itensRomaneio]);

  // Adicionar Item ao Romaneio
  const handleAddItem = () => {
    if (calculoItem.liqFinal <= 0) {
      alert('O peso líquido faturado deve ser superior a zero para adicionar ao romaneio.');
      return;
    }

    const novoItem: PesagemItem = {
      id: `ITM-${Date.now()}`,
      materialId: materialAtual.id,
      materialNome: materialAtual.nome,
      categoria: materialAtual.categoria,
      pesoBrutoKg: calculoItem.bruto,
      taraKg: calculoItem.tara,
      pesoLiquidoBaseKg: calculoItem.liqBase,
      descontoImpurezaPct: impurezaPctInput,
      descontoImpurezaKg: calculoItem.descImpKg,
      pesoFaturadoKg: calculoItem.liqFinal,
      precoUnitarioKg: calculoItem.precoKg,
      subtotal: calculoItem.subtotal
    };

    setItensRomaneio(prev => [...prev, novoItem]);
    setPesoBrutoInput(0);
    setTaraInput(0);
    setImpurezaPctInput(0);
  };

  const handleRemoverItem = (id: string) => {
    setItensRomaneio(prev => prev.filter(it => it.id !== id));
  };

  // Simular Leitura Estável da Balança
  const handleSimularLeituraBalanca = () => {
    const pesoRandom = parseFloat((Math.random() * (120 - 15) + 15).toFixed(2));
    setPesoBrutoInput(pesoRandom);
  };

  // Confirmar Liquidação Financeira
  const handleConfirmarLiquidacao = (metodo: MetodoLiquidacao) => {
    if (itensRomaneio.length === 0) return;

    const novoRomaneio: RomaneioPesagem = {
      id: `ROM-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      dataHora: new Date().toISOString(),
      tipo: tipoOperacao,
      parceiro: parceiroAtual,
      itens: itensRomaneio,
      pesoBrutoTotalKg: totaisRomaneio.brutoTot,
      taraTotalKg: totaisRomaneio.taraTot,
      pesoLiquidoTotalKg: totaisRomaneio.liqTot,
      valorTotal: totaisRomaneio.valorTot,
      metodoLiquidacao: metodo,
      status: 'LIQUIDADO',
      chaveAcessoNfe: `352609${Math.floor(Math.random() * 1e12)}550010000000011`
    };

    if (onSalvarRomaneio) onSalvarRomaneio(novoRomaneio);
    setIsModalLiquidacaoOpen(false);
    setItensRomaneio([]);
    alert(`Romaneio ${novoRomaneio.id} liquidado com sucesso via ${metodo}!`);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Header com Seletor de Tipo e Modo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚖️</span>
            <span>Balança Comercial & Triagem de Entrada</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Terminal com cálculo instantâneo de tara, cotações em tempo real e conformidade fiscal SEFAZ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor Sucata vs Veículo CDV */}
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setModoEntrada('SUCATA')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                modoEntrada === 'SUCATA'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Reciclagem (Metais)
            </button>
            <button
              onClick={() => setModoEntrada('VEICULO_CDV')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                modoEntrada === 'VEICULO_CDV'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🚗 Veículo para Baixa (CDV)
            </button>
          </div>

          {/* Tipo de Operação */}
          <select
            value={tipoOperacao}
            onChange={(e) => setTipoOperacao(e.target.value as TipoOperacaoPesagem)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white border border-slate-700 focus:outline-none"
          >
            <option value="COMPRA">COMPRA (Pagar Fornecedor/Catador)</option>
            <option value="VENDA">VENDA (Receber de Fundição/Cliente)</option>
          </select>
        </div>
      </div>

      {/* Condicional: Form de Veículo CDV (Lei 12.977) */}
      {modoEntrada === 'VEICULO_CDV' && (
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h3 className="text-sm font-bold text-orange-950 dark:text-orange-200">
                Cadastro de Entrada para Desmonte (Lei Federal 12.977 / DETRAN)
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-300">
              Rastreabilidade Obrigatória
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Placa do Veículo:</label>
              <input
                type="text"
                placeholder="Ex: ABC-1234 ou BRA2E19"
                value={cdvPlaca}
                onChange={(e) => setCdvPlaca(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Marca / Modelo / Ano:</label>
              <input
                type="text"
                placeholder="Ex: Fiat Palio Fire 1.0 2012"
                value={cdvModelo}
                onChange={(e) => setCdvModelo(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nº Certidão de Baixa DETRAN:</label>
              <input
                type="text"
                placeholder="Ex: DETRAN-SP/BAIXA-2026-9812"
                value={cdvCertidaoBaixa}
                onChange={(e) => setCdvCertidaoBaixa(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* DISPLAY DIGITAL DA BALANÇA INDUSTRIAL (Dark Glassmorphism) */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-white relative overflow-hidden">
        
        {/* Header da Balança com Indicador de Conexão */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/80 animate-pulse" />
            <div>
              <span className="font-mono text-xs font-bold tracking-widest text-slate-400 uppercase block">
                TERMINAL DE BALANÇA COMERCIAL • CALIBRAÇÃO INMETRO
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Status: Leitura Serial RS-232 / TCP Ativa</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPesoBrutoInput(0); setTaraInput(0); }}
              className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            >
              ↺ Zerar
            </button>
            <button
              onClick={() => setTaraInput(pesoBrutoInput)}
              className="px-3 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition"
            >
              🔒 Fixar Tara
            </button>
            <button
              onClick={handleSimularLeituraBalanca}
              className="px-4 py-1.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-md transition flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>Capturar Peso</span>
            </button>
          </div>
        </div>

        {/* Telões de LED Numérico */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Peso Bruto */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Peso Bruto (Balança)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-mono font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                {calculoItem.bruto.toFixed(2)}
              </span>
              <span className="text-slate-500 font-mono text-lg">kg</span>
            </div>
          </div>

          {/* Tara */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Tara Recipiente / Veículo
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-mono font-black text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                {calculoItem.tara.toFixed(2)}
              </span>
              <span className="text-slate-500 font-mono text-lg">kg</span>
            </div>
          </div>

          {/* Peso Líquido Faturado */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center justify-between">
              <span>Líquido Faturado</span>
              <span className="text-[10px] text-slate-400">(-{impurezaPctInput}% imp.)</span>
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-mono font-black text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.3)]">
                {calculoItem.liqFinal.toFixed(2)}
              </span>
              <span className="text-slate-500 font-mono text-lg">kg</span>
            </div>
          </div>
        </div>

        {/* Inputs de Controle Manual e Ajustes de Impureza */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-slate-900/50 p-4 rounded-xl border border-slate-850">
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Digitar Peso Bruto (kg):</label>
            <input
              type="number"
              step="0.01"
              value={pesoBrutoInput || ''}
              onChange={(e) => setPesoBrutoInput(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Tara Manual (kg):</label>
            <input
              type="number"
              step="0.01"
              value={taraInput || ''}
              onChange={(e) => setTaraInput(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Desconto de Impureza (%):</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="50"
              value={impurezaPctInput || ''}
              onChange={(e) => setImpurezaPctInput(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          {/* Subtotal do Item Atual e Botão de Adicionar */}
          <div className="flex items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Subtotal</span>
              <span className="text-lg font-mono font-black text-emerald-400">
                R$ {calculoItem.subtotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow transition"
            >
              + Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* GRADE TÁTIL DE COTAÇÃO DOS METAIS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cotações Diárias de Compra & Venda de Metais
            </h3>
            <span className="text-xs text-slate-500">Selecione a liga metálica para aplicar o preço unitário por quilo.</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Parceiro:</label>
            <select
              value={selectedParceiroId}
              onChange={(e) => setSelectedParceiroId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {parceiros.map(p => (
                <option key={p.id} value={p.id}>{p.nome} ({p.categoria})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {materiais.map((mat) => {
            const isSelected = selectedMaterialId === mat.id;
            const precoExibido = tipoOperacao === 'COMPRA' ? mat.precoCompraKg : mat.precoVendaKg;

            return (
              <div
                key={mat.id}
                onClick={() => setSelectedMaterialId(mat.id)}
                style={{ borderColor: isSelected ? mat.corHex : undefined }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-50 dark:bg-slate-800/80 shadow-md ring-2 ring-orange-500'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{ backgroundColor: mat.corHex }}
                    className="text-[10px] font-black text-white px-2 py-0.5 rounded-md uppercase"
                  >
                    {mat.categoria}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{mat.id}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                  {mat.nome}
                </h4>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex items-baseline justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">Preço/kg:</span>
                  <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                    R$ {precoExibido.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TABELA DO ROMANEIO EM ANDAMENTO */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Itens da Carga / Romaneio ({itensRomaneio.length})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Total Faturado: <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold">R$ {totaisRomaneio.valorTot.toFixed(2)}</strong>
            </span>

            <button
              disabled={itensRomaneio.length === 0}
              onClick={() => setIsModalLiquidacaoOpen(true)}
              className="px-5 py-2 text-xs font-extrabold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl shadow transition"
            >
              💰 Concluir e Liquidar Romaneio
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2 px-3">Item</th>
                <th className="py-2 px-3">Material</th>
                <th className="py-2 px-3">Bruto (kg)</th>
                <th className="py-2 px-3">Tara (kg)</th>
                <th className="py-2 px-3">Líquido (kg)</th>
                <th className="py-2 px-3">Preço/kg</th>
                <th className="py-2 px-3 font-mono">Subtotal</th>
                <th className="py-2 px-3 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {itensRomaneio.length > 0 ? (
                itensRomaneio.map((it, idx) => (
                  <tr key={it.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-500">#{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{it.materialNome}</td>
                    <td className="py-3 px-3 font-mono">{it.pesoBrutoKg.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono text-sky-600">{it.taraKg.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{it.pesoFaturadoKg.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono">R$ {it.precoUnitarioKg.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">R$ {it.subtotal.toFixed(2)}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleRemoverItem(it.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Nenhum item pesado ainda. Capture a leitura na balança e adicione materiais ao romaneio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE LIQUIDAÇÃO FINANCEIRA */}
      {isModalLiquidacaoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Liquidação Financeira da Balança
              </h3>
              <button
                onClick={() => setIsModalLiquidacaoOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl flex flex-col gap-1 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-medium">Parceiro Comercial:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{parceiroAtual.nome}</span>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-slate-400">Valor Total a Liquidar:</span>
                <span className="text-2xl font-mono font-black text-emerald-500">
                  R$ {totaisRomaneio.valorTot.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Escolha o Meio de Pagamento:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleConfirmarLiquidacao('PIX')}
                  className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  <span>⚡</span> PIX Instantâneo
                </button>
                <button
                  onClick={() => handleConfirmarLiquidacao('DINHEIRO')}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <span>💵</span> Dinheiro em Espécie
                </button>
                <button
                  onClick={() => handleConfirmarLiquidacao('TRANSFERENCIA')}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <span>🏦</span> TED / DOC
                </button>
                <button
                  onClick={() => handleConfirmarLiquidacao('CARTAO')}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <span>💳</span> Cartão Débito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
