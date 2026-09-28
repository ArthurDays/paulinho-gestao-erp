import React from 'react';
import { WholesaleSalesPage } from '../pages/commercial/WholesaleSalesPage';
import { VendaAtacadoLote, Material, ParceiroComercial } from '../types/erp';

export interface VendasAtacadoProps {
  lotes: VendaAtacadoLote[];
  materiais: Material[];
  parceiros: ParceiroComercial[];
  onNovoLote?: (lote: VendaAtacadoLote) => void;
}

export const VendasAtacado: React.FC<VendasAtacadoProps> = (props) => {
  return <WholesaleSalesPage {...props} />;
};

export default VendasAtacado;
