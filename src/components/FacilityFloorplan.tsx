import React, { useState, useMemo } from 'react';
import { Estante, VeiculoDesmanche, PecaEstoque } from '../types/erp';

interface FacilityFloorplanProps {
  estantes: Estante[];
  veiculos: VeiculoDesmanche[];
  pecas: PecaEstoque[];
  kpiComprasHoje?: number;
  kpiVendasHoje?: number;
  kpiMetaisKg?: number;
  onNavigateTab?: (tabName: 'balcao' | 'prateleiras' | 'desmanche' | 'fiscal') => void;
  onSelectEstanteFilter?: (estanteId: string) => void;
}

export const FacilityFloorplan: React.FC<FacilityFloorplanProps> = ({
  estantes,
  veiculos,
  pecas,
  kpiComprasHoje = 2130.80,
  kpiVendasHoje = 1840.00,
  kpiMetaisKg = 1450.5,
  onNavigateTab,
  onSelectEstanteFilter
}) => {
  const [selectedEstanteId, setSelectedEstanteId] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Mapeamento organizado das 8 estantes divididas por Ala
  const estantesEsquerda = useMemo(() => {
    const list = estantes.filter(e => e.ala === 'Esquerda' || ['EST-01', 'EST-02', 'EST-03', 'EST-04'].includes(e.id));
    // Ordenar de EST-04 (fundo) até EST-01 (frente)
    return list.sort((a, b) => b.id.localeCompare(a.id));
  }, [estantes]);

  const estantesDireita = useMemo(() => {
    const list = estantes.filter(e => e.ala === 'Direita' || ['EST-05', 'EST-06', 'EST-07', 'EST-08'].includes(e.id));
    // Ordenar de EST-08 (fundo) até EST-05 (frente)
    return list.sort((a, b) => b.id.localeCompare(a.id));
  }, [estantes]);

  // Estante atualmente selecionada
  const selectedEstante = useMemo(() => {
    return estantes.find(e => e.id === selectedEstanteId) || null;
  }, [estantes, selectedEstanteId]);

  // Peças associadas à estante selecionada
  const pecasDaEstante = useMemo(() => {
    if (!selectedEstanteId) return [];
    return pecas.filter(p => p.estanteId === selectedEstanteId);
  }, [pecas, selectedEstanteId]);

  // Handler de clique em uma estante individual
  const handleShelfClick = (estanteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEstanteId(estanteId);
    setIsDrawerOpen(true);
  };

  // Helper para cor da barra de ocupação
  const getOccupancyColor = (pct: number) => {
    if (pct >= 90) return 'bg-orange-500 text-orange-700';
    if (pct >= 75) return 'bg-amber-500 text-amber-700';
    return 'bg-emerald-500 text-emerald-700';
  };

  const getOccupancyBadge = (pct: number) => {
    if (pct >= 90) return 'Crítico (≥90%)';
    if (pct >= 75) return 'Atenção (75-89%)';
    return 'Normal (<75%)';
  };

  return (
    <div className="w-full flex flex-col gap-6">

      {/* ========================================================================= */}
      {/* CARD PRINCIPAL: BLUEPRINT ARQUITETÔNICO ESQUEMÁTICO (VETORIAL)             */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        
        {/* Fundo Blueprint com grid sutil de engenharia */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px), linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
            backgroundSize: '24px 24px, 120px 120px, 120px 120px'
          }}
        />

        {/* Barra Superior do Blueprint: Metadados Arquitetônicos & Orientação */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-base shadow-xs">
              📐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  Planta Baixa Esquemática do Galpão
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  Digital Twin v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Representação esquemática vetorial em 3 zonas operacionais conectadas ao ERP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 font-mono">
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md">
              Área: <strong>900 m²</strong> (40,0m × 22,5m)
            </span>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md">
              Capacidade: <strong>8 Estantes • 320 Itens</strong>
            </span>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-semibold">
              <span>▲</span>
              <span>Norte</span>
            </div>
          </div>
        </div>

        {/* CONTAINER ESTRUTURAL DAS 3 ZONAS ARQUITETÔNICAS */}
        <div className="relative z-10 flex flex-col gap-6">

          {/* ===================================================================== */}
          {/* 1. ZONA NORTE: PÁTIO DE DESMANCHE & LAVA-JATO COM CONTENÇÃO           */}
          {/* ===================================================================== */}
          <section
            onClick={() => onNavigateTab?.('desmanche')}
            onMouseEnter={() => setHoveredZone('norte')}
            onMouseLeave={() => setHoveredZone(null)}
            className={`group relative border rounded-xl p-5 transition-all duration-200 cursor-pointer shadow-xs ${
              hoveredZone === 'norte'
                ? 'border-amber-500 bg-amber-50/50 scale-[1.008]'
                : 'border-slate-200 bg-white hover:border-amber-400'
            }`}
          >
            {/* Tooltip Dinâmico ao Passar o Mouse */}
            <div className="absolute -top-3 right-6 hidden group-hover:flex items-center gap-1.5 px-3 py-1 bg-amber-600 text-white text-[11px] font-bold rounded-full shadow-md animate-fade-in">
              <span>🚗</span>
              <span>3 Elevadores Ativos • Clique para abrir o Pátio de Desmanche</span>
            </div>

            {/* Cabeçalho da Zona Norte */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Zona Norte: Pátio de Desmanche & Descontaminação Ambiental
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  (Lei Federal 12.977/2014)
                </span>
              </div>
              <span className="text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
                Acessar Pátio →
              </span>
            </div>

            {/* Grid dos 3 Elevadores + Box de Lava-Jato com Contenção */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Elevador 01 - Sedan Jetta */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between transition-all group-hover:border-amber-300">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Elevador 01 • Baia Esq.
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5">
                      VW Jetta TSI 2.0
                    </h4>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Desmontagem</span>
                    <span className="font-bold text-emerald-600">85%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                    <span>✓</span> Fluidos drenados e catalogados
                  </div>
                </div>
              </div>

              {/* Elevador 02 - SUV Compass */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between transition-all group-hover:border-amber-300">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Elevador 02 • Baia Dir.
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5">
                      Jeep Compass Flex
                    </h4>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Descontaminação</span>
                    <span className="font-bold text-amber-600">45%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="mt-2 text-[10px] text-amber-700 font-medium flex items-center gap-1">
                    <span>⚡</span> Óleo & Bateria em processo
                  </div>
                </div>
              </div>

              {/* Elevador 03 - Box Rápido de Triagem */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between transition-all group-hover:border-amber-300">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Elevador 03 • Central
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5">
                      Box Rápido de Triagem
                    </h4>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Status</span>
                    <span className="font-bold text-blue-600">Livre</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <span>📦</span> Pronto para baixa DETRAN
                  </div>
                </div>
              </div>

              {/* Box Lava-Jato com Contenção & SAO */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono mb-1">
                    <span>💧</span> Lava-Jato & Contenção
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Caixa Separadora (SAO)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    Canaletas periféricas para retenção de óleos, graxas e efluentes industriais.
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center justify-between text-[10px] font-semibold text-emerald-700">
                  <span>Conformidade CETESB</span>
                  <span className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800">100% OK</span>
                </div>
              </div>

            </div>
          </section>

          {/* ===================================================================== */}
          {/* 2. ZONA CENTRAL: CORREDOR DE PRATELEIRAS (EST-01 A EST-08)            */}
          {/* ===================================================================== */}
          <section className="relative border border-slate-200 bg-white rounded-xl p-5 shadow-xs">
            
            {/* Cabeçalho da Zona Central */}
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Zona Central: Corredor de Prateleiras (Estoque Verticalizado)
                </span>
                <span className="text-[11px] text-slate-500">
                  Clique diretamente em uma estante para inspecionar os itens armazenados
                </span>
              </div>

              <button
                onClick={() => onNavigateTab?.('prateleiras')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>Ver Catálogo Geral</span>
                <span>→</span>
              </button>
            </div>

            {/* Layout em 3 Colunas: Ala Esquerda | Corredor Central | Ala Direita */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch">

              {/* ALA ESQUERDA: EST-04 até EST-01 (4 Colunas) */}
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-1 px-1">
                  <span>Ala Esquerda (Racks 01 a 04)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Parede Oeste</span>
                </div>

                {estantesEsquerda.map((est) => {
                  const ocupacaoPct = Math.min(100, Math.round((est.ocupacaoItens / est.capacidadeMaxItens) * 100));
                  const isSelected = selectedEstanteId === est.id;

                  return (
                    <div
                      key={est.id}
                      onClick={(e) => handleShelfClick(est.id, e)}
                      className={`group/shelf border rounded-lg p-3 transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50/60 hover:border-emerald-400 hover:bg-emerald-50/20 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                            {est.id}
                          </span>
                          <span className="text-xs font-bold text-slate-800 truncate max-w-[190px]">
                            {est.titulo}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          ocupacaoPct >= 90 ? 'bg-orange-100 text-orange-800' :
                          ocupacaoPct >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ocupacaoPct}%
                        </span>
                      </div>

                      {/* Mini Barra de Progresso de Ocupação */}
                      <div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              ocupacaoPct >= 90 ? 'bg-orange-500' :
                              ocupacaoPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${ocupacaoPct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                          <span>{est.ocupacaoItens} de {est.capacidadeMaxItens} itens</span>
                          <span className="text-emerald-700 font-semibold group-hover/shelf:underline">
                            Inspecionar Peças 🔍
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CORREDOR CENTRAL DE MANOBRA DA EMPILHADEIRA (1 Coluna Estreita) */}
              <div className="lg:col-span-1 border-2 border-dashed border-amber-300 bg-amber-50/25 rounded-lg py-4 px-2 flex flex-col items-center justify-between relative overflow-hidden select-none">
                
                {/* Linha Central Guia com Setas de Tráfego */}
                <span className="text-[10px] font-bold text-amber-800 uppercase font-mono tracking-widest">
                  NORTE ▲
                </span>

                <div className="my-auto py-6 flex flex-col items-center gap-6 text-amber-700 font-mono text-[10px] font-bold uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
                  <span className="flex items-center gap-2">
                    🚜 Corredor de Empilhadeira (3,50m)
                  </span>
                  <span className="text-amber-500 text-xs">
                    ↓↓ TRÁFEGO BIDIRECIONAL ↓↓
                  </span>
                </div>

                <span className="text-[10px] font-bold text-amber-800 uppercase font-mono tracking-widest">
                  SUL ▼
                </span>
              </div>

              {/* ALA DIREITA: EST-08 até EST-05 (4 Colunas) */}
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-1 px-1">
                  <span>Ala Direita (Racks 05 a 08)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Parede Leste</span>
                </div>

                {estantesDireita.map((est) => {
                  const ocupacaoPct = Math.min(100, Math.round((est.ocupacaoItens / est.capacidadeMaxItens) * 100));
                  const isSelected = selectedEstanteId === est.id;

                  return (
                    <div
                      key={est.id}
                      onClick={(e) => handleShelfClick(est.id, e)}
                      className={`group/shelf border rounded-lg p-3 transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50/60 hover:border-emerald-400 hover:bg-emerald-50/20 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                            {est.id}
                          </span>
                          <span className="text-xs font-bold text-slate-800 truncate max-w-[190px]">
                            {est.titulo}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          ocupacaoPct >= 90 ? 'bg-orange-100 text-orange-800' :
                          ocupacaoPct >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ocupacaoPct}%
                        </span>
                      </div>

                      {/* Mini Barra de Progresso de Ocupação */}
                      <div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              ocupacaoPct >= 90 ? 'bg-orange-500' :
                              ocupacaoPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${ocupacaoPct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                          <span>{est.ocupacaoItens} de {est.capacidadeMaxItens} itens</span>
                          <span className="text-emerald-700 font-semibold group-hover/shelf:underline">
                            Inspecionar Peças 🔍
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* ===================================================================== */}
          {/* 3. ZONA SUL: BALCÃO, CAIXA & RECEPÇÃO                                 */}
          {/* ===================================================================== */}
          <section
            onClick={() => onNavigateTab?.('balcao')}
            onMouseEnter={() => setHoveredZone('sul')}
            onMouseLeave={() => setHoveredZone(null)}
            className={`group relative border rounded-xl p-5 transition-all duration-200 cursor-pointer shadow-xs ${
              hoveredZone === 'sul'
                ? 'border-blue-500 bg-blue-50/40 scale-[1.008]'
                : 'border-slate-200 bg-white hover:border-blue-400'
            }`}
          >
            {/* Tooltip Dinâmico ao Passar o Mouse */}
            <div className="absolute -top-3 right-6 hidden group-hover:flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-full shadow-md animate-fade-in">
              <span>⚖️</span>
              <span>Checkout Operacional • Clique para abrir Balcão & Balança</span>
            </div>

            {/* Cabeçalho da Zona Sul */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Zona Sul: Balcão Comercial, Balança Digital & Caixa
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  (Portão de Entrada / Rua Principal)
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition-transform">
                Acessar Balcão →
              </span>
            </div>

            {/* Layout dos 4 Postos do Balcão Aberto Minimalista */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Posto 01: Balança Comercial Digital */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3.5 transition-all group-hover:border-blue-300">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Posto 01
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Balança Digital Comercial
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Plataforma 0 a 1.500 kg (Cobre, Alumínio, Latão, Inox).
                </p>
                <div className="mt-3 px-2 py-1 bg-slate-900 text-emerald-400 font-mono text-xs font-bold rounded flex items-center justify-between">
                  <span>DISPLAY:</span>
                  <span>ESTÁVEL (0,0 kg)</span>
                </div>
              </div>

              {/* Posto 02: Balança Rodoviária / Pesada */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3.5 transition-all group-hover:border-blue-300">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Posto 02
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Balança Rodoviária
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Pesagem de caminhões, caçambas e sucatas brutas.
                </p>
                <div className="mt-3 px-2 py-1 bg-slate-900 text-emerald-400 font-mono text-xs font-bold rounded flex items-center justify-between">
                  <span>HOJE:</span>
                  <span>{kpiMetaisKg.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg</span>
                </div>
              </div>

              {/* Posto 03: Caixa & Liquidação Financeira */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3.5 transition-all group-hover:border-blue-300">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Posto 03
                  </span>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Caixa & Liquidação
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Pagamento PIX imediato, emissão de recibo e NF-e.
                </p>
                <div className="mt-3 px-2 py-1 bg-slate-900 text-sky-400 font-mono text-xs font-bold rounded flex items-center justify-between">
                  <span>PAGO PIX:</span>
                  <span>R$ {kpiComprasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Posto 04: Atendimento & Vendas Balcão */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3.5 transition-all group-hover:border-blue-300">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Posto 04
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Recepção & Vendas
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Balcão para compra de autopeças e suporte ao cliente.
                </p>
                <div className="mt-3 px-2 py-1 bg-slate-900 text-emerald-400 font-mono text-xs font-bold rounded flex items-center justify-between">
                  <span>VENDAS:</span>
                  <span>R$ {kpiVendasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLIDEOVER DRAWER: INSPEÇÃO DA ESTANTE SELECIONADA                         */}
      {/* ========================================================================= */}
      {isDrawerOpen && selectedEstante && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fade-in">
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Drawer */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-black text-white bg-slate-900 px-2.5 py-0.5 rounded">
                    {selectedEstante.id}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Ala {selectedEstante.ala}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedEstante.titulo}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ocupação: <strong>{selectedEstante.ocupacaoItens}</strong> de <strong>{selectedEstante.capacidadeMaxItens}</strong> posições ({Math.round((selectedEstante.ocupacaoItens / selectedEstante.capacidadeMaxItens) * 100)}%)
                </p>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo: Lista de Peças Catalogadas na Estante */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Peças Catalogadas neste Rack ({pecasDaEstante.length})</span>
                <span className="text-[10px] text-emerald-600 font-mono">Disponíveis</span>
              </div>

              {pecasDaEstante.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-xs font-medium">Nenhuma peça cadastrada diretamente nesta estante.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Realize a sincronização via planilha ou envie peças pelo Pátio de Desmanche.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {pecasDaEstante.map((peca) => (
                    <div 
                      key={peca.id}
                      className="border border-slate-200 rounded-lg p-3 bg-white hover:border-emerald-300 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                            {peca.codigoOem}
                          </span>
                          <h5 className="text-xs font-bold text-slate-800 mt-1">
                            {peca.descricao}
                          </h5>
                          <span className="text-[11px] text-slate-500">
                            {peca.veiculoOrigem}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-black text-emerald-700 whitespace-nowrap">
                          R$ {peca.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Posição: <strong>{peca.posicaoRack || `N${peca.nivel}-P01`}</strong></span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {peca.condicao}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rodapé com Ação Rápida */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  if (onSelectEstanteFilter) {
                    onSelectEstanteFilter(selectedEstante.id);
                  }
                  if (onNavigateTab) {
                    onNavigateTab('prateleiras');
                  }
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>📦</span>
                <span>Filtrar no Módulo de Prateleiras</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
