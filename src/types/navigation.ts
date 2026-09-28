/**
 * Paulinho Gestão - Definições de Tipos de Navegação e Menu Lateral
 * Estrutura estrita dos 7 módulos do ERP Enterprise
 */

export type NavigationModuleId =
  // 1. DASHBOARD & INTELIGÊNCIA
  | 'visao-executiva'
  | 'planta-baixa'
  
  // 2. OPERAÇÕES DE PÁTIO & CDV
  | 'balanca-recepcao'
  | 'linha-desmontagem'
  | 'gestao-veiculos'
  
  // 3. ESTOQUE & ARMAZÉM VERTICAL
  | 'prateleiras-estantes'
  | 'inventario-autopecas'
  
  // 4. COMERCIAL & VENDAS
  | 'pdv-frente-caixa'
  | 'vendas-atacado'
  | 'orcamentos-pedidos'
  
  // 5. FINANCEIRO & CAIXA
  | 'fluxo-caixa'
  | 'contas-pagar-receber'
  | 'divisao-socios'
  
  // 6. FISCAL, JURÍDICO & CONFORMIDADE
  | 'suite-fiscal-sefaz'
  | 'conformidade-ambiental'
  
  // 7. INTEGRAÇÕES & FERRAMENTAS
  | 'sync-planilhas'
  | 'terminal-specsfy'
  | 'config-permissoes';

export interface NavItem {
  id: NavigationModuleId;
  label: string;
  badge?: string;
  badgeVariant?: 'emerald' | 'amber' | 'blue' | 'purple' | 'slate';
  shortcut?: string;
}

export interface NavSection {
  id: string;
  title: string;
  iconName: string;
  items: NavItem[];
}
