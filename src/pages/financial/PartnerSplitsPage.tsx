import React, { useState } from 'react';
import { SocioRepasse } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface PartnerSplitsPageProps {
  socios: SocioRepasse[];
  onLiquidarRepasse?: (socioId: string) => void;
}

export const PartnerSplitsPage: React.FC<PartnerSplitsPageProps> = ({
  socios,
  onLiquidarRepasse
}) => {
  const { addToast } = useToast();
  const [listaSocios, setListaSocios] = useState<SocioRepasse[]>(socios);

  const lucroTotalPeriodo = 38400.00;
  const totalRepasses = listaSocios.reduce((acc, s) => acc + s.valorTotalRepasse, 0);

  const handlePagarPix = (socio: SocioRepasse) => {
    setListaSocios(prev => prev.map(s => s.id === socio.id ? { ...s, statusPagamento: 'Transferido' } : s));
    if (onLiquidarRepasse) onLiquidarRepasse(socio.id);

    addToast({
      title: 'Repasse Liquidado via Pix',
      message: `R$ ${socio.valorTotalRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} transferido para ${socio.nome}.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Sócios */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Divisão de Sócios & Repasses de Lucro
          </h2>
          <p className="text-xs text-slate-500">
            Cálculo automático de participação conforme Contrato Social, pró-labore e reembolso de despesas operacionais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" dot size="sm">Contrato Social Registrado</Badge>
          <Badge variant="purple" size="sm">Regime de Competência</Badge>
        </div>
      </div>

      {/* Resumo do Período */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Lucro Líquido Base do Período</span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            R$ {lucroTotalPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Faturamento menos despesas operacionais
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Distribuível aos Sócios</span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            R$ {totalRepasses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Pró-labore + Dividendos isentos
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Reserva de Capital de Giro</span>
          <div className="mt-2 text-2xl font-bold font-mono text-sky-600 dark:text-sky-400">
            R$ 8.500,00
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Retenção para compra de novos lotes de sucata
          </span>
        </div>
      </div>

      {/* Cards dos Sócios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listaSocios.map(socio => (
          <div
            key={socio.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {socio.nome}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Cota de Participação: {socio.percentualParticipacao}%
                  </span>
                </div>
                <Badge
                  variant={socio.statusPagamento === 'Transferido' ? 'emerald' : 'amber'}
                  size="sm"
                >
                  {socio.statusPagamento}
                </Badge>
              </div>

              {/* Detalhamento do Cálculo */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Pró-Labore Mensal:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    R$ {socio.valorProLabore.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Distribuição de Dividendos ({socio.percentualParticipacao}%):</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    R$ {(socio.lucroPeriodoBase * (socio.percentualParticipacao / 100) - socio.valorProLabore).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Despesas Reembolsáveis Comprovadas:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    + R$ {socio.despesasReembolsaveis.toFixed(2)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm font-bold">
                  <span className="text-slate-800 dark:text-slate-200">Total a Repassar:</span>
                  <span className="text-lg text-emerald-600 dark:text-emerald-400">
                    R$ {socio.valorTotalRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Chave Pix Cadastrada</span>
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {socio.chavePix}
                </span>
              </div>

              {socio.statusPagamento === 'Pendente' ? (
                <button
                  onClick={() => handlePagarPix(socio)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Transferir Pix</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  ✓ Liquidado em Conta
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
