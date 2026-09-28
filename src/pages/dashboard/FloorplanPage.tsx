import React, { useState } from 'react';
import { Estante, VeiculoDesmanche, PecaEstoque, KPIMetricas } from '../../types/erp';
import { NavigationModuleId } from '../../types/navigation';
import { FacilityFloorplan } from '../../components/FacilityFloorplan';
import { Badge } from '../../components/common/Badge';

interface FloorplanPageProps {
  estantes: Estante[];
  veiculos: VeiculoDesmanche[];
  pecas: PecaEstoque[];
  kpis: KPIMetricas;
  onNavigate: (moduleId: NavigationModuleId) => void;
}

export const FloorplanPage: React.FC<FloorplanPageProps> = ({
  estantes,
  veiculos,
  pecas,
  kpis,
  onNavigate
}) => {
  const [activeSector, setActiveSector] = useState<'TODOS' | 'PATIO' | 'PRATELEIRAS' | 'BALCAO'>('TODOS');

  // Mapear rota de navegação
  const handleNavigateTab = (tabName: 'balcao' | 'prateleiras' | 'desmanche' | 'fiscal') => {
    switch (tabName) {
      case 'balcao':
        onNavigate('balanca-recepcao');
        break;
      case 'prateleiras':
        onNavigate('prateleiras-estantes');
        break;
      case 'desmanche':
        onNavigate('linha-desmontagem');
        break;
      case 'fiscal':
        onNavigate('suite-fiscal-sefaz');
        break;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Filtro de Setor & Estatísticas Rápidas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Filtros em Pill */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
          <button
            onClick={() => setActiveSector('TODOS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSector === 'TODOS'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Visão Completa
          </button>
          <button
            onClick={() => setActiveSector('PATIO')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSector === 'PATIO'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Zona Norte (Pátio CDV)
          </button>
          <button
            onClick={() => setActiveSector('PRATELEIRAS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSector === 'PRATELEIRAS'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Zona Central (EST 01..08)
          </button>
          <button
            onClick={() => setActiveSector('BALCAO')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSector === 'BALCAO'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Zona Sul (Balança & Balcão)
          </button>
        </div>

        {/* Badges de Status do Galpão */}
        <div className="flex items-center gap-2">
          <Badge variant="emerald" dot size="sm">
            Digital Twin Ativo
          </Badge>
          <Badge variant="slate" size="sm">
            Escala 1:100 Industrial
          </Badge>
        </div>

      </div>

      {/* Renderização do Componente de Planta Baixa Interativa */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-xs overflow-hidden">
        <FacilityFloorplan
          estantes={estantes}
          veiculos={veiculos}
          pecas={pecas}
          kpiComprasHoje={kpis.totalPagoFornecedoresHoje}
          kpiVendasHoje={kpis.totalVendasBalcaoHoje}
          kpiMetaisKg={kpis.totalMetaisPesadosHojeKg}
          onNavigateTab={handleNavigateTab}
          onSelectEstanteFilter={(id) => {
            onNavigate('prateleiras-estantes');
          }}
        />
      </div>

    </div>
  );
};
