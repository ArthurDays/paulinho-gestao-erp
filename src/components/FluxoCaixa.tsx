import React from 'react';
import { CashFlowPage } from '../pages/financial/CashFlowPage';
import { LancamentoFluxoCaixa } from '../types/erp';

export interface FluxoCaixaProps {
  lancamentos: LancamentoFluxoCaixa[];
  onNovoLancamento?: (lancamento: LancamentoFluxoCaixa) => void;
}

export const FluxoCaixa: React.FC<FluxoCaixaProps> = (props) => {
  return <CashFlowPage {...props} />;
};

export default FluxoCaixa;
