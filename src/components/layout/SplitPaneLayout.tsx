import React, { useState } from 'react';

export interface SplitPaneTab {
  id: string;
  label: string;
  badge?: string;
  content: React.ReactNode;
}

export interface SplitPaneLayoutProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  masterContent: React.ReactNode;
  detailHeader?: React.ReactNode;
  detailTabs?: SplitPaneTab[];
  selectedItemTitle?: string;
  hasSelection?: boolean;
  onClearSelection?: () => void;
  emptyDetailMessage?: string;
  masterWidthClass?: string; // default: 'lg:w-5/12'
}

export const SplitPaneLayout: React.FC<SplitPaneLayoutProps> = ({
  title,
  subtitle,
  actions,
  masterContent,
  detailHeader,
  detailTabs = [],
  selectedItemTitle,
  hasSelection = false,
  onClearSelection,
  emptyDetailMessage = 'Selecione um registro na lista ao lado para inspecionar os detalhes completos.',
  masterWidthClass = 'lg:w-5/12'
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(detailTabs[0]?.id || '');

  // Atualiza aba se as tabs mudarem e a aba ativa não existir
  React.useEffect(() => {
    if (detailTabs.length > 0 && (!activeTabId || !detailTabs.find(t => t.id === activeTabId))) {
      setActiveTabId(detailTabs[0].id);
    }
  }, [detailTabs, activeTabId]);

  const activeTabContent = detailTabs.find(t => t.id === activeTabId)?.content;

  return (
    <div className="space-y-5">
      {/* Top Header do Layout (se fornecido) */}
      {(title || actions) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Split Pane Master-Detail Container */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6 min-h-[580px]">
        
        {/* Painel Mestre (Lista / Grid à Esquerda) */}
        <div className={`w-full ${masterWidthClass} flex flex-col space-y-4 shrink-0`}>
          {masterContent}
        </div>

        {/* Painel de Inspeção Detalhada (Master-Detail à Direita) */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs flex flex-col overflow-hidden">
          {hasSelection ? (
            <>
              {/* Header do Detalhe com Tabs */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    {detailHeader || (
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {selectedItemTitle || 'Detalhes do Registro'}
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
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                    {detailTabs.map(tab => {
                      const isActive = tab.id === activeTabId;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTabId(tab.id)}
                          className={`
                            px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 whitespace-nowrap
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

              {/* Conteúdo da Sub-Aba Ativa */}
              <div className="flex-1 p-5 overflow-y-auto">
                {activeTabContent}
              </div>
            </>
          ) : (
            /* Estado Vazio (Nenhum item selecionado) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <line x1="9" x2="9" y1="3" y2="21" />
                </svg>
              </div>
              <div className="max-w-xs">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-mono">
                  Modo Split-Pane Master-Detail
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
