import React from 'react';
import { PartnerSplitsPage } from '../pages/financial/PartnerSplitsPage';
import { SocioRepasse } from '../types/erp';

export interface DivisaoSociosProps {
  socios: SocioRepasse[];
  onLiquidarRepasse?: (socioId: string) => void;
}

export const DivisaoSocios: React.FC<DivisaoSociosProps> = (props) => {
  return <PartnerSplitsPage {...props} />;
};

export default DivisaoSocios;
