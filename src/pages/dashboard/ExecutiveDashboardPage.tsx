import React from 'react';
import { KPIMetricas, DashboardAnalyticsData } from '../../types/erp';
import { NavigationModuleId } from '../../types/navigation';
import { Badge } from '../../components/common/Badge';

interface ExecutiveDashboardPageProps {
  kpis: KPIMetricas;
  analytics: DashboardAnalyticsData;
  onNavigate: (moduleId: NavigationModuleId) => void;
}

export const ExecutiveDashboardPage: React.FC<ExecutiveDashboardPageProps> = ({
  kpis,
  analytics,
  onNavigate
}) => {
  const metaMetaisKg = 2000;
  const pctMetais = Math.min(100, Math.round((kpis.totalMetaisPesadosHojeKg / metaMetaisKg) * 100));

  return (
    <div className="space-y-6">
      
      {/* ==================================================================== */}
      {/* 1. CARDS DE KPIS EM TEMPO REAL                                       */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Faturamento Diário */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Faturamento Vendas Hoje
            </span>
            <Badge variant="emerald" size="sm">+14.2%</Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              R$ {kpis.totalVendasBalcaoHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Balcão + NFC-e</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">8 vendas</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full w-[72%]" />
          </div>
        </div>

        {/* KPI 2: Compras do Dia (Balança) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Compras Sucata / Entrada
            </span>
            <Badge variant="amber" size="sm">Hoje</Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              R$ {kpis.totalPagoFornecedoresHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Romaneios pagos</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">12 entradas</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full w-[58%]" />
          </div>
        </div>

        {/* KPI 3: Meta de Metais Pesados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Meta de Metais Triados
            </span>
            <Badge variant="blue" size="sm">{pctMetais}%</Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {kpis.totalMetaisPesadosHojeKg.toLocaleString('pt-BR')} <span className="text-sm font-normal text-slate-500">kg</span>
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Meta Diária: 2.000 kg</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Falta 549,5 kg</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${pctMetais}%` }} />
          </div>
        </div>

        {/* KPI 4: Ocupação do Pátio & Armazém */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Ocupação Armazém & CDV
            </span>
            <Badge variant="purple" size="sm">Capacidade</Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {kpis.taxaOcupacaoArmazemPct}%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>8 Estantes Verticais</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">243 peças ativas</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${kpis.taxaOcupacaoArmazemPct}%` }} />
          </div>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 2. ATALHOS RÁPIDOS OPERACIONAIS (WORKFLOW DE ALTA VELOCIDADE)         */}
      {/* ==================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            Ações Rápidas de Terminal
          </h3>
          <span className="text-xs text-slate-500 font-mono">Pressione os atalhos para abrir instantaneamente</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('balanca-recepcao')}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all text-left group active:scale-95"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Nova Pesagem</div>
              <div className="text-[10px] text-slate-500 font-mono">Entrada de Sucata</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('pdv-frente-caixa')}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all text-left group active:scale-95"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Caixa Balcão</div>
              <div className="text-[10px] text-slate-500 font-mono">Venda Rápida / Pix</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('linha-desmontagem')}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 transition-all text-left group active:scale-95"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Baias CDV</div>
              <div className="text-[10px] text-slate-500 font-mono">Descontaminação</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('sync-planilhas')}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 hover:bg-sky-50/30 dark:hover:bg-sky-950/20 transition-all text-left group active:scale-95"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sync Planilha</div>
              <div className="text-[10px] text-slate-500 font-mono">Google Sheets / CSV</div>
            </div>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. GRÁFICOS ANALÍTICOS (FLUXO SEMANAL + COMPOSIÇÃO DE RECEITA)       */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico 1: Fluxo de Caixa Semanal (2 colunas) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Fluxo Operacional Semanal
              </h3>
              <p className="text-xs text-slate-500">Comparativo entre compras de sucata e vendas de balcão</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Vendas Balcão
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Compras Sucata
              </span>
            </div>
          </div>

          {/* Gráfico de Barras Relativo */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-slate-800">
            {analytics.faturamentoSemanal.map((dia, idx) => {
              const maxVal = 9000;
              const hVendas = Math.round((dia.vendasBalcao / maxVal) * 100);
              const hCompras = Math.round((dia.comprasSucata / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    R$ {(dia.vendasBalcao - dia.comprasSucata).toLocaleString('pt-BR')}
                  </div>
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    <div 
                      className="w-1/2 bg-amber-400/80 hover:bg-amber-400 rounded-t-sm transition-all"
                      style={{ height: `${hCompras}%` }}
                      title={`Compras: R$ ${dia.comprasSucata.toFixed(2)}`}
                    />
                    <div 
                      className="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-all"
                      style={{ height: `${hVendas}%` }}
                      title={`Vendas: R$ ${dia.vendasBalcao.toFixed(2)}`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2 font-mono">
                    {dia.data}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Saldo Operacional Semanal Líquido</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
              + R$ 10.970,00
            </span>
          </div>
        </div>

        {/* Gráfico 2: Composição do Faturamento por Categoria (1 coluna) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Mix de Rentabilidade
              </h3>
              <Badge variant="emerald" size="sm">Margem {analytics.margemLucroGeralPct}%</Badge>
            </div>
            
            <p className="text-xs text-slate-500 mb-4">Participação no faturamento bruto</p>

            <div className="space-y-3">
              {analytics.distribuicaoLucro.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{cat.categoria}</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{cat.porcentagem}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${cat.porcentagem}%`, backgroundColor: cat.corHex }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono text-right">
                    R$ {cat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              onClick={() => onNavigate('planta-baixa')}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Ver Planta Baixa do Galpão</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
