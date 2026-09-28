import React from 'react';
import { ScaleWeighingPage } from '../pages/yard/ScaleWeighingPage';
import { Material, ParceiroComercial, RomaneioPesagem } from '../types/erp';

export interface BalancaRecepcaoProps {
  materiais: Material[];
  parceiros: ParceiroComercial[];
  onRomaneioSalvo?: (romaneio: RomaneioPesagem) => void;
}

export const BalancaRecepcao: React.FC<BalancaRecepcaoProps> = (props) => {
  return <ScaleWeighingPage {...props} />;
};

export default BalancaRecepcao;
