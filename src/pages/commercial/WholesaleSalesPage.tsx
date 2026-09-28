import React, { useState } from 'react';
import { VendaAtacadoLote, Material, ParceiroComercial } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface WholesaleSalesPageProps {
  lotes: VendaAtacadoLote[];
  materiais: Material[];
  parceiros: ParceiroComercial[];
  onNovoLote?: (lote: VendaAtacadoLote) => void;
}

export const WholesaleSalesPage: React.FC<WholesaleSalesPageProps> = ({
  lotes,
  materiais,
  parceiros,
  onNovoLote
}) => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [selectedClienteId, setSelectedClienteId] = useState(parceiros[3]?.id || '');
  const [selectedMaterialId, setSelectedMaterialId] = useState(materiais[4]?.id || '');
  const [pesoKg, setPesoKg] = useState<number>(14200);

  const materialObj = materiais.find(m => m.id === selectedMaterialId) || materiais[0];
  const precoSugerido = materialObj ? materialObj.precoVendaKg : 1.65;
  const valorTotalCalculado = pesoKg * precoSugerido;

  const handleSalvarLote = (e: React.FormEvent) => {
    e.preventDefault();
    const cliente = parceiros.find(p => p.id === selectedClienteId) || parceiros[3];
    const material = materiais.find(m => m.id === selectedMaterialId) || materiais[4];

    const novoLote: VendaAtacadoLote = {
      id: `ATC-2026-0${lotes.length + 42}`,
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      cliente,
      material,
      pesoLiquidoKg: pesoKg,
      precoKg: precoSugerido,
      valorTotal: valorTotalCalculado,
      statusEntrega: 'Carregando',
      numeroMdfe: `MDF-SP-2026-00${Math.floor(400 + Math.random() * 99)}`,
      chaveNfe: `352609039218470001905500100000${Math.floor(1000 + Math.random() * 9000)}129841`
    };

    if (onNovoLote) onNovoLote(novoLote);

    addToast({
      title: 'Lote Atacado Faturado',
      message: `${(pesoKg / 1000).toFixed(2)}t de ${material.nome} faturado para ${cliente.nome}.`,
      type: 'success'
    });

    setIsModalOpen(false);
  };

  const handleImprimirMdfe = (lote: VendaAtacadoLote) => {
    addToast({
      title: 'MDF-e Transporte Rodoviário',
      message: `Manifesto Eletrônico de Cargas ${lote.numeroMdfe} emitido e transmitido à ANTT.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Atacado */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Vendas em Grande Escala (Atacado de Sucatas)
          </h2>
          <p className="text-xs text-slate-500">
            Expedição de cargas pesadas, lotes industriais para siderúrgicas e emissão de MDF-e
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Faturar Novo Lote</span>
        </button>
      </div>

      {/* Grid de Cards de Lotes Atacado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lotes.map(lote => {
          const toneladas = (lote.pesoLiquidoKg / 1000).toFixed(2);

          return (
            <div
              key={lote.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {lote.id} • {lote.dataEmissao}
                  </span>
                  <Badge 
                    variant={lote.statusEntrega === 'Entregue Siderúrgica' ? 'emerald' : 'amber'} 
                    size="sm"
                  >
                    {lote.statusEntrega}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {lote.cliente.nome}
                </h3>
                <span className="text-xs text-slate-500 block">
                  CNPJ: {lote.cliente.documento} • {lote.cliente.categoria}
                </span>

                <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Material</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {lote.material.categoria}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Carga Líquida</span>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
                      {toneladas} t
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">R$/kg</span>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
                      R$ {lote.precoKg.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Faturamento Total</span>
                  <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                    R$ {lote.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleImprimirMdfe(lote)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    MDF-e Carga
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Faturamento Lote */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Faturamento de Lote Atacado (Siderúrgica)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSalvarLote} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Siderúrgica / Cliente Industrial
                </label>
                <select
                  value={selectedClienteId}
                  onChange={(e) => setSelectedClienteId(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                >
                  {parceiros.filter(p => p.tipo !== 'FORNECEDOR').map(p => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.documento})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Material Metálico
                </label>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                >
                  {materiais.map(m => (
                    <option key={m.id} value={m.id}>{m.nome} — R$ {m.precoVendaKg.toFixed(2)}/kg</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Peso Líquido Pesado na Balança Rodoviária (kg)
                </label>
                <input
                  type="number"
                  step="50"
                  value={pesoKg}
                  onChange={(e) => setPesoKg(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Equivalente a {(pesoKg / 1000).toFixed(2)} toneladas métricas.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex justify-between items-center">
                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Total Previsto:</span>
                <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                  R$ {valorTotalCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
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
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                >
                  Emitir NF-e & MDF-e Carga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
