import React from 'react';
import { LicencaAmbiental, ManifestoDestinacaoResiduo } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface ComplianceEnvironmentalPageProps {
  licencas: LicencaAmbiental[];
  manifestos: ManifestoDestinacaoResiduo[];
}

export const ComplianceEnvironmentalPage: React.FC<ComplianceEnvironmentalPageProps> = ({
  licencas,
  manifestos
}) => {
  const { addToast } = useToast();

  const handleDownloadLicenca = (lic: LicencaAmbiental) => {
    addToast({
      title: 'Download de Certificado',
      message: `${lic.titulo} (${lic.numeroLicenca}) baixado para auditoria.`,
      type: 'info'
    });
  };

  const handleEmitirMtr = () => {
    addToast({
      title: 'Novo Manifesto MTR Digital',
      message: 'Documento homologado no sistema SIGOR / SINIR aberto para preenchimento.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Conformidade */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Conformidade Ambiental & Suíte Legal CDV
          </h2>
          <p className="text-xs text-slate-500">
            Licenças de operação CETESB/IBAMA, credenciamento DETRAN (Lei 12.977/2014) e manifestos de resíduos MTR
          </p>
        </div>

        <button
          onClick={handleEmitirMtr}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Emitir Manifesto MTR</span>
        </button>
      </div>

      {/* Grid de Licenças Regulatórias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {licencas.map(lic => {
          const isVigente = lic.status === 'VIGENTE';
          const isRenovacao = lic.status === 'RENOVACAO_SOLICITADA';

          return (
            <div
              key={lic.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {lic.orgaoEmissor} • {lic.numeroLicenca}
                  </span>
                  <Badge
                    variant={isVigente ? 'emerald' : isRenovacao ? 'amber' : 'rose'}
                    size="sm"
                  >
                    {lic.status}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {lic.titulo}
                </h3>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Emitido: {lic.dataEmissao}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Vence em: {lic.dataVencimento}
                  </span>
                </div>

                {/* Status de dias */}
                <div className="mt-2 text-xs">
                  {lic.diasParaVencer > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Válido por mais {lic.diasParaVencer} dias
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      ⚠ Processo de renovação protocolado junto ao órgão
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => handleDownloadLicenca(lic)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Baixar Certificado PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manifesto de Transporte de Resíduos Perigosos (MTR) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Manifestos de Transporte de Resíduos (MTR) & Destinação
            </h3>
            <span className="text-xs text-slate-500">
              Rastreamento de óleo usado (OLUC), baterias e fluidos conforme Resolução CONAMA 362/05
            </span>
          </div>
          <Badge variant="emerald" dot size="sm">Auditoria Ambiental Aprovada</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 uppercase font-mono">
                <th className="py-2.5">Código MTR</th>
                <th className="py-2.5">Tipo de Resíduo Perigoso</th>
                <th className="py-2.5">Quantidade Coletada</th>
                <th className="py-2.5">Transportador Homologado</th>
                <th className="py-2.5">Destinador Final</th>
                <th className="py-2.5">Data Coleta</th>
                <th className="py-2.5 text-right">Certificado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {manifestos.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-bold text-slate-900 dark:text-slate-100">
                    {m.id}
                  </td>
                  <td className="py-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                    {m.tipoResiduo}
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-slate-100">
                    {m.quantidadeLitrosKg} L/kg
                  </td>
                  <td className="py-3 font-sans text-slate-600 dark:text-slate-400">
                    {m.transportadorCertificado}
                  </td>
                  <td className="py-3 font-sans text-slate-600 dark:text-slate-400">
                    {m.destinadorFinal}
                  </td>
                  <td className="py-3 text-slate-500">
                    {m.dataColeta}
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold">
                      {m.certificadoDestinacaoNumero}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
