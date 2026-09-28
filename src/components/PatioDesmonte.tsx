import React, { useState, useEffect, useMemo } from 'react';
import { VeiculoDesmanche, PecaEstoque } from '../types/erp';
import { Badge } from './common/Badge';
import { useToast } from './common/Toast';
import { MasterDetailLayout, FilterTab, MasterDetailTab } from './layout/MasterDetailLayout';
import { ProtocoloDescontaminacao } from './ProtocoloDescontaminacao';
import { useBarcodeScanner } from './common/BarcodeListener';
import { syncQueueService } from '../services/syncQueueService';

export interface PatioDesmonteProps {
  veiculos: VeiculoDesmanche[];
  onExtrairPeca?: (peca: Partial<PecaEstoque>) => void;
  onAtualizarVeiculo?: (veiculo: VeiculoDesmanche) => void;
}

export const PatioDesmonte: React.FC<PatioDesmonteProps> = ({
  veiculos,
  onExtrairPeca,
  onAtualizarVeiculo
}) => {
  const { addToast } = useToast();
  const { registerScanHandler } = useBarcodeScanner();

  const [selectedVeiculoId, setSelectedVeiculoId] = useState<string>(veiculos[0]?.id || 'VD-001');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'Em Desmontagem' | 'Descontaminado' | 'Aguardando Desmanche' | 'Concluído'>('TODOS');

  // Form de extração de peça
  const [isModalExtracao, setIsModalExtracao] = useState(false);
  const [descricaoPeca, setDescricaoPeca] = useState('');
  const [categoriaPeca, setCategoriaPeca] = useState<'Freios' | 'Mecânica' | 'Suspensão' | 'Elétrica' | 'Motor' | 'Rodas'>('Mecânica');
  const [precoPeca, setPrecoPeca] = useState(350.0);
  const [estanteDestino, setEstanteDestino] = useState('EST-01');
  const [nivelDestino, setNivelDestino] = useState<1 | 2 | 3 | 4>(2);

  const veiculoAtual = useMemo(() => {
    return veiculos.find(v => v.id === selectedVeiculoId) || veiculos[0];
  }, [veiculos, selectedVeiculoId]);

  // Escuta contínua de código de barras para selecionar veículo por chassi ou placa
  useEffect(() => {
    const unregister = registerScanHandler((scan) => {
      const code = scan.code.trim().toUpperCase();
      const match = veiculos.find(v => 
        v.placa.toUpperCase() === code ||
        v.chassi.toUpperCase() === code ||
        code.includes(v.placa.toUpperCase())
      );

      if (match) {
        setSelectedVeiculoId(match.id);
        addToast({
          title: 'Veículo Selecionado via Barcode (0ms)',
          message: `${match.marcaModelo} (${match.placa}) inspecionado na Baia.`,
          type: 'success'
        });
        return true;
      }
      return false;
    });

    return unregister;
  }, [veiculos, registerScanHandler, addToast]);

  // Contadores para abas de filtro
  const filterTabs: FilterTab[] = useMemo(() => {
    const total = veiculos.length;
    const emDesmonte = veiculos.filter(v => v.status === 'Em Desmontagem').length;
    const descontaminados = veiculos.filter(v => v.descontaminado).length;

    return [
      { id: 'TODOS', label: 'Todos os Veículos', count: total, variant: 'slate' },
      { id: 'Em Desmontagem', label: 'Em Desmontagem', count: emDesmonte, variant: 'amber' },
      { id: 'Descontaminado', label: 'Descontaminados', count: descontaminados, variant: 'emerald' }
    ];
  }, [veiculos]);

  // Filtragem
  const veiculosFiltrados = useMemo(() => {
    return veiculos.filter(v => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        v.marcaModelo.toLowerCase().includes(q) ||
        v.placa.toLowerCase().includes(q) ||
        v.chassi.toLowerCase().includes(q) ||
        v.baia.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === 'TODOS' ||
        (statusFilter === 'Descontaminado' ? v.descontaminado : v.status === statusFilter);

      return matchSearch && matchStatus;
    });
  }, [veiculos, searchTerm, statusFilter]);

  const handleExtrairNovaPeca = () => {
    if (!descricaoPeca.trim()) {
      addToast({
        title: 'Campo Obrigatório',
        message: 'Por favor, informe a descrição da peça a ser extraída.',
        type: 'warning'
      });
      return;
    }

    const novaPeca: Partial<PecaEstoque> = {
      descricao: descricaoPeca,
      categoria: categoriaPeca,
      precoVenda: precoPeca,
      precoCusto: Math.round(precoPeca * 0.35),
      estanteId: estanteDestino,
      nivel: nivelDestino,
      posicaoRack: `N${nivelDestino}-P0${Math.floor(Math.random() * 8) + 1}`,
      veiculoOrigem: `${veiculoAtual?.marcaModelo} (${veiculoAtual?.placa})`,
      veiculoId: veiculoAtual?.id,
      codigoOem: `OEM-${Math.floor(100000 + Math.random() * 900000)}`,
      codigoBarrasQr: `PG-PC-${Math.floor(100000 + Math.random() * 900000)}`
    };

    if (onExtrairPeca) onExtrairPeca(novaPeca);

    if (veiculoAtual && onAtualizarVeiculo) {
      const atualizado: VeiculoDesmanche = {
        ...veiculoAtual,
        pecasExtraidasCount: veiculoAtual.pecasExtraidasCount + 1,
        progressoDesmontePct: Math.min(100, veiculoAtual.progressoDesmontePct + 5)
      };
      syncQueueService.executeSystemFirst({
        mutateLocal: () => onAtualizarVeiculo(atualizado),
        task: {
          type: 'VEICULO_UPDATE',
          entity: 'VEICULO',
          entityId: veiculoAtual.id,
          data: atualizado
        }
      });
    }

    addToast({
      title: 'Peça Extraída com Sucesso (0ms)',
      message: `${descricaoPeca} alocada na ${estanteDestino} Nível ${nivelDestino}.`,
      type: 'success'
    });

    setIsModalExtracao(false);
    setDescricaoPeca('');
  };

  // Sub-abas do Master-Detail
  const detailTabs: MasterDetailTab[] = [
    {
      id: 'tab-overview',
      label: '1. Ficha Geral & Baia',
      badge: veiculoAtual?.baia,
      content: veiculoAtual && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Placa Mercosul</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                {veiculoAtual.placa}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Ano / Modelo</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {veiculoAtual.anoFabricacao}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Peças Extraídas</span>
              <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {veiculoAtual.pecasExtraidasCount} un
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Sucata Ferrosa</span>
              <span className="text-sm font-bold font-mono text-sky-600 dark:text-sky-400">
                {veiculoAtual.sucataMetalicaKg} kg
              </span>
            </div>
          </div>

          {/* Card do Chassi com Bipe */}
          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-900 text-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Número do Chassi / VIN</span>
              <Badge variant="blue" size="sm">DETRAN SP</Badge>
            </div>
            <div className="text-base font-mono font-bold text-sky-400 tracking-wider">
              {veiculoAtual.chassi}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Certidão de Baixa Permanente: <span className="text-emerald-400 font-mono font-semibold">{veiculoAtual.certidaoBaixaDetran}</span>
            </p>
          </div>

          {/* Barra de Progresso Linear Detalhada */}
          <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Etapa de Desmontagem</span>
              <span className="font-mono font-bold text-orange-600">{veiculoAtual.progressoDesmontePct}% concluído</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${veiculoAtual.progressoDesmontePct}%` }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tab-decontam',
      label: '2. Descontaminação (Lei 12.977)',
      badge: veiculoAtual?.descontaminado ? 'Concluído' : 'Pendente',
      content: veiculoAtual && onAtualizarVeiculo && (
        <ProtocoloDescontaminacao
          veiculo={veiculoAtual}
          onUpdateVeiculo={onAtualizarVeiculo}
        />
      )
    }
  ];

  return (
    <>
      <MasterDetailLayout
        title="Linha de Desmontagem & Pátio CDV"
        subtitle="Gerenciamento logístico Master-Detail com barras de progresso lineares e protocolo Lei 12.977/2014"
        searchPlaceholder="Bipar ou buscar por modelo, placa, chassi ou baia..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterTabs={filterTabs}
        activeFilterId={statusFilter}
        onFilterChange={(id) => setStatusFilter(id as any)}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalExtracao(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-500 active:scale-95 transition-all shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>+ Extrair Autopeça</span>
            </button>
          </div>
        }
        masterList={
          veiculosFiltrados.length > 0 ? (
            veiculosFiltrados.map((veiculo) => {
              const isSelected = veiculo.id === selectedVeiculoId;
              const isDescontaminado = veiculo.descontaminado;

              return (
                <div
                  key={veiculo.id}
                  onClick={() => setSelectedVeiculoId(veiculo.id)}
                  className={`
                    p-3.5 rounded-xl border transition-all cursor-pointer group select-none
                    ${isSelected
                      ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-500/80 shadow-xs ring-1 ring-orange-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Ícone de Veículo */}
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                          {veiculo.placa} • {veiculo.baia}
                        </span>
                        <Badge variant={isDescontaminado ? 'emerald' : 'amber'} dot size="sm">
                          {veiculo.status}
                        </Badge>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {veiculo.marcaModelo} ({veiculo.anoFabricacao})
                      </h4>

                      {/* Barra de Progresso Linear */}
                      <div className="mt-2.5">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-mono">
                          <span>Desmontagem</span>
                          <span className="font-bold text-orange-600">{veiculo.progressoDesmontePct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full transition-all duration-300"
                            style={{ width: `${veiculo.progressoDesmontePct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-400">
                        <span>VIN: {veiculo.chassi.slice(0, 8)}...</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{veiculo.pecasExtraidasCount} peças</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
              Nenhum veículo encontrado para os filtros atuais.
            </div>
          )
        }
        hasSelection={!!veiculoAtual}
        selectedItemTitle={veiculoAtual ? `${veiculoAtual.marcaModelo} (${veiculoAtual.placa})` : undefined}
        detailTabs={detailTabs}
      />

      {/* Modal de Extração de Peça */}
      {isModalExtracao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Extrair Nova Peça para Estoque Vertical
            </h3>
            <p className="text-xs text-slate-500">
              Veículo Doador: <strong className="text-slate-800 dark:text-slate-200">{veiculoAtual?.marcaModelo} ({veiculoAtual?.placa})</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Descrição da Peça</label>
                <input
                  type="text"
                  value={descricaoPeca}
                  onChange={(e) => setDescricaoPeca(e.target.value)}
                  placeholder="Ex: Alternador Bosch 140A"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Categoria</label>
                  <select
                    value={categoriaPeca}
                    onChange={(e) => setCategoriaPeca(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="Mecânica">Mecânica</option>
                    <option value="Freios">Freios</option>
                    <option value="Suspensão">Suspensão</option>
                    <option value="Elétrica">Elétrica</option>
                    <option value="Motor">Motor</option>
                    <option value="Rodas">Rodas</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Preço Sugerido (R$)</label>
                  <input
                    type="number"
                    value={precoPeca}
                    onChange={(e) => setPrecoPeca(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Estante Destino</label>
                  <select
                    value={estanteDestino}
                    onChange={(e) => setEstanteDestino(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                  >
                    {['EST-01', 'EST-02', 'EST-03', 'EST-04', 'EST-05', 'EST-06', 'EST-07', 'EST-08'].map(id => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nível Vertical</label>
                  <select
                    value={nivelDestino}
                    onChange={(e) => setNivelDestino(parseInt(e.target.value) as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                  >
                    <option value={1}>N1 (Solo Pesado)</option>
                    <option value={2}>N2 (Intermediário)</option>
                    <option value={3}>N3 (Médio)</option>
                    <option value={4}>N4 (Leve)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsModalExtracao(false)}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleExtrairNovaPeca}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-orange-600 text-white hover:bg-orange-500"
              >
                Salvar & Gerar QR Code (0ms)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatioDesmonte;
