import React, { useState } from 'react';
import { VeiculoDesmanche, PecaEstoque } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import { syncQueueService } from '../../services/syncQueueService';

interface DismantleLinePageProps {
  veiculos: VeiculoDesmanche[];
  onExtrairPeca?: (peca: Partial<PecaEstoque>) => void;
  onAtualizarVeiculo?: (veiculo: VeiculoDesmanche) => void;
}

export const DismantleLinePage: React.FC<DismantleLinePageProps> = ({
  veiculos,
  onExtrairPeca,
  onAtualizarVeiculo
}) => {
  const { addToast } = useToast();
  const [selectedVeiculoId, setSelectedVeiculoId] = useState<string>(veiculos[0]?.id || 'VD-001');

  // Modal de Extração de Peça
  const [isModalExtracao, setIsModalExtracao] = useState<boolean>(false);
  const [descricaoPeca, setDescricaoPeca] = useState<string>('');
  const [categoriaPeca, setCategoriaPeca] = useState<'Freios' | 'Mecânica' | 'Suspensão' | 'Elétrica' | 'Motor' | 'Rodas'>('Mecânica');
  const [precoPeca, setPrecoPeca] = useState<number>(350.0);
  const [estanteDestino, setEstanteDestino] = useState<string>('EST-01');
  const [nivelDestino, setNivelDestino] = useState<1 | 2 | 3 | 4>(2);

  const veiculoAtual = veiculos.find(v => v.id === selectedVeiculoId) || veiculos[0];

  // Handler para checklist de descontaminação
  const handleToggleDecontamItem = (campo: string) => {
    if (!veiculoAtual) return;
    
    const novosFluidos = { ...veiculoAtual.fluidosDrenados };
    if (campo === 'bateriaChumboRemovida') {
      novosFluidos.bateriaChumboRemovida = !novosFluidos.bateriaChumboRemovida;
    } else if (campo === 'gasRefrigeranteRecolhido') {
      novosFluidos.gasRefrigeranteRecolhido = !novosFluidos.gasRefrigeranteRecolhido;
    }

    const atualizado: VeiculoDesmanche = {
      ...veiculoAtual,
      fluidosDrenados: novosFluidos
    };

    if (onAtualizarVeiculo) onAtualizarVeiculo(atualizado);

    addToast({
      title: 'Protocolo Lei 12.977',
      message: `Item de descontaminação ambiental atualizado para ${veiculoAtual.placa}.`,
      type: 'info'
    });
  };

  // Handler de extração de peça
  const handleSalvarPeca = () => {
    if (!descricaoPeca.trim()) {
      addToast({
        title: 'Campo Obrigatório',
        message: 'Preencha a descrição da peça extraída.',
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
      veiculoOrigem: `${veiculoAtual.marcaModelo} (${veiculoAtual.placa})`,
      veiculoId: veiculoAtual.id,
      condicao: 'Grau A - Excelente',
      codigoOem: `OEM-${Math.floor(100000 + Math.random() * 900000)}`,
      codigoBarrasQr: `QR-${Math.floor(1000 + Math.random() * 9000)}`,
      posicaoRack: `N${nivelDestino}-P0${Math.floor(1 + Math.random() * 8)}`,
      quantidadeEstoque: 1,
      estoqueMinimo: 1,
      status: 'Disponível',
      dataEntrada: new Date().toISOString().split('T')[0]
    };

    syncQueueService.executeSystemFirst({
      mutateLocal: () => {
        if (onExtrairPeca) onExtrairPeca(novaPeca);
      },
      task: {
        type: 'INVENTORY_ADD',
        entity: 'PECA',
        entityId: novaPeca.codigoOem || `OEM-${Date.now()}`,
        data: novaPeca
      }
    });

    addToast({
      title: 'Peça Extraída com Sucesso (0ms)',
      message: `"${descricaoPeca}" etiquetada em ${estanteDestino}-N${nivelDestino}. Espelho Google Sheets enfileirado.`,
      type: 'success'
    });

    setDescricaoPeca('');
    setIsModalExtracao(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Operacional */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Linha de Desmontagem & Baias CDV
            </h2>
            <p className="text-xs text-slate-500">
              Descontaminação ambiental obrigatória (Lei 12.977/2014) e triagem de autopeças
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" dot size="sm">2 Baias Ativas</Badge>
          <Badge variant="slate" size="sm">Pátio Cimentado c/ Caixa Separadora SAO</Badge>
        </div>
      </div>

      {/* Grid: Seletor de Baias + Detalhes do Veículo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Lista de Baias / Veículos (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Baias de Desmonte em Operação
          </h3>

          {veiculos.map(v => {
            const isSelected = v.id === selectedVeiculoId;

            return (
              <div
                key={v.id}
                onClick={() => setSelectedVeiculoId(v.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-orange-500 shadow-sm ring-1 ring-orange-500/20'
                    : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400">
                    {v.baiaNome}
                  </span>
                  <Badge variant={v.descontaminado ? 'emerald' : 'amber'} size="sm">
                    {v.status}
                  </Badge>
                </div>

                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {v.marcaModelo}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                  <span>Placa: {v.placa}</span>
                  <span>Ano: {v.ano}</span>
                </div>

                {/* Barra de Progresso */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>Progresso do Desmonte</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{v.progressoPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-orange-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${v.progressoPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coluna Direita: Protocolo de Descontaminação e Extração (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Card: Protocolo Ambiental */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Protocolo Obrigatório de Descontaminação
                </h3>
                <span className="text-[11px] text-slate-500">
                  Veículo: {veiculoAtual.marcaModelo} ({veiculoAtual.placa}) • Chassi: {veiculoAtual.chassi}
                </span>
              </div>
              <Badge variant="emerald" size="sm">Lei 12.977 / CONAMA 362</Badge>
            </div>

            {/* Grid de Fluidos Drenados */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Óleo Motor</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                  {veiculoAtual.fluidosDrenados.oleoMotorLitros} L
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1">✓ Drenado</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Óleo Câmbio</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                  {veiculoAtual.fluidosDrenados.oleoCambioLitros} L
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1">✓ Drenado</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Arrefecimento</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                  {veiculoAtual.fluidosDrenados.fluidoArrefecimentoLitros} L
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1">✓ Drenado</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Fluido Freio</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                  {veiculoAtual.fluidosDrenados.fluidoFreioLitros} L
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1">✓ Drenado</span>
              </div>
            </div>

            {/* Checkboxes de Resíduos Especiais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label 
                onClick={() => handleToggleDecontamItem('bateriaChumboRemovida')}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <input
                  type="checkbox"
                  checked={veiculoAtual.fluidosDrenados.bateriaChumboRemovida}
                  readOnly
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Bateria Chumbo-Ácido Isolada
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Armazenada em palete estanque c/ bacia
                  </div>
                </div>
              </label>

              <label 
                onClick={() => handleToggleDecontamItem('gasRefrigeranteRecolhido')}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <input
                  type="checkbox"
                  checked={veiculoAtual.fluidosDrenados.gasRefrigeranteRecolhido}
                  readOnly
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Gás Refrigerante R134a Recolhido
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Cilindro recolhedor homologado IBAMA
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Card: Extração e Triagem de Peças */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Rendimento de Autopeças Extraídas
                </h3>
                <span className="text-xs text-slate-500">
                  {veiculoAtual.pecasGeradasQtd} peças cadastradas • {veiculoAtual.sucataGeradaKg} kg sucata de carcaça
                </span>
              </div>

              <button
                onClick={() => setIsModalExtracao(true)}
                className="px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Extrair Nova Peça</span>
              </button>
            </div>

            {/* Modal de Cadastro de Extração */}
            {isModalExtracao && (
              <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-950/60 bg-orange-50/40 dark:bg-orange-950/20 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-900 dark:text-orange-200 font-mono">
                    Registrar Autopeça Extraída da Baia
                  </span>
                  <button
                    onClick={() => setIsModalExtracao(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Descrição da Peça
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Alternador Bosch 140A"
                      value={descricaoPeca}
                      onChange={(e) => setDescricaoPeca(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Categoria
                    </label>
                    <select
                      value={categoriaPeca}
                      onChange={(e) => setCategoriaPeca(e.target.value as any)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
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
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Preço Venda Sugerido (R$)
                    </label>
                    <input
                      type="number"
                      value={precoPeca}
                      onChange={(e) => setPrecoPeca(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Estante
                      </label>
                      <select
                        value={estanteDestino}
                        onChange={(e) => setEstanteDestino(e.target.value)}
                        className="w-full text-xs font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                      >
                        {['EST-01', 'EST-02', 'EST-03', 'EST-04', 'EST-05', 'EST-06', 'EST-07', 'EST-08'].map(id => (
                          <option key={id} value={id}>{id}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Nível
                      </label>
                      <select
                        value={nivelDestino}
                        onChange={(e) => setNivelDestino(parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                        className="w-full text-xs font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100"
                      >
                        <option value={1}>N1 (Chão)</option>
                        <option value={2}>N2 (Médio 1)</option>
                        <option value={3}>N3 (Médio 2)</option>
                        <option value={4}>N4 (Topo)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSalvarPeca}
                    className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs"
                  >
                    Confirmar Endereçamento no Armazém
                  </button>
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  QR
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Etiquetas Homologadas DETRAN / Lei 12.977
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Cada peça desmontada recebe selo com QR Code rastreável até o chassi de origem.
                  </div>
                </div>
              </div>

              <Badge variant="emerald" size="sm">Selo Rastreável</Badge>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
