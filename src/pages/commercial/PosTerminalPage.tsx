import React, { useState, useEffect } from 'react';
import { PecaEstoque, ParceiroComercial, MetodoLiquidacao } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import { barcodeScannerService } from '../../services/barcodeScannerService';
import { syncQueueService } from '../../services/syncQueueService';

interface PosTerminalPageProps {
  pecas: PecaEstoque[];
  parceiros: ParceiroComercial[];
  onFinalizarVenda?: (venda: any) => void;
}

interface CartItem {
  peca: PecaEstoque;
  quantidade: number;
  desconto: number;
}

export const PosTerminalPage: React.FC<PosTerminalPageProps> = ({
  pecas,
  parceiros,
  onFinalizarVenda
}) => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParceiroId, setSelectedParceiroId] = useState<string>(parceiros[4]?.id || '');
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoLiquidacao>('PIX');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Carrinho
  const [carrinho, setCarrinho] = useState<CartItem[]>([
    {
      peca: pecas[0],
      quantidade: 1,
      desconto: 0
    }
  ]);

  const pecasDisponiveis = pecas.filter(p => p.status === 'Disponível');
  const pecasFiltradas = pecasDisponiveis.filter(p => 
    p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigoOem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBruto = carrinho.reduce((acc, item) => acc + (item.peca.precoVenda * item.quantidade), 0);
  const totalDescontos = carrinho.reduce((acc, item) => acc + item.desconto, 0);
  const totalLiquido = Math.max(0, totalBruto - totalDescontos);

  // Escuta contínua de leitor de código de barras USB / Bluetooth
  useEffect(() => {
    const unsubscribe = barcodeScannerService.onScan((scanResult) => {
      handleProcessBarcodeScan(scanResult.code);
    });
    return unsubscribe;
  }, [pecas]);

  const handleProcessBarcodeScan = (code: string) => {
    const clean = code.trim().toLowerCase();
    const found = pecas.find(p => 
      p.id.toLowerCase() === clean ||
      p.codigoOem.toLowerCase() === clean ||
      p.codigoBarrasQr.toLowerCase() === clean ||
      clean.includes(p.id.toLowerCase()) ||
      clean.includes(p.codigoOem.toLowerCase())
    );

    if (found) {
      handleAddToCart(found);
      addToast({
        title: 'Leitura de Código de Barras (0ms)',
        message: `Peça "${found.descricao}" identificada pelo scanner e inserida no carrinho.`,
        type: 'success'
      });
    } else {
      addToast({
        title: 'Código Não Localizado',
        message: `Nenhuma autopeça ativa encontrada para o código "${code}".`,
        type: 'warning'
      });
    }
  };

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    barcodeScannerService.simulateScan(barcodeInput.trim());
    setBarcodeInput('');
  };

  const handleAddToCart = (peca: PecaEstoque) => {
    const existing = carrinho.find(c => c.peca.id === peca.id);
    if (existing) {
      setCarrinho(prev => prev.map(c => c.peca.id === peca.id ? { ...c, quantidade: c.quantidade + 1 } : c));
    } else {
      setCarrinho(prev => [...prev, { peca, quantidade: 1, desconto: 0 }]);
    }
  };

  const handleRemoveFromCart = (pecaId: string) => {
    setCarrinho(prev => prev.filter(c => c.peca.id !== pecaId));
  };

  const handleUpdateQty = (pecaId: string, delta: number) => {
    setCarrinho(prev => prev.map(c => {
      if (c.peca.id === pecaId) {
        const novaQtd = Math.max(1, c.quantidade + delta);
        return { ...c, quantidade: novaQtd };
      }
      return c;
    }));
  };

  // Finalização System-First
  const handleFinalizar = () => {
    if (carrinho.length === 0) {
      addToast({
        title: 'Carrinho Vazio',
        message: 'Adicione ao menos uma peça para concluir a venda.',
        type: 'warning'
      });
      return;
    }

    const vendaId = `VND-2026-${Math.floor(100 + Math.random() * 900)}`;
    const cliente = parceiros.find(p => p.id === selectedParceiroId)?.nome || 'Consumidor Final';

    const venda = {
      id: vendaId,
      dataHora: new Date().toLocaleString('pt-BR'),
      clienteNome: cliente,
      itens: carrinho.map(c => ({
        pecaId: c.peca.id,
        descricao: c.peca.descricao,
        quantidade: c.quantidade,
        precoUnitario: c.peca.precoVenda,
        subtotal: (c.peca.precoVenda * c.quantidade) - c.desconto
      })),
      valorTotal: totalLiquido,
      formaPagamento: metodoPagamento,
      chaveNfeSefaz: `3526090392184700019065001000000${Math.floor(1000 + Math.random() * 9000)}129841`,
      statusFiscal: 'Autorizada'
    };

    // Padrão System-First: Baixa imediata local e enfileiramento em background
    syncQueueService.executeSystemFirst({
      mutateLocal: () => {
        if (onFinalizarVenda) onFinalizarVenda(venda);
        setCarrinho([]);
      },
      task: {
        type: 'INVENTORY_SALE',
        entity: 'PECA',
        entityId: vendaId,
        data: {
          venda_id: vendaId,
          cliente,
          valor_total: totalLiquido,
          itens_vendidos: venda.itens
        }
      }
    });

    addToast({
      title: 'Venda Concluída (0ms Latência)!',
      message: `NFC-e #${venda.id} gerada. Espelhamento Google Sheets enviado para background queue.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner PDV */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              PDV Balcão - Frente de Caixa Ágil (System-First)
            </h2>
            <p className="text-xs text-slate-500">
              Venda com zero latência no atendimento e espelhamento assíncrono no Google Sheets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" dot size="sm">Leitor Laser USB Ativo</Badge>
          <Badge variant="blue" size="sm">NFC-e Instantânea</Badge>
        </div>
      </div>

      {/* Barra de Leitura de Código de Barras / QR Code Rápido */}
      <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" />
            </svg>
          </span>
          <div>
            <div className="text-xs font-bold text-slate-100 font-mono">
              Scanner de Código de Barras & QR Code
            </div>
            <div className="text-[10px] text-slate-400">
              Aponte o leitor físico ou digite o código OEM para bipe e inserção em 0ms.
            </div>
          </div>
        </div>

        <form onSubmit={handleManualScanSubmit} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ex: PC-2026-001, 1K0615301AA..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            className="text-xs font-mono bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-56"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold font-mono transition-all"
          >
            Bipar Peça
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Catálogo de Peças Rápido (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Seletor Rápido de Peças em Estoque
            </h3>
            <span className="text-xs text-slate-400 font-mono">{pecasDisponiveis.length} disponíveis</span>
          </div>

          <input
            type="text"
            placeholder="Digite para filtrar por descrição, OEM ou veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {pecasFiltradas.map(p => (
              <div
                key={p.id}
                onClick={() => handleAddToCart(p)}
                className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>{p.categoria}</span>
                    <span>{p.estanteId}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {p.descricao}
                  </h4>
                  <div className="text-[10px] text-slate-500 mt-1 truncate font-mono">
                    OEM: {p.codigoOem}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                    R$ {p.precoVenda.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                    + Adicionar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrinho e Checkout (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Carrinho de Venda
              </h3>
              <span className="text-xs font-mono text-slate-500">{carrinho.length} itens</span>
            </div>

            {/* Seletor de Cliente */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Cliente / Comprador
              </label>
              <select
                value={selectedParceiroId}
                onChange={(e) => setSelectedParceiroId(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200"
              >
                {parceiros.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.categoria})
                  </option>
                ))}
              </select>
            </div>

            {/* Lista do Carrinho */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {carrinho.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs font-mono">
                  O carrinho está vazio. Bipe uma peça ou selecione ao lado.
                </div>
              ) : (
                carrinho.map(item => (
                  <div 
                    key={item.peca.id}
                    className="p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {item.peca.descricao}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        R$ {item.peca.precoVenda.toFixed(2)} cada
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleUpdateQty(item.peca.id, -1)}
                        className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.peca.id, 1)}
                        className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300"
                      >
                        +
                      </button>

                      <button
                        onClick={() => handleRemoveFromCart(item.peca.id)}
                        className="text-slate-400 hover:text-rose-500 ml-1"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Formas de Pagamento & Totais */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-mono">R$ {totalBruto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Desconto:</span>
                <span className="font-mono">- R$ {totalDescontos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 text-base pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Total Líquido:</span>
                <span className="font-mono text-xl text-emerald-600 dark:text-emerald-400">
                  R$ {totalLiquido.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Seletor de Pagamento */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMetodoPagamento('PIX')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  metodoPagamento === 'PIX'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>PIX QR</span>
              </button>

              <button
                type="button"
                onClick={() => setMetodoPagamento('CARTAO')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  metodoPagamento === 'CARTAO'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setMetodoPagamento('DINHEIRO')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  metodoPagamento === 'DINHEIRO'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>Dinheiro</span>
              </button>
            </div>

            <button
              onClick={handleFinalizar}
              disabled={carrinho.length === 0}
              className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Concluir Venda (System-First 0ms)</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
