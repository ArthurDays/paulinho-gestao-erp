import React, { useState, useMemo } from 'react';
import { Material, ParceiroComercial, PesagemItem, RomaneioPesagem, TipoOperacaoPesagem, MetodoLiquidacao } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface ScaleWeighingPageProps {
  materiais: Material[];
  parceiros: ParceiroComercial[];
  onRomaneioSalvo?: (romaneio: RomaneioPesagem) => void;
}

export const ScaleWeighingPage: React.FC<ScaleWeighingPageProps> = ({
  materiais,
  parceiros,
  onRomaneioSalvo
}) => {
  const { addToast } = useToast();

  const [tipoOperacao, setTipoOperacao] = useState<TipoOperacaoPesagem>('COMPRA');
  const [selectedParceiroId, setSelectedParceiroId] = useState<string>(parceiros[0]?.id || '');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materiais[0]?.id || '');

  // Entradas da Balança
  const [pesoBrutoInput, setPesoBrutoInput] = useState<number>(145.5);
  const [taraInput, setTaraInput] = useState<number>(15.0);
  const [impurezaPctInput, setImpurezaPctInput] = useState<number>(2.0);

  // Itens do Romaneio Atual
  const [itensRomaneio, setItensRomaneio] = useState<PesagemItem[]>([
    {
      id: 'ITM-001',
      materialId: 'MT-COB-01',
      materialNome: 'Cobre Mel Limpo 1ª Linha',
      categoria: 'Cobre',
      pesoBrutoKg: 52.0,
      taraKg: 2.0,
      pesoLiquidoBaseKg: 50.0,
      descontoImpurezaPct: 0.0,
      descontoImpurezaKg: 0.0,
      pesoFaturadoKg: 50.0,
      precoUnitarioKg: 42.50,
      subtotal: 2125.00
    }
  ]);

  const [isLiquidando, setIsLiquidando] = useState<boolean>(false);
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoLiquidacao>('PIX');

  const materialAtual = useMemo(() => {
    return materiais.find(m => m.id === selectedMaterialId) || materiais[0];
  }, [materiais, selectedMaterialId]);

  const parceiroAtual = useMemo(() => {
    return parceiros.find(p => p.id === selectedParceiroId) || parceiros[0];
  }, [parceiros, selectedParceiroId]);

  // Cálculos dinâmicos
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

    return { bruto, tara, liqBase, descImpKg, liqFinal, precoKg, subtotal };
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

  // Adicionar item
  const handleAddItem = () => {
    if (calculoItem.liqFinal <= 0) {
      addToast({
        title: 'Peso Inválido',
        message: 'O peso líquido faturado deve ser maior que zero.',
        type: 'warning'
      });
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

    addToast({
      title: 'Item Pesado com Sucesso',
      message: `${novoItem.pesoFaturadoKg.toFixed(1)} kg de ${novoItem.materialNome} adicionado ao romaneio.`,
      type: 'success'
    });
  };

  const handleRemoverItem = (id: string) => {
    setItensRomaneio(prev => prev.filter(it => it.id !== id));
    addToast({
      title: 'Item Removido',
      message: 'O lote foi excluído da pesagem atual.',
      type: 'info'
    });
  };

  // Simular Leitura da Balança COM3
  const handleCapturarPesoBalanca = () => {
    const randomPeso = (Math.random() * (120 - 15) + 15).toFixed(1);
    setPesoBrutoInput(parseFloat(randomPeso));
    addToast({
      title: 'Porta Serial COM3',
      message: `Peso bruto capturado: ${randomPeso} kg.`,
      type: 'info'
    });
  };

  // Finalizar e Liquidar Romaneio
  const handleFinalizarRomaneio = () => {
    if (itensRomaneio.length === 0) {
      addToast({
        title: 'Romaneio Vazio',
        message: 'Adicione pelo menos um item pesado antes de liquidar.',
        type: 'warning'
      });
      return;
    }

    const romaneio: RomaneioPesagem = {
      id: `ROM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      dataHora: new Date().toLocaleString('pt-BR'),
      tipo: tipoOperacao,
      parceiro: parceiroAtual,
      itens: itensRomaneio,
      pesoBrutoTotalKg: totaisRomaneio.brutoTot,
      taraTotalKg: totaisRomaneio.taraTot,
      pesoLiquidoTotalKg: totaisRomaneio.liqTot,
      valorTotal: totaisRomaneio.valorTot,
      metodoLiquidacao: metodoPagamento,
      status: 'LIQUIDADO',
      chaveAcessoNfe: `3526${Math.floor(100000000000000000 + Math.random() * 900000000000000000)}`
    };

    if (onRomaneioSalvo) {
      onRomaneioSalvo(romaneio);
    }

    addToast({
      title: 'Romaneio Liquidado com Sucesso!',
      message: `${romaneio.id} - R$ ${romaneio.valorTotal.toFixed(2)} pago via ${metodoPagamento}.`,
      type: 'success'
    });

    setItensRomaneio([]);
    setIsLiquidando(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Operacional da Balança */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Terminal de Pesagem & Triagem de Metais
            </h2>
            <p className="text-xs text-slate-500">
              Classificação automatizada, pesagem de tara e desconto de impurezas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Seletor Tipo Operação */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setTipoOperacao('COMPRA')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                tipoOperacao === 'COMPRA'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Compra (Entrada)
            </button>
            <button
              onClick={() => setTipoOperacao('VENDA')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                tipoOperacao === 'VENDA'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Venda (Saída)
            </button>
          </div>

          <Badge variant="emerald" dot size="sm">Balança Filizola COM3 Conectada</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Painel Esquerdo: Entrada de Dados e Captura (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card: Fornecedor e Material */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              1. Identificação do Fornecedor & Material
            </h3>

            {/* Parceiro */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fornecedor / Catador Credenciado
              </label>
              <select
                value={selectedParceiroId}
                onChange={(e) => setSelectedParceiroId(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {parceiros.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.categoria}) - {p.documento}
                  </option>
                ))}
              </select>
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Material / Liga Metálica
              </label>
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {materiais.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.nome} — R$ {(tipoOperacao === 'COMPRA' ? m.precoCompraKg : m.precoVendaKg).toFixed(2)}/kg
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Card: Leitura da Balança */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                2. Pesagem Industrial & Impurezas
              </h3>
              <button
                onClick={handleCapturarPesoBalanca}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                Capturar COM3
              </button>
            </div>

            {/* Display Estilo Balança Digital */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                Peso Líquido Faturado
              </span>
              <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                {calculoItem.liqFinal.toFixed(2)} <span className="text-lg font-normal text-emerald-600">kg</span>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Subtotal: R$ {calculoItem.subtotal.toFixed(2)}
              </div>
            </div>

            {/* Inputs de Peso Bruto, Tara e Impureza */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Peso Bruto (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={pesoBrutoInput || ''}
                  onChange={(e) => setPesoBrutoInput(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Tara Recipiente (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taraInput || ''}
                  onChange={(e) => setTaraInput(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Impureza (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={impurezaPctInput || ''}
                  onChange={(e) => setImpurezaPctInput(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Botão Adicionar Item */}
            <button
              onClick={handleAddItem}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Adicionar ao Romaneio</span>
            </button>
          </div>

        </div>

        {/* Painel Direito: Romaneio em Andamento (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Romaneio de Pesagem
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {parceiroAtual.nome} • {itensRomaneio.length} itens pesados
                </span>
              </div>
              <Badge variant="blue" size="sm">Aguardando Liquidação</Badge>
            </div>

            {/* Tabela de Itens */}
            {itensRomaneio.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-mono">
                Nenhum item adicionado à pesagem. Capture o peso na balança e adicione.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 uppercase font-mono">
                      <th className="py-2">Material</th>
                      <th className="py-2 text-right">Bruto/Tara</th>
                      <th className="py-2 text-right">Imp. (%)</th>
                      <th className="py-2 text-right">Faturado</th>
                      <th className="py-2 text-right">R$/kg</th>
                      <th className="py-2 text-right">Subtotal</th>
                      <th className="py-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {itensRomaneio.map(it => (
                      <tr key={it.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">
                          {it.materialNome}
                        </td>
                        <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">
                          {it.pesoBrutoKg} / {it.taraKg} kg
                        </td>
                        <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">
                          {it.descontoImpurezaPct}%
                        </td>
                        <td className="py-2.5 text-right font-bold text-slate-900 dark:text-slate-100">
                          {it.pesoFaturadoKg.toFixed(1)} kg
                        </td>
                        <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">
                          R$ {it.precoUnitarioKg.toFixed(2)}
                        </td>
                        <td className="py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          R$ {it.subtotal.toFixed(2)}
                        </td>
                        <td className="py-2.5 text-center">
                          <button
                            onClick={() => handleRemoverItem(it.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                            title="Remover Item"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Rodapé de Liquidação */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Peso Total Líquido Faturado:</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200 text-sm">
                {totaisRomaneio.liqTot.toFixed(1)} kg
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono block">Valor Total a Pagar</span>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
                  R$ {totaisRomaneio.valorTot.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Seletor Forma de Pagamento */}
              <div className="flex items-center gap-2">
                <select
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value as MetodoLiquidacao)}
                  className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200"
                >
                  <option value="PIX">Chave Pix</option>
                  <option value="DINHEIRO">Dinheiro Espécie</option>
                  <option value="TRANSFERENCIA">Transferência TED</option>
                </select>

                <button
                  onClick={handleFinalizarRomaneio}
                  disabled={itensRomaneio.length === 0}
                  className="py-2 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Liquidar & Emitir NF-e</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
