import React from 'react';

interface MiniFloorplanFilterProps {
  selectedZone: 'BALCAO' | 'PRATELEIRAS' | 'PATIO' | null;
  onSelectZone: (zone: 'BALCAO' | 'PRATELEIRAS' | 'PATIO') => void;
}

export const MiniFloorplanFilter: React.FC<MiniFloorplanFilterProps> = ({
  selectedZone,
  onSelectZone
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🗺️</span>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Navegação Rápida por Setor Físico
          </h4>
        </div>
        <span className="text-[10px] text-slate-400 font-semibold">Clique para filtrar</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        
        {/* Setor 3: Pátio de Desmanche */}
        <div
          onClick={() => onSelectZone('PATIO')}
          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 text-center ${
            selectedZone === 'PATIO'
              ? 'bg-orange-500 text-white border-orange-500 shadow-md ring-2 ring-orange-500/30'
              : 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40 hover:border-orange-500 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="text-lg">🚗</span>
          <span className="font-extrabold text-[11px] leading-tight">Pátio CDV</span>
          <span className={`text-[9px] ${selectedZone === 'PATIO' ? 'text-orange-100' : 'text-slate-400'}`}>
            Fundo • Laranja
          </span>
        </div>

        {/* Setor 2: Prateleiras */}
        <div
          onClick={() => onSelectZone('PRATELEIRAS')}
          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 text-center ${
            selectedZone === 'PRATELEIRAS'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-500 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="text-lg">📦</span>
          <span className="font-extrabold text-[11px] leading-tight">Prateleiras</span>
          <span className={`text-[9px] ${selectedZone === 'PRATELEIRAS' ? 'text-emerald-100' : 'text-slate-400'}`}>
            Centro • Verde
          </span>
        </div>

        {/* Setor 1: Balcão & Balança */}
        <div
          onClick={() => onSelectZone('BALCAO')}
          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 text-center ${
            selectedZone === 'BALCAO'
              ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-500/30'
              : 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/40 hover:border-sky-500 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="text-lg">⚖️</span>
          <span className="font-extrabold text-[11px] leading-tight">Balcão</span>
          <span className={`text-[9px] ${selectedZone === 'BALCAO' ? 'text-sky-100' : 'text-slate-400'}`}>
            Frente • Azul
          </span>
        </div>

      </div>
    </div>
  );
};
