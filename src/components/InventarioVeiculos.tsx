import React from 'react';
import { VehiclesDetranPage } from '../pages/yard/VehiclesDetranPage';
import { VeiculoDesmanche } from '../types/erp';

export interface InventarioVeiculosProps {
  veiculos: VeiculoDesmanche[];
  onAdmitirVeiculo?: (veiculo: VeiculoDesmanche) => void;
}

export const InventarioVeiculos: React.FC<InventarioVeiculosProps> = (props) => {
  return <VehiclesDetranPage {...props} />;
};

export default InventarioVeiculos;
