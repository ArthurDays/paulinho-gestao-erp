import React, { useState, useEffect, useMemo } from 'react';
import { PecaEstoque } from '../types/erp';
import { Badge } from './common/Badge';
import { useToast } from './common/Toast';
import { MasterDetailLayout, FilterTab, MasterDetailTab } from './layout/MasterDetailLayout';
import { useBarcodeScanner } from './common/BarcodeListener';

export interface CatalogoPecasProps {
  pecas: PecaEstoque[];
  onVenderPeca?: (pecaId: string) => void;
  onAdicionarAoPdv?: (peca: PecaEstoque) => void;
}

export const CatalogoPecas: React.FC<CatalogoPecasProps> = ({
  pecas,
  onAdicionarAoPdv
}) => {
  const { addToast } = useToast();
  const { registerScanHandler } = useBarcodeScanner();

  const [selectedPecaId, setSelectedPecaId] = useState<string>(pecas[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'Disponível' | 'Reservada' | 'Em Triagem'>('TODOS');

  const pecaSelecionada = useMemo(() => {
    return pecas.find(p => p.id === selectedPecaId) || pecas[0];
  }, [pecas, selectedPecaId]);

  // Escuta contínua de código de barras universal (0ms)
  useEffect(() => {
    const unregister = registerScanHandler((scan) => {
      const code = scan.code.trim().toLowerCase();
      const match = pecas.find(p => 
        p.id.toLowerCase() === code ||
        p.codigoOem.toLowerCase() === code ||
        p.codigoBarrasQr.toLowerCase() === code ||
        code.includes(p.codigoOem.toLowerCase())
      );

      if (match) {
        setSelectedPecaId(match.id);
        addToast({
          title: 'Peça Inspecionada via Barcode (0ms)',
          message: `${match.descricao} (${match.codigoOem}) carregada no painel Master-Detail.`,
          type: 'success'
        });
        return true;
      }
      return false;
    });

    return unregister;
  }, [pecas, registerScanHandler, addToast]);

  // Contadores para abas de filtro
  const filterTabs: FilterTab[] = useMemo(() => {
    const total = pecas.length;
    const disp = pecas.filter(p => p.status === 'Disponível').length;
    const res = pecas.filter(p => p.status === 'Reservada').length;
    const triagem = pecas.filter(p => p.status === 'Em Triagem').length;

    return [
      { id: 'TODOS', label: 'Todos os Itens', count: total, variant: 'slate' },
      { id: 'Disponível', label: 'Disponíveis', count: disp, variant: 'emerald' },
      { id: 'Reservada', label: 'Reservadas', count: res, variant: 'amber' },
      { id: 'Em Triagem', label: 'Em Triagem', count: triagem, variant: 'blue' }
    ];
  }, [pecas]);

  // Filtragem combinada por busca e aba de status
  const pecasFiltradas = useMemo(() => {
    return pecas.filter(p => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        p.descricao.toLowerCase().includes(q) ||
        p.codigoOem.toLowerCase().includes(q) ||
        p.estanteId.toLowerCase().includes(q) ||
        p.posicaoRack.toLowerCase().includes(q) ||
        p.veiculoOrigem.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'TODOS' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [pecas, searchTerm, statusFilter]);

  // Ícone por categoria de autopeça
  const renderCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'Freios':
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="M12 2a10 10 0 0 0-7 3l4 4" />
            </svg>
          </div>
        );
      case 'Suspensão':
        return (
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M8 6h8M6 12h12M8 18h8" />
            </svg>
          </div>
        );
      case 'Elétrica':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
        );
      case 'Motor':
        return (
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="6" width="16" height="12" rx="2" /><line x1="2" y1="10" x2="4" y2="10" /><line x1="20" y1="10" x2="22" y2="10" /><line x1="9" y1="2" x2="9" y2="6" /><line x1="15" y1="2" x2="15" y2="6" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Disponível': return <Badge variant="emerald" dot size="sm">Disponível</Badge>;
      case 'Reservada': return <Badge variant="amber" dot size="sm">Reservada</Badge>;
      default: return <Badge variant="blue" dot size="sm">{status}</Badge>;
    }
  };

  // Sub-abas do Painel Detalhe
  const detailTabs: MasterDetailTab[] = [
    {
      id: 'tab-specs',
      label: 'Ficha Técnica & OEM',
      badge: pecaSelecionada?.categoria,
      content: pecaSelecionada && (
        <div className="space-y-5">
          {/* Métricas Principais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Preço de Venda</span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                R$ {pecaSelecionada.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Custo Aquisição</span>
              <span className="text-sm font-semibold font-mono text-slate-700 dark:text-slate-300">
                R$ {pecaSelecionada.precoCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Margem Bruta</span>
              <span className="text-sm font-bold font-mono text-sky-600 dark:text-sky-400">
                {Math.round(((pecaSelecionada.precoVenda - pecaSelecionada.precoCusto) / pecaSelecionada.precoVenda) * 100)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Qtd em Estoque</span>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                {pecaSelecionada.quantidadeEstoque} un
              </span>
            </div>
          </div>

          {/* Endereço Físico e Localização Vertical */}
          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono mb-3 flex items-center justify-between">
              <span>Localização no Armazém Vertical</span>
              <span className="text-orange-600 font-bold">{pecaSelecionada.estanteId} • Nível {pecaSelecionada.nivel}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">Bateria de Estantes</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{pecaSelecionada.estanteId}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">Nível Vertical</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">N{pecaSelecionada.nivel} (Solo/Intermediário)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">Posição no Rack</span>
                <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{pecaSelecionada.posicaoRack}</span>
              </div>
            </div>
          </div>

          {/* Veículo de Origem */}
          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono mb-2">
              Veículo Doador (Origem CDV)
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
              {pecaSelecionada.veiculoOrigem}
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-1">
              Desmontado conforme Lei 12.977/2014 com certidão de baixa no DETRAN.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'tab-qrcode',
      label: 'Selo Rastreável & QR Code',
      badge: 'SEFAZ',
      content: pecaSelecionada && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-28 h-28 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-center shrink-0">
              <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" />
                <path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1" />
              </svg>
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                Selo de Rastreabilidade Certificado
              </div>
              <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                {pecaSelecionada.codigoBarrasQr}
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                Código gerado com validação SEFAZ e número de controle para consulta pública.
              </p>
              <button
                onClick={() => {
                  addToast({
                    title: 'Impressão Térmica 80mm',
                    message: `Etiqueta para ${pecaSelecionada.descricao} encaminhada.`,
                    type: 'success'
                  });
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" />
                </svg>
                <span>Imprimir Etiqueta Térmica</span>
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tab-timeline',
      label: 'Timeline & Movimentação',
      content: pecaSelecionada && (
        <div className="space-y-3.5 pl-2 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
          <div className="relative pl-4">
            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Catalogação no Armazém</div>
            <div className="text-[11px] text-slate-400 font-mono">27/09/2026 às 16:30 • {pecaSelecionada.estanteId} N{pecaSelecionada.nivel}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Item etiquetado com QR Code e disponibilizado para venda.</p>
          </div>
          <div className="relative pl-4">
            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-900" />
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Desmontagem Veicular</div>
            <div className="text-[11px] text-slate-400 font-mono">27/09/2026 às 14:15 • Baia 01 (Pátio)</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Peça removida e aprovada no teste de integridade física.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <MasterDetailLayout
      title="Catálogo & Inventário de Autopeças"
      subtitle="Visualização logística Master-Detail com rastreabilidade por QR Code e integração ao PDV"
      searchPlaceholder="Filtrar por OEM, descrição, estante ou veículo doador..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      filterTabs={filterTabs}
      activeFilterId={statusFilter}
      onFilterChange={(id) => setStatusFilter(id as any)}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (pecaSelecionada && onAdicionarAoPdv) {
                onAdicionarAoPdv(pecaSelecionada);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span>Enviar ao PDV Balcão</span>
          </button>
        </div>
      }
      masterList={
        pecasFiltradas.length > 0 ? (
          pecasFiltradas.map((peca) => {
            const isSelected = peca.id === selectedPecaId;
            return (
              <div
                key={peca.id}
                onClick={() => setSelectedPecaId(peca.id)}
                className={`
                  p-3.5 rounded-xl border transition-all cursor-pointer group select-none
                  ${isSelected
                    ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-500/80 shadow-xs ring-1 ring-orange-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {renderCategoryIcon(peca.categoria)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-600 transition-colors">
                        {peca.id} • OEM {peca.codigoOem}
                      </span>
                      {getStatusBadge(peca.status)}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate leading-snug">
                      {peca.descricao}
                    </h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                        📍 {peca.estanteId} • {peca.posicaoRack}
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        R$ {peca.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            Nenhuma autopeça encontrada para os filtros atuais.
          </div>
        )
      }
      hasSelection={!!pecaSelecionada}
      selectedItemTitle={pecaSelecionada ? `${pecaSelecionada.descricao} (${pecaSelecionada.codigoOem})` : undefined}
      detailTabs={detailTabs}
    />
  );
};

export default CatalogoPecas;
