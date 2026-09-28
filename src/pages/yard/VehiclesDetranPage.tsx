import React, { useState } from 'react';
import { VeiculoDesmanche } from '../../types/erp';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

interface VehiclesDetranPageProps {
  veiculos: VeiculoDesmanche[];
  onAdmitirVeiculo?: (veiculo: VeiculoDesmanche) => void;
}

export const VehiclesDetranPage: React.FC<VehiclesDetranPageProps> = ({
  veiculos,
  onAdmitirVeiculo
}) => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form de admissão
  const [marcaModelo, setMarcaModelo] = useState('');
  const [ano, setAno] = useState<number>(2020);
  const [placa, setPlaca] = useState('');
  const [chassi, setChassi] = useState('');
  const [renavam, setRenavam] = useState('');
  const [certidaoBaixa, setCertidaoBaixa] = useState('');

  const veiculosFiltrados = veiculos.filter(v => 
    v.marcaModelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.chassi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSalvarNovoVeiculo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marcaModelo || !placa || !chassi) {
      addToast({
        title: 'Dados Incompletos',
        message: 'Preencha Marca/Modelo, Placa e Chassi para prosseguir.',
        type: 'warning'
      });
      return;
    }

    const novo: VeiculoDesmanche = {
      id: `VD-00${veiculos.length + 1}`,
      marcaModelo,
      ano,
      placa: placa.toUpperCase(),
      chassi: chassi.toUpperCase(),
      renavam: renavam || '00000000000',
      certidaoBaixaDetran: certidaoBaixa || `DETRAN-SP/BAIXA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      baiaId: 'BAIA-01',
      baiaNome: 'Baia 1 (Elevador Esquerdo)',
      status: 'Aguardando Baixa',
      progressoPct: 0,
      descontaminado: false,
      fluidosDrenados: {
        oleoMotorLitros: 0,
        oleoCambioLitros: 0,
        fluidoArrefecimentoLitros: 0,
        fluidoFreioLitros: 0,
        bateriaChumboRemovida: false,
        gasRefrigeranteRecolhido: false
      },
      fotoTag: 'Veículo em Pátio',
      pecasGeradasQtd: 0,
      sucataGeradaKg: 0,
      dataEntrada: new Date().toISOString().split('T')[0]
    };

    if (onAdmitirVeiculo) onAdmitirVeiculo(novo);

    addToast({
      title: 'Veículo Admitido no CDV',
      message: `${novo.marcaModelo} (${novo.placa}) registrado com Certidão DETRAN.`,
      type: 'success'
    });

    setIsModalOpen(false);
    setMarcaModelo('');
    setPlaca('');
    setChassi('');
    setRenavam('');
    setCertidaoBaixa('');
  };

  const handleImprimirLaudo = (v: VeiculoDesmanche) => {
    addToast({
      title: 'Laudo de Sucata Aproveitável Gerado',
      message: `Documento PDF do chassi ${v.chassi} emitido em conformidade com o DETRAN-SP.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar Operacional */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Controle de Veículos & Baixa DETRAN (CDV)
          </h2>
          <p className="text-xs text-slate-500">
            Rastreabilidade veicular, certidões de baixa e laudos técnicos (Lei Federal 12.977/2014)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar placa, chassi ou modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 w-64 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Admitir Veículo</span>
          </button>
        </div>
      </div>

      {/* Tabela de Veículos CDV */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 uppercase font-mono">
                <th className="py-2.5">Veículo / Modelo</th>
                <th className="py-2.5">Placa / Renavam</th>
                <th className="py-2.5">Chassi (VIN)</th>
                <th className="py-2.5">Certidão Baixa DETRAN</th>
                <th className="py-2.5">Status Pátio</th>
                <th className="py-2.5 text-center">Descontaminação</th>
                <th className="py-2.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {veiculosFiltrados.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                    <div className="font-semibold">{v.marcaModelo}</div>
                    <span className="text-[10px] text-slate-400 font-mono">Ano: {v.ano} • {v.id}</span>
                  </td>
                  <td className="py-3 font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{v.placa}</span>
                    <span className="block text-[10px] text-slate-400">Ren: {v.renavam}</span>
                  </td>
                  <td className="py-3 font-mono text-slate-600 dark:text-slate-300">
                    {v.chassi}
                  </td>
                  <td className="py-3 font-mono">
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{v.certidaoBaixaDetran}</span>
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">Baixa Definitiva SP</span>
                  </td>
                  <td className="py-3">
                    <Badge variant={v.status === 'Desmontado' ? 'emerald' : 'amber'} size="sm">
                      {v.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-center">
                    {v.descontaminado ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Fluidos OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleImprimirLaudo(v)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Laudo Técnico
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Admissão */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Admissão de Veículo para Desmonte (CDV)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarNovoVeiculo} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Marca & Modelo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fiat Toro Freedom 1.8 Flex"
                  value={marcaModelo}
                  onChange={(e) => setMarcaModelo(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Placa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="BRA2E19"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="w-full text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ano
                  </label>
                  <input
                    type="number"
                    value={ano}
                    onChange={(e) => setAno(parseInt(e.target.value) || 2020)}
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Chassi (17 Dígitos)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="9BWKB41K9KM089211"
                    value={chassi}
                    onChange={(e) => setChassi(e.target.value)}
                    className="w-full text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Renavam
                  </label>
                  <input
                    type="text"
                    placeholder="01239847192"
                    value={renavam}
                    onChange={(e) => setRenavam(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Certidão de Baixa DETRAN
                </label>
                <input
                  type="text"
                  placeholder="DETRAN-SP/BAIXA-2026-XXXX"
                  value={certidaoBaixa}
                  onChange={(e) => setCertidaoBaixa(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                />
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
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs"
                >
                  Confirmar Admissão CDV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
