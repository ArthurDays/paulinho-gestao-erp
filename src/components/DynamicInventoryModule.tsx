import React, { useState, useMemo } from 'react';
import { PecaEstoque, VeiculoDesmanche } from '../types/erp';

interface DynamicInventoryModuleProps {
  pecas: PecaEstoque[];
  veiculos: VeiculoDesmanche[];
  onVenderPeca?: (pecaId: string) => void;
  onEditarPeca?: (peca: PecaEstoque) => void;
  filtroZona?: 'BALCAO' | 'PRATELEIRAS' | 'PATIO' | null;
}

export const DynamicInventoryModule: React.FC<DynamicInventoryModuleProps> = ({
  pecas,
  veiculos,
  onVenderPeca,
  onEditarPeca,
  filtroZona = null
}) => {
  // Aba ativa: Peças vs Veículos
  const [activeTab, setActiveTab] = useState<'PECAS' | 'VEICULOS'>(
    filtroZona === 'PATIO' ? 'VEICULOS' : 'PECAS'
  );

  // Estados de Filtro de Peças
  const [buscaPeca, setBuscaPeca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstante, setFiltroEstante] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroEstoqueCritico, setFiltroEstoqueCritico] = useState(false);

  // Ordenação e Paginação de Peças
  const [ordemCampo, setOrdemCampo] = useState<keyof PecaEstoque>('descricao');
  const [ordemAsc, setOrdemAsc] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(8);

  // Modal de Edição de Peça
  const [pecaEmEdicao, setPecaEmEdicao] = useState<PecaEstoque | null>(null);

  // Filtragem e Ordenação de Peças
  const pecasProcessadas = useMemo(() => {
    let result = pecas.filter(p => {
      const q = buscaPeca.toLowerCase().trim();
      const matchQ =
        !q ||
        p.descricao.toLowerCase().includes(q) ||
        p.codigoOem.toLowerCase().includes(q) ||
        p.veiculoOrigem.toLowerCase().includes(q) ||
        p.estanteId.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);

      const matchCat = !filtroCategoria || p.categoria === filtroCategoria;
      const matchEst = !filtroEstante || p.estanteId === filtroEstante;
      const matchStat = !filtroStatus || p.status === filtroStatus;
      const matchCritico = !filtroEstoqueCritico || (p.quantidadeEstoque <= (p.estoqueMinimo || 1));

      return matchQ && matchCat && matchEst && matchStat && matchCritico;
    });

    result.sort((a, b) => {
      const valA = a[ordemCampo];
      const valB = b[ordemCampo];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return ordemAsc ? valA - valB : valB - valA;
      }
      return ordemAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return result;
  }, [pecas, buscaPeca, filtroCategoria, filtroEstante, filtroStatus, filtroEstoqueCritico, ordemCampo, ordemAsc]);

  // Paginação
  const totalPaginas = Math.ceil(pecasProcessadas.length / itensPorPagina) || 1;
  const pecasPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return pecasProcessadas.slice(inicio, inicio + itensPorPagina);
  }, [pecasProcessadas, paginaAtual, itensPorPagina]);

  const alternarOrdem = (campo: keyof PecaEstoque) => {
    if (ordemCampo === campo) {
      setOrdemAsc(!ordemAsc);
    } else {
      setOrdemCampo(campo);
      setOrdemAsc(true);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Header com Abas Segmentadas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              ERP Inventário Unificado
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Sincronizado c/ Banco Local</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📊</span>
            <span>Tabelas Dinâmicas de Estoque & Pátio</span>
          </h2>
        </div>

        {/* Chaveador de Abas */}
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('PECAS')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 ${
              activeTab === 'PECAS'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>📦</span>
            <span>Autopeças ({pecas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('VEICULOS')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 ${
              activeTab === 'VEICULOS'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🚗</span>
            <span>Veículos CDV ({veiculos.length})</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ABA 1: TABELA DINÂMICA DE AUTOPEÇAS                                  */}
      {/* ==================================================================== */}
      {activeTab === 'PECAS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          
          {/* Barra de Filtros e Controles Avançados */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px] flex-1">
                <input
                  type="text"
                  placeholder="Buscar por descrição, OEM, estante, veículo..."
                  value={buscaPeca}
                  onChange={(e) => { setBuscaPeca(e.target.value); setPaginaAtual(1); }}
                  className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
              </div>

              <select
                value={filtroCategoria}
                onChange={(e) => { setFiltroCategoria(e.target.value); setPaginaAtual(1); }}
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

              <select
                value={filtroEstante}
                onChange={(e) => { setFiltroEstante(e.target.value); setPaginaAtual(1); }}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              >
                <option value="">Todas Estantes (EST-01..08)</option>
                <option value="EST-01">EST-01 (Freios)</option>
                <option value="EST-02">EST-02 (Suspensão)</option>
                <option value="EST-03">EST-03 (Motor)</option>
                <option value="EST-04">EST-04 (Kraft)</option>
                <option value="EST-05">EST-05 (Rodas/Bins)</option>
                <option value="EST-06">EST-06 (Bins Médios)</option>
                <option value="EST-07">EST-07 (Alternadores)</option>
                <option value="EST-08">EST-08 (Chicotes)</option>
              </select>

              <button
                onClick={() => setFiltroEstoqueCritico(!filtroEstoqueCritico)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition ${
                  filtroEstoqueCritico
                    ? 'bg-red-500 text-white border-red-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                ⚠️ Somente Estoque Crítico
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 self-end">
              <span>Exibir:</span>
              <select
                value={itensPorPagina}
                onChange={(e) => { setItensPorPagina(parseInt(e.target.value)); setPaginaAtual(1); }}
                className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value={5}>5 por pág.</option>
                <option value={8}>8 por pág.</option>
                <option value={15}>15 por pág.</option>
              </select>
            </div>
          </div>

          {/* Tabela de Peças */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold select-none">
                  <th onClick={() => alternarOrdem('id')} className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                    Código {ordemCampo === 'id' && (ordemAsc ? '▲' : '▼')}
                  </th>
                  <th onClick={() => alternarOrdem('descricao')} className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                    Descrição & OEM {ordemCampo === 'descricao' && (ordemAsc ? '▲' : '▼')}
                  </th>
                  <th onClick={() => alternarOrdem('categoria')} className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                    Categoria {ordemCampo === 'categoria' && (ordemAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-2.5 px-3">Localização (Rack)</th>
                  <th onClick={() => alternarOrdem('quantidadeEstoque')} className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                    Estoque {ordemCampo === 'quantidadeEstoque' && (ordemAsc ? '▲' : '▼')}
                  </th>
                  <th onClick={() => alternarOrdem('precoCusto')} className="py-2.5 px-3 font-mono cursor-pointer hover:text-slate-900 dark:hover:text-white">
                    Custo {ordemCampo === 'precoCusto' && (ordemAsc ? '▲' : '▼')}
                  </th>
                  <th onClick={() => alternarOrdem('precoVenda')} className="py-2.5 px-3 font-mono cursor-pointer hover:text-slate-900 dark:hover:text-white">
                    Venda {ordemCampo === 'precoVenda' && (ordemAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-2.5 px-3 text-center">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pecasPaginadas.length > 0 ? (
                  pecasPaginadas.map((p) => {
                    const isCritico = p.quantidadeEstoque <= (p.estoqueMinimo || 1);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{p.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{p.descricao}</div>
                          <div className="text-[10px] text-slate-400 font-mono">OEM: {p.codigoOem} • {p.veiculoOrigem}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {p.categoria}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-extrabold text-xs text-orange-500">
                            {p.estanteId} / N{p.nivel} ({p.posicaoRack})
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                            isCritico
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {p.quantidadeEstoque || 1} un {isCritico && '(Crítico)'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">
                          R$ {(p.precoCusto || p.precoVenda * 0.4).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                          R$ {p.precoVenda.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setPecaEmEdicao(p)}
                              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-md"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => onVenderPeca && onVenderPeca(p.id)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-md shadow-sm"
                            >
                              Vender
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Nenhuma autopeça encontrada com os critérios informados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-500">
            <span>
              Mostrando {Math.min(pecasProcessadas.length, (paginaAtual - 1) * itensPorPagina + 1)} a {Math.min(pecasProcessadas.length, paginaAtual * itensPorPagina)} de {pecasProcessadas.length} peças
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={paginaAtual <= 1}
                onClick={() => setPaginaAtual(prev => prev - 1)}
                className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="font-mono font-bold text-slate-900 dark:text-white px-2">
                {paginaAtual} / {totalPaginas}
              </span>
              <button
                disabled={paginaAtual >= totalPaginas}
                onClick={() => setPaginaAtual(prev => prev + 1)}
                className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ABA 2: TABELA DINÂMICA DE VEÍCULOS NO PÁTIO (CDV)                    */}
      {/* ==================================================================== */}
      {activeTab === 'VEICULOS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Controle de Veículos & Carcaças no Pátio (CDV)
              </h3>
              <span className="text-xs text-slate-500">Rastreabilidade integral conforme a Lei Federal 12.977/2014.</span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600">
              {veiculos.length} veículos registrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Placa / Chassi</th>
                  <th className="py-2.5 px-3">Veículo / Marca / Ano</th>
                  <th className="py-2.5 px-3">Certidão Baixa DETRAN</th>
                  <th className="py-2.5 px-3">Baia / Elevador</th>
                  <th className="py-2.5 px-3">Status Desmanche</th>
                  <th className="py-2.5 px-3">Descontaminação</th>
                  <th className="py-2.5 px-3 font-mono">Peças Extraídas</th>
                  <th className="py-2.5 px-3 font-mono">Sucata (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {veiculos.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{v.placa}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.chassi}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {v.marcaModelo} ({v.ano})
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {v.certidaoBaixaDetran}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-orange-600">{v.baiaNome}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{v.progressoPct}%</span>
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${v.progressoPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        v.descontaminado
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {v.descontaminado ? '✓ Drenado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{v.pecasGeradasQtd} un</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{v.sucataGeradaKg} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO RÁPIDA DE PEÇA */}
      {pecaEmEdicao && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Editar Autopeça ({pecaEmEdicao.id})
              </h3>
              <button
                onClick={() => setPecaEmEdicao(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Descrição:</label>
                <input
                  type="text"
                  value={pecaEmEdicao.descricao}
                  onChange={(e) => setPecaEmEdicao({ ...pecaEmEdicao, descricao: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Estante:</label>
                  <select
                    value={pecaEmEdicao.estanteId}
                    onChange={(e) => setPecaEmEdicao({ ...pecaEmEdicao, estanteId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    <option value="EST-01">EST-01</option>
                    <option value="EST-02">EST-02</option>
                    <option value="EST-03">EST-03</option>
                    <option value="EST-04">EST-04</option>
                    <option value="EST-07">EST-07</option>
                    <option value="EST-08">EST-08</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Preço Venda (R$):</label>
                  <input
                    type="number"
                    value={pecaEmEdicao.precoVenda}
                    onChange={(e) => setPecaEmEdicao({ ...pecaEmEdicao, precoVenda: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (onEditarPeca) onEditarPeca(pecaEmEdicao);
                setPecaEmEdicao(null);
                alert('Autopeça atualizada com sucesso!');
              }}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow mt-2"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
