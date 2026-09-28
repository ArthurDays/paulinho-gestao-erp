import React, { useState } from 'react';
import { Estante, PecaEstoque } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface ShelvesWarehousePageProps {
  estantes: Estante[];
  pecas: PecaEstoque[];
}

export const ShelvesWarehousePage: React.FC<ShelvesWarehousePageProps> = ({
  estantes,
  pecas
}) => {
  const { addToast } = useToast();
  const [selectedEstanteId, setSelectedEstanteId] = useState<string | null>('EST-01');
  const [activeAla, setActiveAla] = useState<'TODAS' | 'Esquerda' | 'Direita'>('TODAS');

  const selectedEstante = estantes.find(e => e.id === selectedEstanteId) || estantes[0];
  const pecasDaEstante = pecas.filter(p => p.estanteId === selectedEstante?.id);

  const estantesFiltradas = estantes.filter(e => {
    if (activeAla === 'TODAS') return true;
    return e.ala === activeAla;
  });

  const getOccupancyColor = (pct: number) => {
    if (pct >= 85) return 'bg-rose-500';
    if (pct >= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar com Filtro de Alas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Armazém Verticalizado (EST-01 a EST-08)
          </h2>
          <p className="text-xs text-slate-500">
            Estrutura porta-paletes e prateleiras modulares divididas em 4 níveis verticais (N1 a N4)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveAla('TODAS')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeAla === 'TODAS'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Todas (8 Estantes)
            </button>
            <button
              onClick={() => setActiveAla('Esquerda')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeAla === 'Esquerda'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Ala Esquerda (EST 01..04)
            </button>
            <button
              onClick={() => setActiveAla('Direita')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeAla === 'Direita'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Ala Direita (EST 05..08)
            </button>
          </div>

          <Badge variant="emerald" dot size="sm">Capacidade Total: 340 posições</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Grid de Estantes (8 cols) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {estantesFiltradas.map(e => {
              const isSelected = e.id === selectedEstanteId;
              const pct = Math.round((e.ocupacaoItens / e.capacidadeMaxItens) * 100);

              return (
                <div
                  key={e.id}
                  onClick={() => setSelectedEstanteId(e.id)}
                  className={`bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 ring-1 ring-emerald-500/20 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                      {e.id}
                    </span>
                    <Badge variant={pct >= 85 ? 'rose' : pct >= 60 ? 'amber' : 'emerald'} size="sm">
                      {pct}%
                    </Badge>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1 mb-1">
                    {e.titulo}
                  </h3>

                  <div className="text-[10px] text-slate-400 font-mono mb-3">
                    Ala {e.ala} • Pos #{e.posicaoCorredor}
                  </div>

                  {/* Barra de Ocupação */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${getOccupancyColor(pct)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{e.ocupacaoItens} itens</span>
                    <span>Max {e.capacidadeMaxItens}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalhes da Estante Selecionada (Níveis N1 a N4 e Peças) (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {selectedEstante.id}: {selectedEstante.titulo}
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Ala {selectedEstante.ala} • Corredor #{selectedEstante.posicaoCorredor}
              </span>
            </div>
            <Badge variant="blue" size="sm">Níveis N1..N4</Badge>
          </div>

          {/* Visualizador Esquemático dos 4 Níveis Verticais */}
          <div className="space-y-2">
            {[
              { cod: 'N4', nome: 'Nível 4 (Topo)', desc: 'Peças Leves / Chicotes / Caixas Kraft', cor: 'border-purple-300 dark:border-purple-800' },
              { cod: 'N3', nome: 'Nível 3 (Médio Superior)', desc: 'Amortecedores / Bombas / Peças Médias', cor: 'border-sky-300 dark:border-sky-800' },
              { cod: 'N2', nome: 'Nível 2 (Médio Inferior)', desc: 'Pinças / Discos / Alternadores', cor: 'border-emerald-300 dark:border-emerald-800' },
              { cod: 'N1', nome: 'Nível 1 (Piso / Chão)', desc: 'Rodas / Motores / Chaparia Pesada', cor: 'border-slate-300 dark:border-slate-700' }
            ].map(niv => (
              <div 
                key={niv.cod}
                className={`p-2.5 rounded-lg border bg-slate-50/60 dark:bg-slate-800/40 ${niv.cor} flex items-center justify-between`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                    [{niv.cod}] {niv.nome}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {niv.desc}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                  {pecasDaEstante.filter(p => p.posicaoRack.startsWith(niv.cod)).length} peças
                </span>
              </div>
            ))}
          </div>

          {/* Lista de Peças Endereçadas */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">
              Autopeças Armazenadas ({pecasDaEstante.length})
            </h4>

            {pecasDaEstante.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-mono">
                Nenhuma peça cadastrada nesta estante no momento.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {pecasDaEstante.map(p => (
                  <div 
                    key={p.id}
                    className="p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-800 dark:text-slate-200 truncate">{p.descricao}</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        R$ {p.precoVenda.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Posição: {p.posicaoRack}</span>
                      <span>OEM: {p.codigoOem}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
