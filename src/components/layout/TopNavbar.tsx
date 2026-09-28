import React from 'react';
import { NavigationModuleId } from '../../types/navigation';
import { Badge } from '../common/Badge';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { KPIMetricas } from '../../types/erp';

interface TopNavbarProps {
  currentModule: NavigationModuleId;
  kpis?: KPIMetricas;
  onOpenMobileMenu?: () => void;
  onQuickAction?: (action: 'balanca' | 'pdv' | 'sync') => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentModule,
  kpis,
  onOpenMobileMenu,
  onQuickAction
}) => {
  const getModuleInfo = (id: NavigationModuleId): { section: string; title: string } => {
    switch (id) {
      case 'visao-executiva': return { section: 'Dashboard & Inteligência', title: 'Visão Executiva (Home)' };
      case 'planta-baixa': return { section: 'Dashboard & Inteligência', title: 'Planta Baixa Interativa' };
      case 'balanca-recepcao': return { section: 'Operações de Pátio & CDV', title: 'Balança & Recepção de Sucata' };
      case 'linha-desmontagem': return { section: 'Operações de Pátio & CDV', title: 'Linha de Desmontagem (Pátio)' };
      case 'gestao-veiculos': return { section: 'Operações de Pátio & CDV', title: 'Gestão de Veículos (Baixa DETRAN)' };
      case 'prateleiras-estantes': return { section: 'Estoque & Armazém Vertical', title: 'Prateleiras & Estantes (EST 01..08)' };
      case 'inventario-autopecas': return { section: 'Estoque & Armazém Vertical', title: 'Inventário de Autopeças' };
      case 'pdv-frente-caixa': return { section: 'Comercial & Vendas', title: 'PDV (Frente de Caixa Rápido)' };
      case 'vendas-atacado': return { section: 'Comercial & Vendas', title: 'Vendas em Grande Escala (Atacado)' };
      case 'orcamentos-pedidos': return { section: 'Comercial & Vendas', title: 'Orçamentos & Pedidos' };
      case 'fluxo-caixa': return { section: 'Financeiro & Caixa', title: 'Fluxo de Caixa Diário' };
      case 'contas-pagar-receber': return { section: 'Financeiro & Caixa', title: 'Contas a Pagar & Receber' };
      case 'divisao-socios': return { section: 'Financeiro & Caixa', title: 'Divisão de Sócios / Repasses' };
      case 'suite-fiscal-sefaz': return { section: 'Fiscal & Conformidade', title: 'Suíte Fiscal SEFAZ' };
      case 'conformidade-ambiental': return { section: 'Fiscal & Conformidade', title: 'Conformidade Ambiental & Legal' };
      case 'sync-planilhas': return { section: 'Integrações & Ferramentas', title: 'Sincronização de Planilhas' };
      case 'terminal-specsfy': return { section: 'Integrações & Ferramentas', title: 'Terminal Specsfy & Logs' };
      case 'config-permissoes': return { section: 'Integrações & Ferramentas', title: 'Configurações & Permissões' };
      default: return { section: 'Paulinho Gestão', title: 'Módulo Corporativo' };
    }
  };

  const info = getModuleInfo(currentModule);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-6 py-3 gap-4">
        
        {/* Esquerda: Botão Mobile + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Abrir menu lateral"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 font-mono">
              <span>{info.section}</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-slate-200 font-semibold">{info.title}</span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none mt-0.5">
              {info.title}
            </h1>
          </div>
        </div>

        {/* Centro: Tickers de Métricas em Tempo Real */}
        {kpis && (
          <div className="hidden xl:flex items-center gap-4 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Vendas:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                R$ {kpis.totalVendasBalcaoHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Compras:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                R$ {kpis.totalPagoFornecedoresHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Metais:</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">
                {kpis.totalMetaisPesadosHojeKg.toLocaleString('pt-BR')} kg
              </span>
            </div>
          </div>
        )}

        {/* Direita: Status Barcode + Sync Engine + SEFAZ + Ações */}
        <div className="flex items-center gap-2.5">
          
          {/* Status do Barcode Scanner HID */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-300 font-semibold">Laser USB HID: 0ms</span>
          </div>

          {/* Sync Engine System-First */}
          <SyncStatusIndicator />

          {/* Status SEFAZ */}
          <Badge variant="emerald" dot size="sm" className="hidden sm:inline-flex">
            SEFAZ SP
          </Badge>

          {/* Ações Rápidas */}
          {onQuickAction && (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onQuickAction('balanca')}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Pesagem</span>
              </button>

              <button
                onClick={() => onQuickAction('pdv')}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span>PDV</span>
              </button>
            </div>
          )}

          {/* Avatar Usuário */}
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
            PC
          </div>
        </div>

      </div>
    </header>
  );
};
