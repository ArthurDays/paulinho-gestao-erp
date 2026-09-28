import React from 'react';
import { FloorplanPage } from '../pages/dashboard/FloorplanPage';
import { Estante, VeiculoDesmanche, PecaEstoque, KPIMetricas } from '../types/erp';
import { NavigationModuleId } from '../types/navigation';

export interface PlantaBaixaProps {
  estantes: Estante[];
  veiculos: VeiculoDesmanche[];
  pecas: PecaEstoque[];
  kpis: KPIMetricas;
  onNavigate: (moduleId: NavigationModuleId) => void;
}

export const PlantaBaixa: React.FC<PlantaBaixaProps> = (props) => {
  return <FloorplanPage {...props} />;
};

export default PlantaBaixa;
