import React, { useState } from 'react';
import { DashboardAnalyticsData, KPIMetricas } from '../types/erp';

interface AnalyticsDashboardModuleProps {
  kpis: KPIMetricas;
  onNavigateTab?: (tab: string) => void;
}

export const AnalyticsDashboardModule: React.FC<AnalyticsDashboardModuleProps> = ({
  kpis,
  onNavigateTab
}) => {
  const [periodoFiltro, setPeriodoFiltro] = useState<'7D' | '30D' | 'MES_ATUAL'>('7D');

  // Dados Mock Analíticos Semanais (Compras vs Vendas)
  const dadosSemanais = [
    { dia: 'Seg', compras: 1850, vendas: 2400, lucro: 550 },
    { dia: 'Ter', compras: 2100, vendas: 3100, lucro: 1000 },
    { dia: 'Qua', compras: 1400, vendas: 2200, lucro: 800 },
    { dia: 'Qui', compras: 2900, vendas: 4100, lucro: 1200 },
    { dia: 'Sex', compras: 3400, vendas: 5200, lucro: 1800 },
    { dia: 'Sáb', compras: 2200, vendas: 3800, lucro: 1600 },
    { dia: 'Hoje', compras: kpis.totalPagoFornecedoresHoje, vendas: kpis.totalVendasBalcaoHoje, lucro: kpis.totalVendasBalcaoHoje - kpis.totalPagoFornecedoresHoje }
  ];

  // Dados do Gráfico de Rosca / Donut (Distribuição por Categoria)
  const distribuicaoCategorias = [
    { nome: 'Cobre Mel / Misto', valor: 8450.0, pct: 38, cor: '#ea580c' },
    { nome: 'Autopeças Usadas', valor: 6200.0, pct: 28, cor: '#10b981' },
    { nome: 'Alumínio Perfil/Bloco', valor: 4100.0, pct: 19, cor: '#0284c7' },
    { nome: 'Ferro & Vigas Pesadas', valor: 2150.0, pct: 10, cor: '#64748b' },
    { nome: 'Latão & Inox 304', valor: 1100.0, pct: 5, cor: '#eab308' }
  ];

  const totalFaturadoGeral = distribuicaoCategorias.reduce((acc, cur) => acc + cur.valor, 0);

  // Helper para desenhar Arcos SVG do Gráfico Donut
  let acumuladorPct = 0;
  const arcosDonut = distribuicaoCategorias.map((cat) => {
    const strokeDasharray = `${cat.pct} ${100 - cat.pct}`;
    const strokeDashoffset = 100 - acumuladorPct + 25; // Inicia no topo
    acumuladorPct += cat.pct;
    return { ...cat, strokeDasharray, strokeDashoffset };
  });

  // Escala para Gráfico de Linha/Área (max ~ 6000)
  const maxGrafico = 6000;
  const pontosVendas = dadosSemanais.map((d, idx) => {
    const x = 40 + idx * 70;
    const y = 180 - (d.vendas / maxGrafico) * 140;
    return `${x},${y}`;
  }).join(' ');

  const pontosCompras = dadosSemanais.map((d, idx) => {
    const x = 40 + idx * 70;
    const y = 180 - (d.compras / maxGrafico) * 140;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header com Filtros de Período e Auditoria */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
              Business Intelligence & Gestor LC
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Dados Consolidados</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📈</span>
            <span>Dashboard Executivo & Análise de Margem</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPeriodoFiltro('7D')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                periodoFiltro === '7D'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Últimos 7 Dias
            </button>
            <button
              onClick={() => setPeriodoFiltro('30D')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                periodoFiltro === '30D'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Últimos 30 Dias
            </button>
            <button
              onClick={() => setPeriodoFiltro('MES_ATUAL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                periodoFiltro === 'MES_ATUAL'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mês Vigente
            </button>
          </div>
        </div>
      </div>

      {/* Grid de KPIs Corporativos Flutuantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Compras Hoje */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Compras do Dia</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm">
              ↓
            </div>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-red-500">
              R$ {kpis.totalPagoFornecedoresHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Acerto a catadores e fornecedores</span>
          </div>
        </div>

        {/* KPI 2: Vendas Balcão */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vendas de Balcão</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
              ↑
            </div>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-emerald-500">
              R$ {kpis.totalVendasBalcaoHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Autopeças e reciclagem expedida</span>
          </div>
        </div>

        {/* KPI 3: Metais Pesados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Metais Pesados Hoje</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-sm">
              ⚖️
            </div>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-sky-500">
              {kpis.totalMetaisPesadosHojeKg.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Volume líquido aferido na balança</span>
          </div>
        </div>

        {/* KPI 4: Veículos em Desmonte */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pátio CDV Ativo</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm">
              🚗
            </div>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-orange-500">
              {kpis.veiculosEmDesmancheAtivos} elevadores
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Veículos baixados em desmontagem</span>
          </div>
        </div>

      </div>

      {/* Grid de Gráficos Analíticos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICO 1: EVOLUÇÃO DE FATURAMENTO DIÁRIO (COMPRAS VS VENDAS) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Fluxo Diário: Compras de Sucata vs. Vendas de Balcão
              </h3>
              <span className="text-xs text-slate-400">Margem líquida apurada por fechamento de caixa.</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-3 h-1 bg-emerald-500 rounded-full" /> Vendas
              </span>
              <span className="flex items-center gap-1.5 text-red-500">
                <span className="w-3 h-1 bg-red-500 rounded-full" /> Compras
              </span>
            </div>
          </div>

          {/* Gráfico SVG Responsivo */}
          <div className="w-full h-56 relative flex items-center justify-center">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gradVendas" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Linhas de Grade Horizontais */}
              <line x1="30" y1="40" x2="480" y2="40" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />
              <line x1="30" y1="110" x2="480" y2="110" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />
              <line x1="30" y1="180" x2="480" y2="180" stroke="#334155" opacity="0.5" />

              {/* Labels Eixo Y */}
              <text x="25" y="44" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">R$ 6k</text>
              <text x="25" y="114" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">R$ 3k</text>
              <text x="25" y="184" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">0</text>

              {/* Área preenchida Vendas */}
              <polygon
                points={`40,180 ${pontosVendas} 460,180`}
                fill="url(#gradVendas)"
              />

              {/* Linha de Vendas */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points={pontosVendas}
              />

              {/* Linha de Compras */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                points={pontosCompras}
              />

              {/* Pontos e Eixo X */}
              {dadosSemanais.map((d, idx) => {
                const x = 40 + idx * 70;
                const yV = 180 - (d.vendas / maxGrafico) * 140;
                const yC = 180 - (d.compras / maxGrafico) * 140;

                return (
                  <g key={d.dia}>
                    <circle cx={x} cy={yV} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={x} cy={yC} r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={x} y="196" textAnchor="middle" className="text-[11px] fill-slate-400 font-semibold font-mono">
                      {d.dia}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>Lucro Líquido Estimado da Semana: <strong className="text-emerald-500 font-mono font-bold">R$ 8.550,00</strong></span>
            <span className="text-slate-400">Margem Operacional Média: <strong>34.8%</strong></span>
          </div>
        </div>

        {/* GRÁFICO 2: DONUT / ROSCA DE DISTRIBUIÇÃO DE LUCRO */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Origem da Margem por Categoria
              </h3>
              <span className="text-xs text-slate-400">Faturamento ponderado por lote</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-500">
              Total R$ {(totalFaturadoGeral).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Gráfico Donut em SVG */}
          <div className="flex items-center justify-center gap-6">
            <div className="relative w-36 h-36 shrink-0">
              <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#1e293b" strokeWidth="6" />
                {arcosDonut.map((arco, idx) => (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke={arco.cor}
                    strokeWidth="6"
                    strokeDasharray={arco.strokeDasharray}
                    strokeDashoffset={arco.strokeDashoffset}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Líder</span>
                <span className="text-xs font-extrabold text-orange-500 font-mono">Cobre (38%)</span>
              </div>
            </div>

            {/* Legenda Lateral */}
            <div className="flex flex-col gap-2 text-xs">
              {distribuicaoCategorias.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.cor }} />
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px] truncate max-w-[110px]">
                      {cat.nome}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                    {cat.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Indicador de Ocupação do Galpão */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Lotação Física das 8 Estantes</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{kpis.taxaOcupacaoArmazemPct}% Ocupado</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full" style={{ width: `${kpis.taxaOcupacaoArmazemPct}%` }} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
