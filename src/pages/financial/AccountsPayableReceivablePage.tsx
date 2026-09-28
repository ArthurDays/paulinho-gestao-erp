import React, { useState } from 'react';
import { ContaPagarReceber } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface AccountsPayableReceivablePageProps {
  contas: ContaPagarReceber[];
  onLiquidarConta?: (contaId: string) => void;
  onNovaConta?: (conta: ContaPagarReceber) => void;
}

export const AccountsPayableReceivablePage: React.FC<AccountsPayableReceivablePageProps> = ({
  contas,
  onLiquidarConta,
  onNovaConta
}) => {
  const { addToast } = useToast();
  const [tipoFiltro, setTipoFiltro] = useState<'TODAS' | 'PAGAR' | 'RECEBER'>('TODAS');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [tipo, setTipo] = useState<'PAGAR' | 'RECEBER'>('PAGAR');
  const [descricao, setDescricao] = useState('');
  const [parceiro, setParceiro] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [valor, setValor] = useState<number>(500);
  const [categoria, setCategoria] = useState('Manutenção Pátio');

  const contasFiltradas = contas.filter(c => {
    if (tipoFiltro === 'TODAS') return true;
    return c.tipo === tipoFiltro;
  });

  const totalPagar = contas
    .filter(c => c.tipo === 'PAGAR' && c.status === 'ABERTO')
    .reduce((acc, c) => acc + c.valor, 0);

  const totalReceber = contas
    .filter(c => c.tipo === 'RECEBER' && c.status === 'ABERTO')
    .reduce((acc, c) => acc + c.valor, 0);

  const handleLiquidar = (c: ContaPagarReceber) => {
    if (onLiquidarConta) onLiquidarConta(c.id);
    addToast({
      title: 'Título Liquidado',
      message: `${c.tipo === 'PAGAR' ? 'Pagamento' : 'Recebimento'} de R$ ${c.valor.toFixed(2)} liquidado no banco.`,
      type: 'success'
    });
  };

  const handleSalvarNova = (e: React.FormEvent) => {
    e.preventDefault();
    const nova: ContaPagarReceber = {
      id: `CPR-00${contas.length + 1}`,
      tipo,
      descricao,
      parceiroNome: parceiro,
      dataVencimento: vencimento || '15/10/2026',
      valor,
      status: 'ABERTO',
      categoria
    };

    if (onNovaConta) onNovaConta(nova);

    addToast({
      title: 'Título Cadastrado',
      message: `Conta a ${tipo.toLowerCase()} registrada com vencimento em ${nova.dataVencimento}.`,
      type: 'info'
    });

    setIsModalOpen(false);
    setDescricao('');
    setParceiro('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Contas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Contas a Pagar & Receber (Duplicatas e Boletos)
          </h2>
          <p className="text-xs text-slate-500">
            Gestão de compromissos com fornecedores, despachantes, CETESB e recebíveis de indústrias
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Novo Título</span>
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Contas a Pagar em Aberto</span>
            <Badge variant="rose" size="sm">Compromissos</Badge>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
              R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Licenças CETESB, manutenção de elevadores e despachante
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Contas a Receber em Aberto</span>
            <Badge variant="emerald" size="sm">Previsão</Badge>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Siderúrgicas e vendas de sucata a prazo faturadas
          </div>
        </div>
      </div>

      {/* Tabela de Contas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Duplicatas e Títulos Financeiros
          </h3>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setTipoFiltro('TODAS')}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                tipoFiltro === 'TODAS' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setTipoFiltro('PAGAR')}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                tipoFiltro === 'PAGAR' ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              A Pagar
            </button>
            <button
              onClick={() => setTipoFiltro('RECEBER')}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                tipoFiltro === 'RECEBER' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              A Receber
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 uppercase font-mono">
                <th className="py-2.5">Descrição do Título</th>
                <th className="py-2.5">Parceiro / Credor</th>
                <th className="py-2.5">Vencimento</th>
                <th className="py-2.5">Categoria</th>
                <th className="py-2.5 text-right">Valor</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {contasFiltradas.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-sans">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{c.descricao}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{c.id}</span>
                  </td>
                  <td className="py-3 font-sans text-slate-700 dark:text-slate-300">
                    {c.parceiroNome}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    {c.dataVencimento}
                  </td>
                  <td className="py-3 font-sans">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {c.categoria}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold text-sm text-slate-900 dark:text-slate-100">
                    R$ {c.valor.toFixed(2)}
                  </td>
                  <td className="py-3 text-center font-sans">
                    <Badge variant={c.status === 'PAGO' ? 'emerald' : c.status === 'ABERTO' ? 'amber' : 'rose'} size="sm">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-sans">
                    {c.status === 'ABERTO' && (
                      <button
                        onClick={() => handleLiquidar(c)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
                      >
                        Liquidar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Título */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Cadastrar Novo Título Financeiro
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSalvarNova} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tipo do Título
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="PAGAR">Conta a Pagar (Boleto/Taxa)</option>
                    <option value="RECEBER">Conta a Receber (Cliente)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Renovação Licença CETESB"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Parceiro / Fornecedor
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CETESB SP"
                    value={parceiro}
                    onChange={(e) => setParceiro(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                >
                  Salvar Título
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
