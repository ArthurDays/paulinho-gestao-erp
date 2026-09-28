import React from 'react';
import { ShelvesWarehousePage } from '../pages/inventory/ShelvesWarehousePage';
import { Estante, PecaEstoque } from '../types/erp';

export interface PrateleirasEstoqueProps {
  estantes: Estante[];
  pecas: PecaEstoque[];
}

export const PrateleirasEstoque: React.FC<PrateleirasEstoqueProps> = (props) => {
  return <ShelvesWarehousePage {...props} />;
};

export default PrateleirasEstoque;
