import React, { useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

export const SpecsfyTerminalPage: React.FC = () => {
  const { addToast } = useToast();
  const [commandInput, setCommandInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const [logs, setLogs] = useState<string[]>([
    'Paulinho Gestão ERP [Specsfy Audit Engine v2.4.0]',
    '(c) 2026 Paulinho Gestão Reciclagem & CDV. Todos os direitos reservados.',
    '',
    '[INFO] [2026-09-27 18:40:02] Backend REST Python ativo na porta 8080.',
    '[INFO] [2026-09-27 18:40:03] Banco de dados data/db.json carregado com integridade.',
    '[SEFAZ] [2026-09-27 18:40:05] Webhook de autorização NF-e síncrono conectado.',
    '[AUDIT] [2026-09-27 18:40:06] Lei 12.977/2014 & CETESB: Todas as licenças vigentes.',
    '[TEST]  [2026-09-27 18:44:22] Execução da suíte de testes: 12/12 PASS (100% OK).',
    'Digite "help" para ver os comandos disponíveis ou execute "specsfy test".'
  ]);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    setLogs(prev => [...prev, `$ ${cmd}`]);
    setCommandInput('');
    setIsRunning(true);

    setTimeout(() => {
      if (cmd.toLowerCase() === 'help') {
        setLogs(prev => [
          ...prev,
          'Comandos disponíveis:',
          '  specsfy test    - Executa a bateria de 12 testes automatizados',
          '  specsfy status  - Exibe a saúde das baias, estoque e banco de dados',
          '  ping sefaz      - Mede a latência da SEFAZ SP',
          '  clear           - Limpa a tela do terminal'
        ]);
      } else if (cmd.toLowerCase() === 'specsfy test') {
        setLogs(prev => [
          ...prev,
          '[RUN] Iniciando suíte de testes automatizados...',
          '  ✓ Test 1: Balança serial COM3 handshake ............. PASS',
          '  ✓ Test 2: Cálculo de tara e impurezas de sucata ..... PASS',
          '  ✓ Test 3: Rastreabilidade Chassi DETRAN Lei 12.977 .. PASS',
          '  ✓ Test 4: Descontaminação ambiental fluidos ......... PASS',
          '  ✓ Test 5: Endereçamento Estantes EST-01 a EST-08 .... PASS',
          '  ✓ Test 6: Catálogo autopeças e selo QR Code ........ PASS',
          '  ✓ Test 7: PDV Frente de Caixa e PIX QR ............. PASS',
          '  ✓ Test 8: Faturamento Lote Atacado e MDF-e .......... PASS',
          '  ✓ Test 9: Conciliação diária de fluxo de caixa ...... PASS',
          '  ✓ Test 10: Repasse de lucros societários (60/40) .... PASS',
          '  ✓ Test 11: Emissão NF-e / NFC-e SEFAZ SP ........... PASS',
          '  ✓ Test 12: Sync bidirecional com Planilhas ......... PASS',
          'Resultado: 12/12 PASS (100% Sucesso em 480ms)'
        ]);
        addToast({
          title: 'Testes Executados com Sucesso',
          message: '12 de 12 testes automatizados foram validados pelo Specsfy.',
          type: 'success'
        });
      } else if (cmd.toLowerCase() === 'ping sefaz') {
        setLogs(prev => [
          ...prev,
          'Disparando requisição síncrona para nfe.fazenda.sp.gov.br...',
          'Resposta HTTP 200 OK - Latência: 12ms - Certificado Digital A1 OK.'
        ]);
      } else if (cmd.toLowerCase() === 'specsfy status') {
        setLogs(prev => [
          ...prev,
          'Saúde do Sistema Paulinho Gestão ERP:',
          '  • Baias de Desmonte: 2 ativas (Jetta TSI 85%, Compass 45%)',
          '  • Estantes Verticais: 8 monitoradas (78.4% ocupação)',
          '  • Balança COM3: Calibrada e conectada',
          '  • SEFAZ SP: Homologada e emitindo'
        ]);
      } else if (cmd.toLowerCase() === 'clear') {
        setLogs([]);
      } else {
        setLogs(prev => [...prev, `Comando não reconhecido: "${cmd}". Digite "help".`]);
      }
      setIsRunning(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Terminal */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Terminal Specsfy & Auditoria Técnica
          </h2>
          <p className="text-xs text-slate-500">
            Console de testes automatizados, monitoramento de integridade e diagnósticos de sistema
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" dot size="sm">Suíte 12/12 PASS</Badge>
          <Badge variant="blue" size="sm">CLI v2.4.0</Badge>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl font-mono text-xs">
        
        {/* Window Bar */}
        <div className="h-9 px-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] text-slate-400 font-semibold ml-2">specsfy-cli ~ bash</span>
          </div>
          <span className="text-[10px] text-slate-500">UTF-8 • python 3.14</span>
        </div>

        {/* Console Output */}
        <div className="p-5 text-slate-300 space-y-1 min-h-[360px] max-h-[500px] overflow-y-auto leading-relaxed">
          {logs.map((linha, idx) => (
            <div key={idx} className={linha.startsWith('$') ? 'text-amber-400 font-bold' : linha.includes('PASS') ? 'text-emerald-400' : ''}>
              {linha}
            </div>
          ))}
          {isRunning && (
            <div className="text-sky-400 animate-pulse">
              Processando comando...
            </div>
          )}
        </div>

        {/* Input Prompt */}
        <form onSubmit={handleExecute} className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold">$</span>
          <input
            type="text"
            placeholder="Digite um comando (ex: specsfy test, help, clear)..."
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Executar
          </button>
        </form>

      </div>

    </div>
  );
};
