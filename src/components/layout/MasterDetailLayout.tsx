import React, { useState } from 'react';

export interface FilterTab {
  id: string;
  label: string;
  count: number;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'slate';
}

export interface MasterDetailTab {
  id: string;
  label: string;
  badge?: string;
  content: React.ReactNode;
}

export interface MasterDetailLayoutProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterTabs?: FilterTab[];
  activeFilterId?: string;
  onFilterChange?: (filterId: string) => void;
  headerActions?: React.ReactNode;
  masterList: React.ReactNode;
  detailHeader?: React.ReactNode;
  detailTabs?: MasterDetailTab[];
  selectedItemTitle?: string;
  hasSelection?: boolean;
  onClearSelection?: () => void;
  emptyDetailMessage?: string;
  masterWidthClass?: string;
}

export const MasterDetailLayout: React.FC<MasterDetailLayoutProps> = ({
  title,
  subtitle,
  searchPlaceholder = 'Buscar registros ou código de barras...',
  searchValue,
  onSearchChange,
  filterTabs = [],
  activeFilterId,
  onFilterChange,
  headerActions,
  masterList,
  detailHeader,
  detailTabs = [],
  selectedItemTitle,
  hasSelection = false,
  onClearSelection,
  emptyDetailMessage = 'Selecione um card na lista logística à esquerda para inspecionar os detalhes completos.',
  masterWidthClass = 'w-full lg:w-[480px] xl:w-[520px]'
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(detailTabs[0]?.id || '');

  React.useEffect(() => {
    if (detailTabs.length > 0 && (!activeTabId || !detailTabs.find(t => t.id === activeTabId))) {
      setActiveTabId(detailTabs[0].id);
    }
  }, [detailTabs, activeTabId]);

  const activeTabContent = detailTabs.find(t => t.id === activeTabId)?.content;

  const getFilterBadgeStyle = (variant?: string, isActive = false) => {
    if (isActive) {
      return 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold';
    }
    switch (variant) {
      case 'emerald': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40';
      case 'amber': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40';
      case 'rose': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40';
      case 'blue': return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/40';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
              Master-Detail UI
            </span>
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {headerActions && <div className="flex items-center gap-2.5 flex-wrap">{headerActions}</div>}
      </div>

      {/* Split-Pane Dual Column Layout */}
      <div className="flex flex-col lg:flex-row items-stretch gap-5 min-h-[640px]">
        
        {/* Coluna Esquerda (Master Logistics Panel) */}
        <div className={`${masterWidthClass} flex flex-col space-y-3.5 shrink-0`}>
          
          {/* Barra de Busca com Foco Inteligente */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-xs"
            />
          </div>

          {/* Abas de Filtro com Contadores Numéricos */}
          {filterTabs.length > 0 && onFilterChange && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filterTabs.map((tab) => {
                const isActive = activeFilterId === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onFilterChange(tab.id)}
                    className={`
                      px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap select-none
                      ${isActive
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${getFilterBadgeStyle(tab.variant, isActive)}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Grid Fluido de Cards Modulares */}
          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[720px] pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {masterList}
          </div>

        </div>

        {/* Coluna Direita (Detail Inspection Panel) */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs flex flex-col overflow-hidden min-h-[500px]">
          {hasSelection ? (
            <>
              {/* Header do Painel com Abas */}
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    {detailHeader || (
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                        {selectedItemTitle || 'Inspeção do Registro'}
                      </h3>
                    )}
                  </div>

                  {onClearSelection && (
                    <button
                      onClick={onClearSelection}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Fechar inspeção"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Sub-abas de Navegação */}
                {detailTabs.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
                    {detailTabs.map((tab) => {
                      const isActive = tab.id === activeTabId;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTabId(tab.id)}
                          className={`
                            px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 whitespace-nowrap select-none
                            ${isActive
                              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }
                          `}
                        >
                          <span>{tab.label}</span>
                          {tab.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {tab.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Conteúdo Ativo do Detail */}
              <div className="flex-1 p-5 overflow-y-auto">
                {activeTabContent}
              </div>
            </>
          ) : (
            /* Estado Vazio */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <line x1="9" x2="9" y1="3" y2="21" />
                </svg>
              </div>
              <div className="max-w-xs">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-mono">
                  Painel de Inspeção Duplo
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {emptyDetailMessage}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
