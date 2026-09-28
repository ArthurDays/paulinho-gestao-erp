import React, { useState } from 'react';
import { OrcamentoOficina, ParceiroComercial } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface QuotesOrdersPageProps {
  orcamentos: OrcamentoOficina[];
  parceiros: ParceiroComercial[];
  onConverterVenda?: (orcamento: OrcamentoOficina) => void;
  onNovoOrcamento?: (orcamento: OrcamentoOficina) => void;
}

export const QuotesOrdersPage: React.FC<QuotesOrdersPageProps> = ({
  orcamentos,
  parceiros,
  onConverterVenda,
  onNovoOrcamento
}) => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [selectedOficinaId, setSelectedOficinaId] = useState(parceiros[1]?.id || '');
  const [veiculoRef, setVeiculoRef] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPreco, setItemPreco] = useState(450.0);

  const handleConverter = (orc: OrcamentoOficina) => {
    if (onConverterVenda) onConverterVenda(orc);
    addToast({
      title: 'Orçamento Convertido em Venda!',
      message: `${orc.id} aprovado pela oficina ${orc.oficinaParceira.nome}. Venda faturada.`,
      type: 'success'
    });
  };

  const handleSalvarNovo = (e: React.FormEvent) => {
    e.preventDefault();
    const oficina = parceiros.find(p => p.id === selectedOficinaId) || parceiros[1];

    const novo: OrcamentoOficina = {
      id: `ORC-2026-0${orcamentos.length + 89}`,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
      validadeDias: 5,
      oficinaParceira: oficina,
      veiculoReferencia: veiculoRef || 'Veículo Oficina Parceira',
      itens: [
        {
          pecaId: 'PC-NOVA',
          descricao: itemDesc || 'Kit Autopeças Orçado',
          precoOriginal: itemPreco * 1.15,
          precoOrcado: itemPreco,
          disponibilidade: 'Em Estoque'
        }
      ],
      valorTotal: itemPreco,
      status: 'PENDENTE'
    };

    if (onNovoOrcamento) onNovoOrcamento(novo);

    addToast({
      title: 'Orçamento Emitido',
      message: `Cotação enviada para ${oficina.nome} com validade de 5 dias úteis.`,
      type: 'info'
    });

    setIsModalOpen(false);
    setVeiculoRef('');
    setItemDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Orçamentos */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Orçamentos & Cotações para Oficinas Mecânicas
          </h2>
          <p className="text-xs text-slate-500">
            Controle de propostas comerciais pendentes, prazos de validade e conversão em pedidos de balcão
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Novo Orçamento</span>
        </button>
      </div>

      {/* Grid de Orçamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orcamentos.map(orc => (
          <div
            key={orc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">
                  {orc.id} • Emitido em {orc.dataCriacao}
                </span>
                <Badge
                  variant={orc.status === 'APROVADO' || orc.status === 'CONVERTIDO_VENDA' ? 'emerald' : 'amber'}
                  size="sm"
                >
                  {orc.status}
                </Badge>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {orc.oficinaParceira.nome}
              </h3>
              <span className="text-xs text-slate-500 block">
                Ref: {orc.veiculoReferencia} • Validade: {orc.validadeDias} dias
              </span>

              {/* Itens Orçados */}
              <div className="mt-3 space-y-1.5">
                {orc.itens.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-700 dark:text-slate-300 truncate">{it.descricao}</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                      R$ {it.precoOrcado.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Orçado</span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-slate-100">
                  R$ {orc.valorTotal.toFixed(2)}
                </span>
              </div>

              {orc.status === 'PENDENTE' && (
                <button
                  onClick={() => handleConverter(orc)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all shadow-xs"
                >
                  Aprovar & Converter em Venda
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Orçamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Novo Orçamento para Oficina Parceira
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSalvarNovo} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Oficina Parceira
                </label>
                <select
                  value={selectedOficinaId}
                  onChange={(e) => setSelectedOficinaId(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                >
                  {parceiros.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.categoria})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Veículo do Cliente da Oficina
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Honda Civic G10 2.0 2018"
                  value={veiculoRef}
                  onChange={(e) => setVeiculoRef(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Peça Solicitada
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pinça de Freio Diant."
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preço Especial Oficina (R$)
                  </label>
                  <input
                    type="number"
                    value={itemPreco}
                    onChange={(e) => setItemPreco(parseFloat(e.target.value) || 0)}
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
                  Emitir Orçamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
