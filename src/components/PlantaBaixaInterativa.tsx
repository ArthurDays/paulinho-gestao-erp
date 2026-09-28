import React from 'react';
import { FloorplanPage } from '../pages/dashboard/FloorplanPage';
import { Estante, VeiculoDesmanche, PecaEstoque, KPIMetricas } from '../types/erp';
import { NavigationModuleId } from '../types/navigation';

export interface PlantaBaixaInterativaProps {
  estantes: Estante[];
  veiculos: VeiculoDesmanche[];
  pecas: PecaEstoque[];
  kpis: KPIMetricas;
  onNavigate: (moduleId: NavigationModuleId) => void;
}

export const PlantaBaixaInterativa: React.FC<PlantaBaixaInterativaProps> = (props) => {
  return <FloorplanPage {...props} />;
};

export default PlantaBaixaInterativa;
