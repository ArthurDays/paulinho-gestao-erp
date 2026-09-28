import React, { useState } from 'react';
import { SheetSyncConfig, SyncHistoryLog, PecaEstoque, VeiculoDesmanche } from '../types/erp';

interface InventorySyncModuleProps {
  onSyncPecas?: (novasPecas: PecaEstoque[]) => void;
  onSyncVeiculos?: (novosVeiculos: VeiculoDesmanche[]) => void;
}

export const InventorySyncModule: React.FC<InventorySyncModuleProps> = ({
  onSyncPecas,
  onSyncVeiculos
}) => {
  // Configuração da Conexão com Google Sheets
  const [config, setConfig] = useState<SheetSyncConfig>({
    planilhaUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    planilhaId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    webhookUrl: 'https://api.paulinhogestao.com.br/v1/webhooks/sheets-sync',
    modoSincronizacao: 'AUTOMATICO_WEBHOOK',
    intervaloMinutos: 15,
    statusConexao: 'CONECTADO',
    ultimaSincronizacao: '2026-09-27 19:35:12',
    abas: [
      {
        abaNome: 'Peças',
        colunasMapeadas: {
          'A': 'ID_PECA',
          'B': 'CODIGO_OEM',
          'C': 'DESCRICAO',
          'D': 'CATEGORIA',
          'E': 'VEICULO_ORIGEM',
          'F': 'ESTANTE_ID',
          'G': 'NIVEL',
          'H': 'POSICAO',
          'I': 'PRECO_CUSTO',
          'J': 'PRECO_VENDA',
          'K': 'QUANTIDADE'
        },
        totalLinhasLidas: 142,
        ultimaAtualizacao: 'Há 5 minutos'
      },
      {
        abaNome: 'Veículos',
        colunasMapeadas: {
          'A': 'ID_VEICULO',
          'B': 'PLACA',
          'C': 'MODELO',
          'D': 'ANO',
          'E': 'CHASSI',
          'F': 'CERTIDAO_DETRAN',
          'G': 'BAIA',
          'H': 'STATUS_DESMANCHE',
          'I': 'DESCONTAMINADO'
        },
        totalLinhasLidas: 28,
        ultimaAtualizacao: 'Há 12 minutos'
      }
    ]
  });

  const [activeTab, setActiveTab] = useState<'VISAO_GERAL' | 'PECAS' | 'VEICULOS' | 'HISTORICO'>('VISAO_GERAL');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [historyLogs, setHistoryLogs] = useState<SyncHistoryLog[]>([
    {
      id: 'LOG-001',
      dataHora: '27/09/2026 19:35:12',
      origem: 'Webhook Push',
      itensAdicionados: 4,
      itensAtualizados: 12,
      status: 'SUCESSO',
      mensagem: 'Sincronização delta executada via Google Sheets API v4.'
    },
    {
      id: 'LOG-002',
      dataHora: '27/09/2026 18:40:05',
      origem: 'Arquivo CSV',
      itensAdicionados: 18,
      itensAtualizados: 0,
      status: 'SUCESSO',
      mensagem: 'Carga inicial massiva de autopeças da EST-03 e EST-04.'
    },
    {
      id: 'LOG-003',
      dataHora: '27/09/2026 16:15:30',
      origem: 'Google Sheets',
      itensAdicionados: 2,
      itensAtualizados: 5,
      status: 'SUCESSO',
      mensagem: 'Atualização de preços de venda e cotações de reposição.'
    }
  ]);

  // Simular Sincronização em Tempo Real (Webhook Pull)
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const novoLog: SyncHistoryLog = {
        id: `LOG-${Math.floor(Math.random() * 900 + 100)}`,
        dataHora: new Date().toLocaleString('pt-BR'),
        origem: 'Webhook Push',
        itensAdicionados: 3,
        itensAtualizados: 7,
        status: 'SUCESSO',
        mensagem: 'Sincronização bidirecional concluída. 10 registros integrados ao banco de dados.'
      };

      setHistoryLogs(prev => [novoLog, ...prev]);
      setConfig(prev => ({
        ...prev,
        ultimaSincronizacao: new Date().toLocaleString('pt-BR'),
        statusConexao: 'CONECTADO'
      }));

      // Injeta peças simuladas caso haja listener
      if (onSyncPecas) {
        onSyncPecas([
          {
            id: `PC-SYNC-${Math.floor(Math.random() * 900 + 100)}`,
            codigoOem: '04E145749F',
            descricao: 'Intercooler Radiador de Ar Turbo Jetta TSI',
            categoria: 'Motor',
            veiculoOrigem: 'Volkswagen Jetta 2.0 TSI (VD-001)',
            estanteId: 'EST-03',
            nivel: 2,
            posicaoRack: 'N2-P10',
            condicao: 'Grau A - Excelente',
            precoCusto: 380.0,
            precoVenda: 890.0,
            quantidadeEstoque: 2,
            estoqueMinimo: 1,
            status: 'Disponível',
            codigoBarrasQr: `QR-SYNC-${Date.now()}`,
            dataEntrada: '2026-09-27'
          }
        ]);
      }

      alert('Planilha sincronizada com sucesso! Itens atualizados no ERP.');
    }, 1200);
  };

  // Simulação de Upload de CSV
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      alert(`Arquivo "${file.name}" processado com sucesso! Mapeamento de colunas validado.`);
    };
    reader.readAsText(file);
  };

  // Download do Template CSV
  const handleDownloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID_PECA;CODIGO_OEM;DESCRICAO;CATEGORIA;VEICULO_ORIGEM;ESTANTE_ID;NIVEL;PRECO_CUSTO;PRECO_VENDA;QUANTIDADE\n" +
      "PC-001;1K0615301AA;Par de Discos de Freio Ventilados;Freios;Jetta TSI 2.0;EST-01;2;180.00;480.00;2\n" +
      "PC-002;5Q0413029;Amortecedor Dianteiro;Suspensão;Golf TSI;EST-02;3;120.00;290.00;4\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_inventario_paulinho_gestao.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header do Módulo de Sincronização */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl text-emerald-500 font-bold">
            🔄
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Sincronização Inteligente de Inventário (Google Sheets / CSV)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Webhook Ativo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Integração bidirecional em tempo real: alterações na planilha refletem no ERP instantaneamente.
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <span>📥</span>
            <span>Baixar Template CSV</span>
          </button>

          <label className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer transition flex items-center gap-1.5">
            <span>📤</span>
            <span>Importar CSV</span>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>

          <button
            disabled={isSyncing}
            onClick={handleTriggerSync}
            className="px-4 py-2 text-xs font-extrabold rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white shadow-md transition flex items-center gap-2"
          >
            <span className={isSyncing ? 'animate-spin' : ''}>⚡</span>
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
          </button>
        </div>
      </div>

      {/* Cartão de Conexão com Google Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status da Conexão */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status da API</span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Conexão Operacional</span>
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">Última Sincronização Executada:</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {config.ultimaSincronizacao}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 text-xs flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Endpoint do Webhook</span>
            <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
              {config.webhookUrl}
            </span>
          </div>
        </div>

        {/* Mapeamento da Aba Peças */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📦</span>
              <span className="font-bold text-xs text-slate-900 dark:text-white">Aba: [Peças]</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {config.abas[0].totalLinhasLidas} linhas ativas
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Mapeia automaticamente colunas de OEM, categoria, estante (`EST-01..08`), nível (`N1..N4`), preço de custo e venda.
          </p>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Sync: Bidirecional</span>
            <span>{config.abas[0].ultimaAtualizacao}</span>
          </div>
        </div>

        {/* Mapeamento da Aba Veículos */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🚗</span>
              <span className="font-bold text-xs text-slate-900 dark:text-white">Aba: [Veículos]</span>
            </div>
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
              {config.abas[1].totalLinhasLidas} veículos CDV
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Mapeia placas, certidão de baixa DETRAN, baia de elevação e checklist ambiental de fluidos da Lei 12.977.
          </p>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Sync: Webhook Push</span>
            <span>{config.abas[1].ultimaAtualizacao}</span>
          </div>
        </div>

      </div>

      {/* Histórico de Sincronizações Recentes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📋</span>
            <span>Histórico de Sincronizações & Logs de Auditoria</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Últimas operações</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-2.5 px-3">Protocolo</th>
                <th className="py-2.5 px-3">Data e Hora</th>
                <th className="py-2.5 px-3">Origem</th>
                <th className="py-2.5 px-3">Itens Adicionados</th>
                <th className="py-2.5 px-3">Itens Atualizados</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Resumo da Operação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {historyLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{log.id}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{log.dataHora}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.origem}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">+{log.itensAdicionados}</td>
                  <td className="py-3 px-3 font-mono font-bold text-sky-600 dark:text-sky-400">{log.itensAtualizados}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{log.mensagem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
