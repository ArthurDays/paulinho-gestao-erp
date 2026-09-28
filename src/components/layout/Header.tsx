import React from 'react';
import { NavigationModuleId } from '../../types/navigation';
import { Badge } from '../common/Badge';
import { SyncStatusIndicator } from './SyncStatusIndicator';

interface HeaderProps {
  currentModule: NavigationModuleId;
  onOpenMobileMenu?: () => void;
  onQuickAction?: (action: 'balanca' | 'pdv' | 'sync') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onOpenMobileMenu,
  onQuickAction
}) => {
  // Mapeamento de Títulos e Breadcrumbs
  const getModuleInfo = (id: NavigationModuleId): { section: string; title: string; subtitle: string } => {
    switch (id) {
      case 'visao-executiva':
        return { section: 'Dashboard & Inteligência', title: 'Visão Executiva (Home)', subtitle: 'Indicadores operacionais e financeiros em tempo real' };
      case 'planta-baixa':
        return { section: 'Dashboard & Inteligência', title: 'Planta Baixa Interativa', subtitle: 'Layout esquemático do galpão físico e rastreamento de setores' };
      case 'balanca-recepcao':
        return { section: 'Operações de Pátio & CDV', title: 'Balança & Recepção de Sucata', subtitle: 'Pesagem industrial, triagem de metais e cálculo de impurezas' };
      case 'linha-desmontagem':
        return { section: 'Operações de Pátio & CDV', title: 'Linha de Desmontagem (Pátio)', subtitle: 'Controle de baias e protocolo de descontaminação (Lei 12.977/2014)' };
      case 'gestao-veiculos':
        return { section: 'Operações de Pátio & CDV', title: 'Gestão de Veículos (Baixa DETRAN)', subtitle: 'Rastreabilidade de chassis, laudos e certidões de baixa' };
      case 'prateleiras-estantes':
        return { section: 'Estoque & Armazém Vertical', title: 'Prateleiras & Estantes (EST-01 a EST-08)', subtitle: 'Organização verticalizada N1-N4 por corredor com códigos OEM' };
      case 'inventario-autopecas':
        return { section: 'Estoque & Armazém Vertical', title: 'Inventário de Autopeças', subtitle: 'Catálogo de peças extraídas, QR Code e movimentação de estoque' };
      case 'pdv-frente-caixa':
        return { section: 'Comercial & Vendas', title: 'PDV (Frente de Caixa Rápido)', subtitle: 'Balcão ágil para venda de peças, Pix instantâneo e NFC-e' };
      case 'vendas-atacado':
        return { section: 'Comercial & Vendas', title: 'Vendas em Grande Escala (Atacado)', subtitle: 'Faturamento de lotes pesados para siderúrgicas e fundições' };
      case 'orcamentos-pedidos':
        return { section: 'Comercial & Vendas', title: 'Orçamentos & Pedidos', subtitle: 'Cotações para oficinas mecânicas parceiras e controle de validade' };
      case 'fluxo-caixa':
        return { section: 'Financeiro & Caixa', title: 'Fluxo de Caixa Diário', subtitle: 'Entradas, saídas operacionais, custos de VPS e saldo consolidado' };
      case 'contas-pagar-receber':
        return { section: 'Financeiro & Caixa', title: 'Contas a Pagar & Receber', subtitle: 'Controle de duplicatas, boletos a vencer e liquidações bancárias' };
      case 'divisao-socios':
        return { section: 'Financeiro & Caixa', title: 'Divisão de Sócios / Repasses', subtitle: 'Cálculo automático de participação, pró-labore e rateio' };
      case 'suite-fiscal-sefaz':
        return { section: 'Fiscal, Jurídico & Conformidade', title: 'Suíte Fiscal SEFAZ', subtitle: 'Emissão e monitoramento de NF-e, NFC-e e escrituração tributária' };
      case 'conformidade-ambiental':
        return { section: 'Fiscal, Jurídico & Conformidade', title: 'Conformidade Ambiental & Legal', subtitle: 'Licenças CETESB/IBAMA e manifesto de resíduos perigosos (MTR)' };
      case 'sync-planilhas':
        return { section: 'Integrações & Ferramentas', title: 'Sincronização de Planilhas (CSV / Sheets)', subtitle: 'Alimentação em tempo real do inventário via planilha mestra' };
      case 'terminal-specsfy':
        return { section: 'Integrações & Ferramentas', title: 'Terminal Specsfy & Logs', subtitle: 'Auditoria técnica, testes automatizados e console de comandos' };
      case 'config-permissoes':
        return { section: 'Integrações & Ferramentas', title: 'Configurações & Permissões', subtitle: 'Perfis de acesso de usuários e políticas de segurança' };
      default:
        return { section: 'Paulinho Gestão', title: 'Módulo Operacional', subtitle: 'Sistema Integrado de Gestão' };
    }
  };

  const info = getModuleInfo(currentModule);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-6 py-3.5 gap-4">
        
        {/* Esquerda: Botão Menu Mobile + Breadcrumb & Título */}
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
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              <span>{info.section}</span>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{info.title}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none mt-0.5">
              {info.title}
            </h2>
          </div>
        </div>

        {/* Centro / Direita: Status SEFAZ + Busca Rápida + Atalhos Rápidos */}
        <div className="flex items-center gap-3">
          
          {/* Status SEFAZ, Balança e Sync Engine */}
          <div className="hidden sm:flex items-center gap-2">
            <SyncStatusIndicator />
            <Badge variant="emerald" dot size="sm">
              SEFAZ SP: Conectado (12ms)
            </Badge>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex items-center gap-1.5">
            {onQuickAction && (
              <>
                <button
                  onClick={() => onQuickAction('balanca')}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Nova Pesagem</span>
                </button>

                <button
                  onClick={() => onQuickAction('pdv')}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  <span>Caixa Rápido</span>
                </button>
              </>
            )}

            {/* Indicador de Usuário Atual */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                PC
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
