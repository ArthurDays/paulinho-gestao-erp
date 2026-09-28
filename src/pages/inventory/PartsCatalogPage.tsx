import React, { useState } from 'react';
import { PecaEstoque } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface PartsCatalogPageProps {
  pecas: PecaEstoque[];
  onVenderPeca?: (pecaId: string) => void;
  onAdicionarAoPdv?: (peca: PecaEstoque) => void;
}

export const PartsCatalogPage: React.FC<PartsCatalogPageProps> = ({
  pecas,
  onVenderPeca,
  onAdicionarAoPdv
}) => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');

  const pecasFiltradas = pecas.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      p.descricao.toLowerCase().includes(q) ||
      p.codigoOem.toLowerCase().includes(q) ||
      p.veiculoOrigem.toLowerCase().includes(q) ||
      p.estanteId.toLowerCase().includes(q) ||
      p.posicaoRack.toLowerCase().includes(q);

    const matchesCat = categoriaFiltro === 'TODAS' || p.categoria === categoriaFiltro;

    return matchesSearch && matchesCat;
  });

  const handleImprimirQrCode = (p: PecaEstoque) => {
    addToast({
      title: 'Etiqueta Rastreável Emitida',
      message: `Selo QR Code gerado para ${p.descricao} (${p.codigoBarrasQr}).`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar com Busca e Filtros */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Inventário de Autopeças Extraídas
          </h2>
          <p className="text-xs text-slate-500">
            Catálogo completo com rastreabilidade por QR Code, código OEM e controle de estoque mínimo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            <option value="TODAS">Todas Categorias</option>
            <option value="Freios">Freios</option>
            <option value="Mecânica">Mecânica</option>
            <option value="Suspensão">Suspensão</option>
            <option value="Elétrica">Elétrica</option>
            <option value="Motor">Motor</option>
            <option value="Rodas">Rodas</option>
          </select>

          <input
            type="text"
            placeholder="Buscar OEM, descrição, veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 w-64 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Tabela de Peças */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 uppercase font-mono">
                <th className="py-2.5">Descrição da Peça</th>
                <th className="py-2.5">Código OEM</th>
                <th className="py-2.5">Veículo Origem</th>
                <th className="py-2.5">Localização / Rack</th>
                <th className="py-2.5">Condição</th>
                <th className="py-2.5 text-right">Preço Venda</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pecasFiltradas.map(p => {
                const isDisponivel = p.status === 'Disponível';
                const isEstoqueBaixo = p.quantidadeEstoque <= p.estoqueMinimo;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {p.descricao}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {p.categoria} • ID: {p.id}
                      </span>
                    </td>

                    <td className="py-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {p.codigoOem}
                    </td>

                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {p.veiculoOrigem}
                    </td>

                    <td className="py-3 font-mono">
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{p.estanteId}</span>
                      <span className="text-slate-500 block text-[10px]">{p.posicaoRack}</span>
                    </td>

                    <td className="py-3">
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">
                        {p.condicao}
                      </span>
                    </td>

                    <td className="py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      R$ {p.precoVenda.toFixed(2)}
                    </td>

                    <td className="py-3 text-center">
                      <Badge 
                        variant={!isDisponivel ? 'slate' : isEstoqueBaixo ? 'amber' : 'emerald'} 
                        size="sm"
                      >
                        {p.status}
                      </Badge>
                    </td>

                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleImprimirQrCode(p)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Imprimir QR Code Rastreável"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" />
                          </svg>
                        </button>

                        {isDisponivel && onAdicionarAoPdv && (
                          <button
                            onClick={() => onAdicionarAoPdv(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1"
                          >
                            <span>+ PDV</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
