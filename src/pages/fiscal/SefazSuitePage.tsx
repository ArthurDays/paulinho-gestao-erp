import React, { useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

export const SefazSuitePage: React.FC = () => {
  const { addToast } = useToast();
  const [ambiente, setAmbiente] = useState<'PRODUCAO' | 'HOMOLOGACAO'>('PRODUCAO');

  const [notasFiscais] = useState([
    {
      id: 'NFE-1428',
      modelo: 'NF-e (Mod 55)',
      destinatario: 'Siderúrgica & Fundição AçoForte S/A',
      cnpj: '03.921.847/0001-90',
      valor: 20542.50,
      chave: '35260903921847000190550010000014281298410291',
      data: '27/09/2026 18:10',
      status: 'Autorizada'
    },
    {
      id: 'NFCE-0891',
      modelo: 'NFC-e (Mod 65)',
      destinatario: 'Carlos Eduardo Mendonça',
      cnpj: '421.789.012-33',
      valor: 650.00,
      chave: '35260903921847000190650010000008911298410041',
      data: '27/09/2026 17:45',
      status: 'Autorizada'
    },
    {
      id: 'NFCE-0890',
      modelo: 'NFC-e (Mod 65)',
      destinatario: 'Auto Mecânica São Jorge Ltda',
      cnpj: '14.283.910/0001-55',
      valor: 480.00,
      chave: '35260903921847000190650010000008901298410882',
      data: '27/09/2026 14:12',
      status: 'Autorizada'
    }
  ]);

  const handleTestarSefaz = () => {
    addToast({
      title: 'Status SEFAZ SP: 100% Operacional',
      message: 'Webservice v4.00 respondendo em 14ms. Certificado Digital A1 válido até 12/2027.',
      type: 'success'
    });
  };

  const handleDownloadXml = (chave: string) => {
    addToast({
      title: 'Download XML Iniciado',
      message: `Arquivo XML assinado com Chave ${chave.substring(0, 16)}... baixado.`,
      type: 'info'
    });
  };

  const handleImprimirDanfe = (id: string) => {
    addToast({
      title: 'DANFE Gerado',
      message: `Documento Auxiliar da Nota Fiscal ${id} pronto para impressão térmica.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner SEFAZ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Suíte Fiscal SEFAZ (NF-e & NFC-e)
          </h2>
          <p className="text-xs text-slate-500">
            Emissão eletrônica integrada, contingência offline e conformidade tributária ICMS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setAmbiente('PRODUCAO')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                ambiente === 'PRODUCAO'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Produção SEFAZ
            </button>
            <button
              onClick={() => setAmbiente('HOMOLOGACAO')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                ambiente === 'HOMOLOGACAO'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Homologação / Teste
            </button>
          </div>

          <button
            onClick={handleTestarSefaz}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Testar SEFAZ</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas Tributárias */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Saldo ICMS Crédito</span>
            <Badge variant="emerald" size="sm">Diferimento</Badge>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            R$ 4.120,30
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Isenção/Diferimento Sucata SP Art. 392 RICMS
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">NF-e Emitidas no Mês</span>
            <Badge variant="blue" size="sm">Modelo 55</Badge>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            18 Notas
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            R$ 142.850,00 faturados
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">NFC-e Emitidas no Balcão</span>
            <Badge variant="purple" size="sm">Modelo 65</Badge>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            94 Cupons
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Tempo médio de autorização: 1.2s
          </div>
        </div>
      </div>

      {/* Tabela de Notas Fiscais */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Documentos Fiscais Transmitidos à SEFAZ
          </h3>
          <Badge variant="emerald" dot size="sm">Transmissão Síncrona Ativa</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 uppercase font-mono">
                <th className="py-2.5">Documento / Modelo</th>
                <th className="py-2.5">Destinatário</th>
                <th className="py-2.5">Chave de Acesso (44 Dígitos)</th>
                <th className="py-2.5">Data Emissão</th>
                <th className="py-2.5 text-right">Valor Total</th>
                <th className="py-2.5 text-center">Status SEFAZ</th>
                <th className="py-2.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {notasFiscais.map(nf => (
                <tr key={nf.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{nf.id}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{nf.modelo}</span>
                  </td>
                  <td className="py-3 text-slate-800 dark:text-slate-200">
                    <div className="font-medium">{nf.destinatario}</div>
                    <span className="text-[10px] text-slate-400 font-mono">Doc: {nf.cnpj}</span>
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-500 max-w-[220px] truncate" title={nf.chave}>
                    {nf.chave}
                  </td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">
                    {nf.data}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                    R$ {nf.valor.toFixed(2)}
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant="emerald" size="sm">
                      {nf.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleImprimirDanfe(nf.id)}
                        className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                      >
                        DANFE
                      </button>
                      <button
                        onClick={() => handleDownloadXml(nf.chave)}
                        className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                      >
                        XML
                      </button>
                    </div>
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
