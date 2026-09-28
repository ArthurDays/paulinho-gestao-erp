import React from 'react';
import { ExecutiveDashboardPage } from '../pages/dashboard/ExecutiveDashboardPage';
import { KPIMetricas, DashboardAnalyticsData } from '../types/erp';
import { NavigationModuleId } from '../types/navigation';

export interface DashboardExecutivoProps {
  kpis: KPIMetricas;
  analytics: DashboardAnalyticsData;
  onNavigate: (moduleId: NavigationModuleId) => void;
}

export const DashboardExecutivo: React.FC<DashboardExecutivoProps> = (props) => {
  return <ExecutiveDashboardPage {...props} />;
};

export default DashboardExecutivo;
