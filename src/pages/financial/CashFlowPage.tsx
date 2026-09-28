import React, { useState } from 'react';
import { LancamentoFluxoCaixa, MetodoLiquidacao, TipoLancamentoFinanceiro } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface CashFlowPageProps {
  lancamentos: LancamentoFluxoCaixa[];
  onNovoLancamento?: (lancamento: LancamentoFluxoCaixa) => void;
}

export const CashFlowPage: React.FC<CashFlowPageProps> = ({
  lancamentos,
  onNovoLancamento
}) => {
  const { addToast } = useToast();
  const [tipoFiltro, setTipoFiltro] = useState<'TODOS' | 'ENTRADA' | 'SAIDA'>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [tipoLanc, setTipoLanc] = useState<TipoLancamentoFinanceiro>('SAIDA');
  const [categoria, setCategoria] = useState('Infraestrutura / Servidor VPS');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number>(149.90);
  const [formaPag, setFormaPag] = useState<MetodoLiquidacao>('CARTAO');

  const lancamentosFiltrados = lancamentos.filter(l => {
    if (tipoFiltro === 'TODOS') return true;
    return l.tipo === tipoFiltro;
  });

  const totalEntradas = lancamentos
    .filter(l => l.tipo === 'ENTRADA')
    .reduce((acc, l) => acc + l.valor, 0);

  const totalSaidas = lancamentos
    .filter(l => l.tipo === 'SAIDA')
    .reduce((acc, l) => acc + l.valor, 0);

  const saldoConsolidado = totalEntradas - totalSaidas + 35000; // Saldo de abertura base

  const handleSalvarLancamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      addToast({
        title: 'Descrição Obrigatória',
        message: 'Preencha a descrição do lançamento.',
        type: 'warning'
      });
      return;
    }

    const novo: LancamentoFluxoCaixa = {
      id: `LAN-2026-${Math.floor(100 + Math.random() * 900)}`,
      dataHora: new Date().toLocaleString('pt-BR'),
      tipo: tipoLanc,
      categoria,
      descricao,
      valor,
      formaPagamento: formaPag,
      saldoAposLancamento: tipoLanc === 'ENTRADA' ? saldoConsolidado + valor : saldoConsolidado - valor
    };

    if (onNovoLancamento) onNovoLancamento(novo);

    addToast({
      title: 'Lançamento Financeiro Efetuado',
      message: `${tipoLanc === 'ENTRADA' ? 'Crédito' : 'Débito'} de R$ ${valor.toFixed(2)} registrado com sucesso.`,
      type: 'success'
    });

    setIsModalOpen(false);
    setDescricao('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Financeiro */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Fluxo de Caixa Diário Consolidado
          </h2>
          <p className="text-xs text-slate-500">
            Entradas operacionais, custos de VPS, compras de materiais e conciliação bancária
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Saldo Consolidado */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Saldo Consolidado</span>
            <Badge variant="blue" size="sm">Caixa + Bancos</Badge>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              R$ {saldoConsolidado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Última conciliação: Hoje às 18:45
          </div>
        </div>

        {/* Total Entradas Hoje */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total de Entradas</span>
            <Badge variant="emerald" size="sm">Receitas</Badge>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              + R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Vendas balcão e lotes de atacado
          </div>
        </div>

        {/* Total Saídas Hoje */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total de Saídas</span>
            <Badge variant="rose" size="sm">Despesas</Badge>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
              - R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            Compras de sucata e custos operacionais
          </div>
        </div>

      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Extrato de Movimentações
          </h3>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setTipoFiltro('TODOS')}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                tipoFiltro === 'TODOS' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTipoFiltro('ENTRADA')}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                tipoFiltro === 'ENTRADA' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setTipoFiltro('SAIDA')}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                tipoFiltro === 'SAIDA' ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Saídas
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 uppercase font-mono">
                <th className="py-2.5">Data / Hora</th>
                <th className="py-2.5">Categoria</th>
                <th className="py-2.5">Descrição</th>
                <th className="py-2.5 text-center">Forma</th>
                <th className="py-2.5 text-right">Valor</th>
                <th className="py-2.5 text-right">Saldo Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {lancamentosFiltrados.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 text-slate-500">
                    {l.dataHora}
                  </td>
                  <td className="py-3 font-sans">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{l.categoria}</span>
                  </td>
                  <td className="py-3 font-sans text-slate-600 dark:text-slate-400">
                    {l.descricao}
                  </td>
                  <td className="py-3 text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                      {l.formaPagamento}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-bold text-sm ${
                    l.tipo === 'ENTRADA' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {l.tipo === 'ENTRADA' ? '+' : '-'} R$ {l.valor.toFixed(2)}
                  </td>
                  <td className="py-3 text-right text-slate-700 dark:text-slate-300 font-semibold">
                    R$ {l.saldoAposLancamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Lançamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Novo Lançamento no Fluxo de Caixa
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSalvarLancamento} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Operação
                  </label>
                  <select
                    value={tipoLanc}
                    onChange={(e) => setTipoLanc(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="SAIDA">Saída / Despesa (-)</option>
                    <option value="ENTRADA">Entrada / Receita (+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Infraestrutura / Servidor VPS">Infraestrutura / Servidor VPS</option>
                    <option value="Compra Sucata Fornecedor">Compra Sucata Fornecedor</option>
                    <option value="Manutenção Equipamentos / Balança">Manutenção Balança / Pátio</option>
                    <option value="Combustível Empilhadeira / Caminhão">Combustível Empilhadeira</option>
                    <option value="Despesas Administrativas">Despesas Administrativas</option>
                    <option value="Taxas DETRAN / Licenças">Taxas DETRAN / Licenças</option>
                    <option value="Venda Balcão">Venda Balcão</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Descrição do Lançamento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mensalidade Cloud Hostinger e Backup Diário"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={formaPag}
                    onChange={(e) => setFormaPag(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  >
                    <option value="CARTAO">Cartão Corporativo</option>
                    <option value="PIX">Pix</option>
                    <option value="DINHEIRO">Dinheiro</option>
                    <option value="TRANSFERENCIA">Transferência Bancária</option>
                  </select>
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
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
