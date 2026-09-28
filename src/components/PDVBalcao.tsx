import React from 'react';
import { PosTerminalPage } from '../pages/commercial/PosTerminalPage';
import { PecaEstoque, ParceiroComercial } from '../types/erp';

export interface PDVBalcaoProps {
  pecas: PecaEstoque[];
  parceiros: ParceiroComercial[];
  onFinalizarVenda?: (venda: any) => void;
}

export const PDVBalcao: React.FC<PDVBalcaoProps> = (props) => {
  return <PosTerminalPage {...props} />;
};

export default PDVBalcao;
