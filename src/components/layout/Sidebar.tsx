import React from 'react';
import { NavigationModuleId, NavSection } from '../../types/navigation';

interface SidebarProps {
  currentModule: NavigationModuleId;
  onSelectModule: (moduleId: NavigationModuleId) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isMobileOpen = false,
  onCloseMobile
}) => {

  const navSections: NavSection[] = [
    {
      id: 'sec-dashboard',
      title: 'DASHBOARD & INTELIGÊNCIA',
      iconName: 'layout-dashboard',
      items: [
        { id: 'visao-executiva', label: 'Visão Executiva (Home)', shortcut: '⌘1' },
        { id: 'planta-baixa', label: 'Planta Baixa Interativa', badge: 'Digital Twin', badgeVariant: 'emerald' }
      ]
    },
    {
      id: 'sec-patio',
      title: 'OPERAÇÕES DE PÁTIO & CDV',
      iconName: 'truck',
      items: [
        { id: 'balanca-recepcao', label: 'Balança & Recepção de Sucata', badge: 'Live', badgeVariant: 'amber' },
        { id: 'linha-desmontagem', label: 'Linha de Desmontagem (Pátio)', badge: 'Lei 12.977', badgeVariant: 'emerald' },
        { id: 'gestao-veiculos', label: 'Gestão de Veículos (Baixa DETRAN)' }
      ]
    },
    {
      id: 'sec-estoque',
      title: 'ESTOQUE & ARMAZÉM VERTICAL',
      iconName: 'layers',
      items: [
        { id: 'prateleiras-estantes', label: 'Prateleiras & Estantes (EST 01..08)' },
        { id: 'inventario-autopecas', label: 'Inventário de Autopeças', badge: 'QR Code', badgeVariant: 'blue' }
      ]
    },
    {
      id: 'sec-comercial',
      title: 'COMERCIAL & VENDAS',
      iconName: 'shopping-cart',
      items: [
        { id: 'pdv-frente-caixa', label: 'PDV (Frente de Caixa Rápido)', badge: 'PIX', badgeVariant: 'emerald' },
        { id: 'vendas-atacado', label: 'Vendas em Grande Escala (Atacado)' },
        { id: 'orcamentos-pedidos', label: 'Orçamentos & Pedidos' }
      ]
    },
    {
      id: 'sec-financeiro',
      title: 'FINANCEIRO & CAIXA',
      iconName: 'dollar-sign',
      items: [
        { id: 'fluxo-caixa', label: 'Fluxo de Caixa Diário' },
        { id: 'contas-pagar-receber', label: 'Contas a Pagar & Receber' },
        { id: 'divisao-socios', label: 'Divisão de Sócios / Repasses' }
      ]
    },
    {
      id: 'sec-fiscal',
      title: 'FISCAL, JURÍDICO & CONFORMIDADE',
      iconName: 'shield-check',
      items: [
        { id: 'suite-fiscal-sefaz', label: 'Suíte Fiscal SEFAZ (NF-e / NFC-e)', badge: 'SEFAZ', badgeVariant: 'emerald' },
        { id: 'conformidade-ambiental', label: 'Conformidade Ambiental & Legal', badge: 'CETESB', badgeVariant: 'slate' }
      ]
    },
    {
      id: 'sec-integracoes',
      title: 'INTEGRAÇÕES & FERRAMENTAS',
      iconName: 'terminal',
      items: [
        { id: 'sync-planilhas', label: 'Sincronização de Planilhas (CSV/Sheets)', badge: 'Auto', badgeVariant: 'blue' },
        { id: 'terminal-specsfy', label: 'Terminal Specsfy & Logs' },
        { id: 'config-permissoes', label: 'Configurações & Permissões' }
      ]
    }
  ];

  // Helper para renderizar ícones minimalistas SVG estilo Lucide
  const renderItemIcon = (id: NavigationModuleId) => {
    switch (id) {
      case 'visao-executiva':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
        );
      case 'planta-baixa':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" />
          </svg>
        );
      case 'balanca-recepcao':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
          </svg>
        );
      case 'linha-desmontagem':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        );
      case 'gestao-veiculos':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
          </svg>
        );
      case 'prateleiras-estantes':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
          </svg>
        );
      case 'inventario-autopecas':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        );
      case 'pdv-frente-caixa':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        );
      case 'vendas-atacado':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
          </svg>
        );
      case 'orcamentos-pedidos':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
          </svg>
        );
      case 'fluxo-caixa':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
      case 'contas-pagar-receber':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="m9 16 3-3 3 3" />
          </svg>
        );
      case 'divisao-socios':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'suite-fiscal-sefaz':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
          </svg>
        );
      case 'conformidade-ambiental':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        );
      case 'sync-planilhas':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        );
      case 'terminal-specsfy':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" />
          </svg>
        );
      case 'config-permissoes':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
          </svg>
        );
      default:
        return <div className="w-2 h-2 rounded-full bg-slate-500" />;
    }
  };

  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'blue':
        return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  // Estado para árvore colapsável de seções
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <>
      {/* Backdrop Mobile */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Barra Lateral Fixa / Responsiva */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-sm shadow-orange-600/30">
              PG
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none">
                Paulinho Gestão
              </h1>
              <span className="text-[10px] text-slate-400 font-mono">
                Reciclagem & CDV v2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-[10px] text-slate-400 font-mono">SEFAZ OK</span>
          </div>
        </div>

        {/* Lista de Módulos (Scrollable com Árvore Colapsável) */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section) => {
            const isCollapsed = !!collapsedSections[section.id];

            return (
              <div key={section.id} className="transition-all">
                {/* Header de Seção Colapsável com Chevron */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/90 font-mono hover:text-slate-200 transition-colors group select-none text-left"
                >
                  <span className="truncate">{section.title}</span>
                  <svg 
                    className={`w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Sub-itens da Seção */}
                {!isCollapsed && (
                  <div className="space-y-0.5 pl-1 border-l border-slate-800/60 ml-2">
                {section.items.map((item) => {
                  const isActive = currentModule === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectModule(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group text-left
                        ${isActive
                          ? 'bg-slate-800 text-white font-semibold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`transition-colors ${isActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-300'}`}>
                          {renderItemIcon(item.id)}
                        </span>
                        <span className="truncate">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                        {item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${getBadgeStyle(item.badgeVariant)}`}>
                            {item.badge}
                          </span>
                        )}
                        {item.shortcut && (
                          <kbd className="hidden group-hover:inline-block text-[9px] font-mono text-slate-500 bg-slate-800 px-1 rounded border border-slate-700">
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    </button>
                })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer com Perfil do Operador */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-orange-400">
                PC
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">Paulo César</div>
                <div className="text-[10px] text-slate-500 font-mono">Administrador Geral</div>
              </div>
            </div>

            <button 
              title="Configurações Rápidas"
              onClick={() => onSelectModule('config-permissoes')}
              className="text-slate-500 hover:text-slate-300 p-1 rounded"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};
