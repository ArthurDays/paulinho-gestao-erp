import React, { useState, useMemo } from 'react';
import { Estante, PecaEstoque, AlaEstante } from '../types/erp';

interface PrateleirasEstoqueModuleProps {
  estantes: Estante[];
  pecas: PecaEstoque[];
  onVenderPeca?: (pecaId: string) => void;
  filtroEstanteInicial?: string | null;
}

export const PrateleirasEstoqueModule: React.FC<PrateleirasEstoqueModuleProps> = ({
  estantes,
  pecas,
  onVenderPeca,
  filtroEstanteInicial = null
}) => {
  const [activeAla, setActiveAla] = useState<'TODAS' | AlaEstante>('TODAS');
  const [selectedEstanteId, setSelectedEstanteId] = useState<string | null>(filtroEstanteInicial);
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');

  // Estantes filtradas por Ala
  const estantesFiltradas = useMemo(() => {
    return estantes.filter(e => {
      if (activeAla === 'TODAS') return true;
      return e.ala === activeAla;
    });
  }, [estantes, activeAla]);

  // Peças filtradas pela busca
  const pecasFiltradas = useMemo(() => {
    const q = termoBusca.toLowerCase().trim();
    return pecas.filter(p => {
      const matchQuery =
        !q ||
        p.descricao.toLowerCase().includes(q) ||
        p.codigoOem.toLowerCase().includes(q) ||
        p.veiculoOrigem.toLowerCase().includes(q) ||
        p.estanteId.toLowerCase().includes(q) ||
        p.posicaoRack.toLowerCase().includes(q);

      const matchCat = !filtroCategoria || p.categoria === filtroCategoria;
      const matchEstante = !selectedEstanteId || p.estanteId === selectedEstanteId;

      return matchQuery && matchCat && matchEstante;
    });
  }, [pecas, termoBusca, filtroCategoria, selectedEstanteId]);

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Header com Busca e Filtros */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Armazém Verticalizado
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Rastreabilidade por QR Code</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📦</span>
            <span>Prateleiras, Estantes & Catálogo de Autopeças</span>
          </h2>
        </div>

        {/* Inputs de Filtro Rápido */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <input
              type="text"
              placeholder="Buscar autopeça, OEM, modelo..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
          </div>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">Todas Categorias</option>
            <option value="Freios">Freios</option>
            <option value="Mecânica">Mecânica</option>
            <option value="Suspensão">Suspensão</option>
            <option value="Elétrica">Elétrica</option>
            <option value="Motor">Motor</option>
            <option value="Rodas">Rodas</option>
          </select>
        </div>
      </div>

      {/* Segmented Control de Ala (Esquerda / Direita / Todas) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setActiveAla('TODAS'); setSelectedEstanteId(null); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeAla === 'TODAS'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todas as 8 Estantes
          </button>
          <button
            onClick={() => { setActiveAla('Esquerda'); setSelectedEstanteId(null); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeAla === 'Esquerda'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ala Esquerda (EST-01 a EST-04)
          </button>
          <button
            onClick={() => { setActiveAla('Direita'); setSelectedEstanteId(null); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeAla === 'Direita'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ala Direita (EST-05 a EST-08)
          </button>
        </div>

        {selectedEstanteId && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Filtro ativo por Estante:</span>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-orange-600 rounded-md">
              {selectedEstanteId}
            </span>
            <button
              onClick={() => setSelectedEstanteId(null)}
              className="text-xs text-red-500 hover:text-red-700 font-bold ml-1"
            >
              ✕ Limpar
            </button>
          </div>
        )}
      </div>

      {/* GRID RESPONSIVO DE ESTANTES (1 col mobile, 2 tablet, 4 desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {estantesFiltradas.map((est) => {
          const pct = Math.min(100, Math.round((est.ocupacaoItens / est.capacidadeMaxItens) * 100));
          const isSelected = selectedEstanteId === est.id;

          let progressGradient = 'from-emerald-500 to-emerald-600';
          let textColor = 'text-emerald-600 dark:text-emerald-400';
          if (pct >= 90) {
            progressGradient = 'from-orange-500 to-red-600';
            textColor = 'text-orange-600 dark:text-orange-400';
          } else if (pct >= 75) {
            progressGradient = 'from-amber-500 to-amber-600';
            textColor = 'text-amber-600 dark:text-amber-400';
          }

          // Quantidade de peças na estante
          const totalPecasEstante = pecas.filter(p => p.estanteId === est.id).length;

          return (
            <div
              key={est.id}
              onClick={() => setSelectedEstanteId(isSelected ? null : est.id)}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-lg'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex flex-col gap-2">
                {/* Cabeçalho do Card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs px-2 py-0.5 bg-slate-900 text-white rounded-md">
                      {est.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      est.ala === 'Esquerda'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      Ala {est.ala}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">Pos. #{est.posicaoCorredor}</span>
                </div>

                {/* Título da Estante */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                  {est.titulo}
                </h3>
              </div>

              {/* Barra de Progresso de Lotação */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 text-[11px]">Ocupação</span>
                  <span className={`font-mono font-bold ${textColor}`}>
                    {est.ocupacaoItens}/{est.capacidadeMaxItens} un ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${progressGradient} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Matriz dos 4 Níveis Físicos */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-400">N4:</span> Caixas Kraft
                  </span>
                  <span className="font-mono font-bold">Topo</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="font-mono font-bold text-sky-500">N3:</span> Mecânica
                  </span>
                  <span className="font-mono font-bold">Médio</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="font-mono font-bold text-orange-500">N2:</span> Pesados
                  </span>
                  <span className="font-mono font-bold">Interm.</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="font-mono font-bold text-emerald-500">N1:</span> Bins & Paletes
                  </span>
                  <span className="font-mono font-bold">Base</span>
                </div>
              </div>

              {/* Botão de Filtragem de Peças */}
              <button
                className={`w-full py-1.5 px-3 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🔍</span>
                <span>{isSelected ? 'Filtro Ativo (Clique p/ Tirar)' : `Ver ${totalPecasEstante} Peças`}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* TABELA DO CATÁLOGO DE AUTOPEÇAS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Catálogo de Autopeças Usadas ({pecasFiltradas.length} encontradas)
              </h3>
              <span className="text-xs text-slate-500">Localização física imediata no rack e venda de balcão.</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Código</th>
                <th className="py-2.5 px-3">Descrição da Peça</th>
                <th className="py-2.5 px-3">Categoria</th>
                <th className="py-2.5 px-3">Veículo Origem</th>
                <th className="py-2.5 px-3">Localização (Rack)</th>
                <th className="py-2.5 px-3">Condição</th>
                <th className="py-2.5 px-3 font-mono">Preço Venda</th>
                <th className="py-2.5 px-3 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pecasFiltradas.length > 0 ? (
                pecasFiltradas.map((p) => {
                  const isDisponivel = p.status === 'Disponível';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{p.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{p.descricao}</div>
                        <div className="text-[10px] text-slate-400 font-mono">OEM: {p.codigoOem}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {p.categoria}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-medium">{p.veiculoOrigem}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-extrabold text-xs text-orange-500">
                          {p.estanteId} / {p.posicaoRack}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          p.condicao.includes('A')
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {p.condicao}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                        R$ {p.precoVenda.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isDisponivel ? (
                          <button
                            onClick={() => onVenderPeca && onVenderPeca(p.id)}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm transition"
                          >
                            Vender
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Vendido</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Nenhuma autopeça encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
