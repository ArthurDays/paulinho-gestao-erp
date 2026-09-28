import React from 'react';
import { VeiculoDesmanche } from '../types/erp';
import { Badge } from './common/Badge';
import { useToast } from './common/Toast';
import { useBarcodeScanner } from './common/BarcodeListener';
import { syncQueueService } from '../services/syncQueueService';

export interface ProtocoloDescontaminacaoProps {
  veiculo: VeiculoDesmanche;
  onUpdateVeiculo: (veiculo: VeiculoDesmanche) => void;
}

export const ProtocoloDescontaminacao: React.FC<ProtocoloDescontaminacaoProps> = ({
  veiculo,
  onUpdateVeiculo
}) => {
  const { addToast } = useToast();
  const { registerScanHandler } = useBarcodeScanner();

  // Escuta de bipe para itens do checklist de descontaminação
  React.useEffect(() => {
    const unregister = registerScanHandler((scan) => {
      const code = scan.code.toUpperCase();
      if (code.includes('OLEO') || code.includes('MOTOR')) {
        handleIncrementFluido('oleoMotorLitros', 0.5);
        return true;
      }
      if (code.includes('CAMBIO')) {
        handleIncrementFluido('oleoCambioLitros', 0.5);
        return true;
      }
      if (code.includes('BAT') || code.includes('CHUMBO')) {
        handleToggleItem('bateriaChumboRemovida');
        return true;
      }
      if (code.includes('GAS') || code.includes('R134')) {
        handleToggleItem('gasRefrigeranteRecolhido');
        return true;
      }
      return false;
    });

    return unregister;
  }, [veiculo]);

  const handleIncrementFluido = (campo: 'oleoMotorLitros' | 'oleoCambioLitros' | 'fluidoArrefecimentoLitros' | 'fluidoFreioLitros', delta: number) => {
    const novosFluidos = {
      ...veiculo.fluidosDrenados,
      [campo]: Math.max(0, parseFloat((veiculo.fluidosDrenados[campo] + delta).toFixed(1)))
    };

    const atualizado: VeiculoDesmanche = {
      ...veiculo,
      fluidosDrenados: novosFluidos,
      descontaminado: novosFluidos.bateriaChumboRemovida && novosFluidos.gasRefrigeranteRecolhido && novosFluidos.oleoMotorLitros > 0
    };

    // System-First mutation
    syncQueueService.executeSystemFirst({
      mutateLocal: () => onUpdateVeiculo(atualizado),
      task: {
        type: 'VEICULO_DECONTAMINATE',
        entity: 'VEICULO',
        entityId: veiculo.chassi,
        data: {
          veiculo_id: veiculo.id,
          placa: veiculo.placa,
          chassi: veiculo.chassi,
          fluidos: novosFluidos
        }
      }
    });

    addToast({
      title: 'Fluido Atualizado (0ms)',
      message: `${campo}: ${novosFluidos[campo]}L registrados para ${veiculo.placa}.`,
      type: 'info'
    });
  };

  const handleToggleItem = (campo: 'bateriaChumboRemovida' | 'gasRefrigeranteRecolhido') => {
    const novosFluidos = {
      ...veiculo.fluidosDrenados,
      [campo]: !veiculo.fluidosDrenados[campo]
    };

    const atualizado: VeiculoDesmanche = {
      ...veiculo,
      fluidosDrenados: novosFluidos,
      descontaminado: novosFluidos.bateriaChumboRemovida && novosFluidos.gasRefrigeranteRecolhido && novosFluidos.oleoMotorLitros > 0
    };

    syncQueueService.executeSystemFirst({
      mutateLocal: () => onUpdateVeiculo(atualizado),
      task: {
        type: 'VEICULO_DECONTAMINATE',
        entity: 'VEICULO',
        entityId: veiculo.chassi,
        data: {
          veiculo_id: veiculo.id,
          placa: veiculo.placa,
          item_atualizado: campo,
          valor: novosFluidos[campo]
        }
      }
    });

    addToast({
      title: 'Protocolo Lei 12.977',
      message: `${campo === 'bateriaChumboRemovida' ? 'Bateria Chumbo-Ácido' : 'Gás R134a'} atualizado para ${veiculo.placa}.`,
      type: 'success'
    });
  };

  const fluidosCompletos = veiculo.fluidosDrenados.oleoMotorLitros > 0 &&
                           veiculo.fluidosDrenados.oleoCambioLitros > 0 &&
                           veiculo.fluidosDrenados.bateriaChumboRemovida &&
                           veiculo.fluidosDrenados.gasRefrigeranteRecolhido;

  return (
    <div className="space-y-5">
      {/* Header do Protocolo */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              Protocolo de Descontaminação Ambiental (Lei 12.977/2014)
            </h3>
            <Badge variant={fluidosCompletos ? 'emerald' : 'amber'} size="sm">
              {fluidosCompletos ? '100% Descontaminado' : 'Em Execução'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Drenagem de resíduos perigosos obrigatória antes do corte e desmontagem física das autopeças
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          Chassi: <span className="font-bold text-slate-800 dark:text-slate-200">{veiculo.chassi}</span>
        </div>
      </div>

      {/* Grid de Fluidos Drenados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Óleo Motor */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono uppercase">
              Óleo Motor (OLUC)
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Res. CONAMA 362</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              {veiculo.fluidosDrenados.oleoMotorLitros} <span className="text-xs font-normal text-slate-500">L</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleIncrementFluido('oleoMotorLitros', -0.5)}
                className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                -
              </button>
              <button
                onClick={() => handleIncrementFluido('oleoMotorLitros', 0.5)}
                className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Óleo Câmbio */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono uppercase">
              Óleo Câmbio / Trans.
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Drenagem</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              {veiculo.fluidosDrenados.oleoCambioLitros} <span className="text-xs font-normal text-slate-500">L</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleIncrementFluido('oleoCambioLitros', -0.5)}
                className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                -
              </button>
              <button
                onClick={() => handleIncrementFluido('oleoCambioLitros', 0.5)}
                className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Arrefecimento */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono uppercase">
              Arrefecimento
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Etilenoglicol</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              {veiculo.fluidosDrenados.fluidoArrefecimentoLitros} <span className="text-xs font-normal text-slate-500">L</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleIncrementFluido('fluidoArrefecimentoLitros', -0.5)}
                className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                -
              </button>
              <button
                onClick={() => handleIncrementFluido('fluidoArrefecimentoLitros', 0.5)}
                className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Fluido de Freio */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono uppercase">
              Fluido Freio DOT4
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Drenagem</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              {veiculo.fluidosDrenados.fluidoFreioLitros} <span className="text-xs font-normal text-slate-500">L</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleIncrementFluido('fluidoFreioLitros', -0.1)}
                className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                -
              </button>
              <button
                onClick={() => handleIncrementFluido('fluidoFreioLitros', 0.1)}
                className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Itens Críticos de Resíduos Especiais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label
          onClick={() => handleToggleItem('bateriaChumboRemovida')}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 select-none ${
            veiculo.fluidosDrenados.bateriaChumboRemovida
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <input
            type="checkbox"
            checked={veiculo.fluidosDrenados.bateriaChumboRemovida}
            readOnly
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Bateria Chumbo-Ácido Removida e Isolada
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Armazenamento em palete plástico estanque com bacia de contenção anti-ácido.
            </p>
          </div>
        </label>

        <label
          onClick={() => handleToggleItem('gasRefrigeranteRecolhido')}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 select-none ${
            veiculo.fluidosDrenados.gasRefrigeranteRecolhido
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <input
            type="checkbox"
            checked={veiculo.fluidosDrenados.gasRefrigeranteRecolhido}
            readOnly
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Gás Refrigerante R134a Recolhido
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Recolhimento em cilindro homologado IBAMA para evitar emissões atmosféricas.
            </p>
          </div>
        </label>
      </div>

      {/* Selo de Conformidade */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Protocolo vinculado à Certidão {veiculo.certidaoBaixaDetran}
        </span>
        <span className="text-[11px] text-slate-500">
          Suporta bipe de códigos de barras de lote
        </span>
      </div>
    </div>
  );
};

export default ProtocoloDescontaminacao;
