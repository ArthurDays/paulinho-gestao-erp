import React, { useState } from 'react';
import { VeiculoDesmanche, PecaEstoque } from '../types/erp';

interface PatioDesmancheModuleProps {
  veiculos: VeiculoDesmanche[];
  onExtrairPecaParaEstoque?: (novaPeca: Partial<PecaEstoque>) => void;
  onEncaminharSucataParaBalanca?: (pesoKg: number, veiculoId: string) => void;
}

export const PatioDesmancheModule: React.FC<PatioDesmancheModuleProps> = ({
  veiculos,
  onExtrairPecaParaEstoque,
  onEncaminharSucataParaBalanca
}) => {
  const [selectedVeiculo, setSelectedVeiculo] = useState<VeiculoDesmanche>(veiculos[0]);
  const [isModalTriagemOpen, setIsModalTriagemOpen] = useState(false);
  const [isModalDescontaminacaoOpen, setIsModalDescontaminacaoOpen] = useState(false);

  // Form State para Extração de Peça
  const [novaPecaDesc, setNovaPecaDesc] = useState('');
  const [novaPecaCat, setNovaPecaCat] = useState<'Freios' | 'Mecânica' | 'Suspensão' | 'Elétrica' | 'Motor'>('Mecânica');
  const [novaPecaPreco, setNovaPecaPreco] = useState(250.0);
  const [novaPecaEstante, setNovaPecaEstante] = useState('EST-01');
  const [novaPecaNivel, setNovaPecaNivel] = useState<1 | 2 | 3 | 4>(2);
  const [sucataKgInput, setSucataKgInput] = useState(45.0);

  const handleSalvarExtracaoEstoque = () => {
    if (!novaPecaDesc.trim()) {
      alert('Informe a descrição da autopeça extraída.');
      return;
    }

    if (onExtrairPecaParaEstoque) {
      onExtrairPecaParaEstoque({
        descricao: novaPecaDesc,
        categoria: novaPecaCat,
        precoVenda: novaPecaPreco,
        estanteId: novaPecaEstante,
        nivel: novaPecaNivel,
        veiculoOrigem: `${selectedVeiculo.marcaModelo} (${selectedVeiculo.placa})`,
        veiculoId: selectedVeiculo.id,
        condicao: 'Grau A - Excelente',
        codigoOem: `OEM-${Math.floor(Math.random() * 89999 + 10000)}`,
        codigoBarrasQr: `QR-PAU-${Date.now().toString().slice(-6)}`
      });
    }

    alert(`Autopeça "${novaPecaDesc}" catalogada e enviada para ${novaPecaEstante} / Nível N${novaPecaNivel}!`);
    setIsModalTriagemOpen(false);
    setNovaPecaDesc('');
  };

  const handleSalvarSucataBalanca = () => {
    if (onEncaminharSucataParaBalanca) {
      onEncaminharSucataParaBalanca(sucataKgInput, selectedVeiculo.id);
    }
    alert(`Lote de ${sucataKgInput} kg de sucata encaminhado para pesagem no Balcão!`);
    setIsModalTriagemOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header do Pátio */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🚗</span>
            <span>Pátio de Desmanche & Linha de Descontaminação (CDV)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Controle de elevadores automotivos, drenagem ecológica obrigatória e triagem de autopeças.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            Lei Federal 12.977/2014 • DETRAN Ativo
          </span>
        </div>
      </div>

      {/* Grid das Baias com os Veículos da Foto Industrial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {veiculos.map((v) => {
          const isSelected = selectedVeiculo.id === v.id;

          return (
            <div
              key={v.id}
              onClick={() => setSelectedVeiculo(v)}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm cursor-pointer transition-all flex flex-col gap-5 ${
                isSelected
                  ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              {/* Topo do Card da Baia */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-lg font-bold text-orange-500">
                    {v.baiaId === 'BAIA-01' ? '1' : '2'}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 block">
                      {v.baiaNome}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {v.marcaModelo}
                    </h3>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                  v.descontaminado
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                }`}>
                  {v.status}
                </span>
              </div>

              {/* Informações Documentais DETRAN */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Placa / Chassi:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{v.placa}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Certidão DETRAN:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{v.certidaoBaixaDetran}</span>
                </div>
              </div>

              {/* Barra de Progresso do Desmanche */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Desmontagem e Triagem</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{v.progressoPct}% Concluído</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${v.progressoPct}%` }}
                  />
                </div>
              </div>

              {/* Métricas de Peças e Sucata Geradas */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>📦 Peças Extraídas: <strong className="text-slate-900 dark:text-white font-mono">{v.pecasGeradasQtd} un</strong></span>
                <span>⚖️ Sucata Destinada: <strong className="text-slate-900 dark:text-white font-mono">{v.sucataGeradaKg} kg</strong></span>
              </div>

              {/* Ações da Baia */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVeiculo(v);
                    setIsModalDescontaminacaoOpen(true);
                  }}
                  className="py-2 px-3 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 transition"
                >
                  💧 Descontaminação
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVeiculo(v);
                    setIsModalTriagemOpen(true);
                  }}
                  className="py-2 px-3 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition shadow-sm"
                >
                  ⚙️ Extrair Peça / Sucata
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE TRIAGEM E EXTRAÇÃO DE AUTOPEÇAS */}
      {isModalTriagemOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Triagem do Elevador: {selectedVeiculo.marcaModelo}
                </h3>
                <span className="text-xs text-slate-500">Destine os itens extraídos para estoque vertical ou para a balança de sucata.</span>
              </div>
              <button
                onClick={() => setIsModalTriagemOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* OPÇÃO 1: AUTOPEÇA PARA AS PRATELEIRAS */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex flex-col gap-3">
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Opção 1: Enviar Autopeça para as Prateleiras (Estoque)
              </span>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Descrição da Peça Extraída:</label>
                <input
                  type="text"
                  placeholder="Ex: Pinça de Freio Dianteira Esquerda"
                  value={novaPecaDesc}
                  onChange={(e) => setNovaPecaDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Preço Sugerido (R$):</label>
                  <input
                    type="number"
                    step="10"
                    value={novaPecaPreco}
                    onChange={(e) => setNovaPecaPreco(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Estante Destino:</label>
                  <select
                    value={novaPecaEstante}
                    onChange={(e) => setNovaPecaEstante(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="EST-01">EST-01 (Freios)</option>
                    <option value="EST-02">EST-02 (Suspensão)</option>
                    <option value="EST-03">EST-03 (Motor)</option>
                    <option value="EST-04">EST-04 (Kraft)</option>
                    <option value="EST-07">EST-07 (Alternadores)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Nível Vertical:</label>
                  <select
                    value={novaPecaNivel}
                    onChange={(e) => setNovaPecaNivel(parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                    className="w-full px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value={4}>N4 (Topo)</option>
                    <option value={3}>N3 (Médio-Alto)</option>
                    <option value={2}>N2 (Intermediário)</option>
                    <option value={1}>N1 (Base)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSalvarExtracaoEstoque}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition"
              >
                📦 Catalogar com QR Code e Alocar na Estante
              </button>
            </div>

            {/* OPÇÃO 2: SUCATA PARA A BALANÇA */}
            <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60 flex flex-col gap-3">
              <span className="text-xs font-extrabold text-orange-800 dark:text-orange-300 uppercase tracking-wider">
                Opção 2: Separar Sucata Metálica (Vai para Balança)
              </span>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Peso Estimado de Sucata (kg):</label>
                  <input
                    type="number"
                    step="1"
                    value={sucataKgInput}
                    onChange={(e) => setSucataKgInput(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleSalvarSucataBalanca}
                  className="mt-5 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow transition"
                >
                  ⚖️ Enviar para Balança
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CHECKLIST AMBIENTAL */}
      {isModalDescontaminacaoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Checklist Ambiental de Descontaminação
              </h3>
              <button
                onClick={() => setIsModalDescontaminacaoOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                <span>Óleo do motor drenado ({selectedVeiculo.fluidosDrenados.oleoMotorLitros}L)</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                <span>Óleo de transmissão / câmbio ({selectedVeiculo.fluidosDrenados.oleoCambioLitros}L)</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                <span>Fluido de arrefecimento ({selectedVeiculo.fluidosDrenados.fluidoArrefecimentoLitros}L)</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                <span>Bateria chumbo-ácido removida e isolada</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                <span>Gás refrigerante recolhido (sem emissão atmosférica)</span>
              </label>
            </div>

            <button
              onClick={() => {
                alert('Protocolo ambiental validado e carimbado no dossiê do veículo.');
                setIsModalDescontaminacaoOpen(false);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition"
            >
              ✓ Confirmar Descontaminação Ambiental
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
