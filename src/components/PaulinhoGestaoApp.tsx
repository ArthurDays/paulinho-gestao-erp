import React, { useState } from 'react';
import { NavigationModuleId } from '../types/navigation';
import {
  Material,
  ParceiroComercial,
  Estante,
  VeiculoDesmanche,
  PecaEstoque,
  KPIMetricas,
  LancamentoFluxoCaixa,
  ContaPagarReceber,
  SocioRepasse,
  LicencaAmbiental,
  ManifestoDestinacaoResiduo,
  VendaAtacadoLote,
  OrcamentoOficina,
  UsuarioERP
} from '../types/erp';

// Mock Data
import {
  MATERIAIS_MOCK,
  PARCEIROS_MOCK,
  ESTANTES_MOCK,
  VEICULOS_MOCK,
  PECAS_MOCK,
  FLUXO_CAIXA_MOCK,
  CONTAS_PAGAR_RECEBER_MOCK,
  SOCIOS_REPASSE_MOCK,
  LICENCAS_MOCK,
  MANIFESTOS_RESIDUOS_MOCK,
  VENDAS_ATACADO_MOCK,
  ORCAMENTOS_MOCK,
  USUARIOS_MOCK,
  KPI_METRICAS_MOCK,
  ANALYTICS_DATA_MOCK
} from '../services/mockData';

// Layout & UI
import { Sidebar } from './layout/Sidebar';
import { TopNavbar } from './layout/TopNavbar';
import { ToastProvider, useToast } from './common/Toast';
import { BarcodeListenerProvider } from './common/BarcodeListener';
import { SyncEngineProvider } from './common/SyncEngine';

// Componentes dos Módulos (Conforme DAG)
import { DashboardExecutivo } from './DashboardExecutivo';
import { PlantaBaixaInterativa } from './PlantaBaixaInterativa';
import { BalancaRecepcao } from './BalancaRecepcao';
import { PatioDesmonte } from './PatioDesmonte';
import { InventarioVeiculos } from './InventarioVeiculos';
import { PrateleirasEstoque } from './PrateleirasEstoque';
import { CatalogoPecas } from './CatalogoPecas';
import { PDVBalcao } from './PDVBalcao';
import { VendasAtacado } from './VendasAtacado';
import { QuotesOrdersPage } from '../pages/commercial/QuotesOrdersPage';
import { FluxoCaixa } from './FluxoCaixa';
import { AccountsPayableReceivablePage } from '../pages/financial/AccountsPayableReceivablePage';
import { DivisaoSocios } from './DivisaoSocios';
import { SuiteFiscal } from './SuiteFiscal';
import { ComplianceEnvironmentalPage } from '../pages/fiscal/ComplianceEnvironmentalPage';
import { SyncPlanilhas } from './SyncPlanilhas';
import { SpecsfyTerminalPage } from '../pages/integrations/SpecsfyTerminalPage';
import { SettingsPermissionsPage } from '../pages/integrations/SettingsPermissionsPage';

const PaulinhoGestaoAppContent: React.FC = () => {
  const { addToast } = useToast();

  // Navegação Ativa (padrão: Visão Executiva)
  const [currentModule, setCurrentModule] = useState<NavigationModuleId>('visao-executiva');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados Globais Reativos do ERP
  const [materiais] = useState<Material[]>(MATERIAIS_MOCK);
  const [parceiros] = useState<ParceiroComercial[]>(PARCEIROS_MOCK);
  const [estantes, setEstantes] = useState<Estante[]>(ESTANTES_MOCK);
  const [veiculos, setVeiculos] = useState<VeiculoDesmanche[]>(VEICULOS_MOCK);
  const [pecas, setPecas] = useState<PecaEstoque[]>(PECAS_MOCK);
  const [lancamentos, setLancamentos] = useState<LancamentoFluxoCaixa[]>(FLUXO_CAIXA_MOCK);
  const [contas, setContas] = useState<ContaPagarReceber[]>(CONTAS_PAGAR_RECEBER_MOCK);
  const [socios] = useState<SocioRepasse[]>(SOCIOS_REPASSE_MOCK);
  const [licencas] = useState<LicencaAmbiental[]>(LICENCAS_MOCK);
  const [manifestos] = useState<ManifestoDestinacaoResiduo[]>(MANIFESTOS_RESIDUOS_MOCK);
  const [lotesAtacado, setLotesAtacado] = useState<VendaAtacadoLote[]>(VENDAS_ATACADO_MOCK);
  const [orcamentos, setOrcamentos] = useState<OrcamentoOficina[]>(ORCAMENTOS_MOCK);
  const [usuarios, setUsuarios] = useState<UsuarioERP[]>(USUARIOS_MOCK);
  const [kpis, setKpis] = useState<KPIMetricas>(KPI_METRICAS_MOCK);

  // Handlers Reativos entre Nós do Grafo
  const handleNovoRomaneio = (romaneio: any) => {
    // Atualiza KPIs
    setKpis(prev => ({
      ...prev,
      totalPagoFornecedoresHoje: prev.totalPagoFornecedoresHoje + romaneio.valorTotal,
      totalMetaisPesadosHojeKg: prev.totalMetaisPesadosHojeKg + romaneio.pesoLiquidoTotalKg
    }));

    // Registra Saída no Fluxo de Caixa
    const novoLanc: LancamentoFluxoCaixa = {
      id: `LAN-${Date.now()}`,
      dataHora: new Date().toLocaleTimeString('pt-BR'),
      tipo: 'SAIDA',
      categoria: 'Compra Sucata Fornecedor',
      descricao: `Romaneio ${romaneio.id} - ${romaneio.parceiro.nome}`,
      valor: romaneio.valorTotal,
      formaPagamento: romaneio.metodoLiquidacao || 'PIX',
      saldoAposLancamento: 48250.80 - romaneio.valorTotal
    };
    setLancamentos(prev => [novoLanc, ...prev]);
  };

  const handleExtrairPeca = (novaPecaPartial: Partial<PecaEstoque>) => {
    const novaPeca: PecaEstoque = {
      id: `PC-2026-${Math.floor(100 + Math.random() * 900)}`,
      codigoOem: novaPecaPartial.codigoOem || 'OEM-GENERIC',
      descricao: novaPecaPartial.descricao || 'Peça Desmontada',
      categoria: novaPecaPartial.categoria || 'Mecânica',
      veiculoOrigem: novaPecaPartial.veiculoOrigem || 'Veículo CDV',
      veiculoId: novaPecaPartial.veiculoId,
      estanteId: novaPecaPartial.estanteId || 'EST-01',
      nivel: novaPecaPartial.nivel || 2,
      posicaoRack: novaPecaPartial.posicaoRack || 'N2-P01',
      condicao: novaPecaPartial.condicao || 'Grau A - Excelente',
      precoCusto: novaPecaPartial.precoCusto || 100,
      precoVenda: novaPecaPartial.precoVenda || 300,
      quantidadeEstoque: 1,
      estoqueMinimo: 1,
      status: 'Disponível',
      codigoBarrasQr: novaPecaPartial.codigoBarrasQr || 'QR-CODE',
      dataEntrada: new Date().toISOString().split('T')[0]
    };

    setPecas(prev => [novaPeca, ...prev]);

    // Atualiza contagem na estante
    setEstantes(prev => prev.map(e => {
      if (e.id === novaPeca.estanteId) {
        return { ...e, ocupacaoItens: Math.min(e.capacidadeMaxItens, e.ocupacaoItens + 1) };
      }
      return e;
    }));
  };

  const handleFinalizarVendaPDV = (venda: any) => {
    setKpis(prev => ({
      ...prev,
      totalVendasBalcaoHoje: prev.totalVendasBalcaoHoje + venda.valorTotal
    }));

    // Registra Entrada no Fluxo de Caixa
    const novoLanc: LancamentoFluxoCaixa = {
      id: `LAN-${Date.now()}`,
      dataHora: new Date().toLocaleTimeString('pt-BR'),
      tipo: 'ENTRADA',
      categoria: 'Venda Balcão',
      descricao: `Venda NFC-e #${venda.id} - ${venda.clienteNome}`,
      valor: venda.valorTotal,
      formaPagamento: venda.formaPagamento,
      saldoAposLancamento: 48250.80 + venda.valorTotal
    };
    setLancamentos(prev => [novoLanc, ...prev]);
  };

  // Renderizador Dinâmico de Módulos
  const renderActiveModule = () => {
    switch (currentModule) {
      // 1. DASHBOARD & INTELIGÊNCIA
      case 'visao-executiva':
        return (
          <DashboardExecutivo
            kpis={kpis}
            analytics={ANALYTICS_DATA_MOCK}
            onNavigate={(mod) => setCurrentModule(mod)}
          />
        );
      case 'planta-baixa':
        return (
          <PlantaBaixaInterativa
            estantes={estantes}
            veiculos={veiculos}
            pecas={pecas}
            kpis={kpis}
            onNavigate={(mod) => setCurrentModule(mod)}
          />
        );

      // 2. OPERAÇÕES DE PÁTIO & CDV
      case 'balanca-recepcao':
        return (
          <BalancaRecepcao
            materiais={materiais}
            parceiros={parceiros}
            onRomaneioSalvo={handleNovoRomaneio}
          />
        );
      case 'linha-desmontagem':
        return (
          <PatioDesmonte
            veiculos={veiculos}
            onExtrairPeca={handleExtrairPeca}
            onAtualizarVeiculo={(v) => {
              setVeiculos(prev => prev.map(item => item.id === v.id ? v : item));
            }}
          />
        );
      case 'gestao-veiculos':
        return (
          <InventarioVeiculos
            veiculos={veiculos}
            onAdmitirVeiculo={(novo) => setVeiculos(prev => [novo, ...prev])}
          />
        );

      // 3. ESTOQUE & ARMAZÉM VERTICAL
      case 'prateleiras-estantes':
        return (
          <PrateleirasEstoque
            estantes={estantes}
            pecas={pecas}
          />
        );
      case 'inventario-autopecas':
        return (
          <CatalogoPecas
            pecas={pecas}
            onAdicionarAoPdv={(p) => {
              setCurrentModule('pdv-frente-caixa');
              addToast({
                title: 'Peça Encaminhada ao Balcão',
                message: `${p.descricao} pronta para checkout.`,
                type: 'info'
              });
            }}
          />
        );

      // 4. COMERCIAL & VENDAS
      case 'pdv-frente-caixa':
        return (
          <PDVBalcao
            pecas={pecas}
            parceiros={parceiros}
            onFinalizarVenda={handleFinalizarVendaPDV}
          />
        );
      case 'vendas-atacado':
        return (
          <VendasAtacado
            lotes={lotesAtacado}
            materiais={materiais}
            parceiros={parceiros}
            onNovoLote={(lote) => setLotesAtacado(prev => [lote, ...prev])}
          />
        );
      case 'orcamentos-pedidos':
        return (
          <QuotesOrdersPage
            orcamentos={orcamentos}
            parceiros={parceiros}
            onNovoOrcamento={(orc) => setOrcamentos(prev => [orc, ...prev])}
            onConverterVenda={() => {
              setCurrentModule('pdv-frente-caixa');
            }}
          />
        );

      // 5. FINANCEIRO & CAIXA
      case 'fluxo-caixa':
        return (
          <FluxoCaixa
            lancamentos={lancamentos}
            onNovoLancamento={(lanc) => setLancamentos(prev => [lanc, ...prev])}
          />
        );
      case 'contas-pagar-receber':
        return (
          <AccountsPayableReceivablePage
            contas={contas}
            onLiquidarConta={(id) => {
              setContas(prev => prev.map(c => c.id === id ? { ...c, status: 'PAGO' } : c));
            }}
            onNovaConta={(nova) => setContas(prev => [nova, ...prev])}
          />
        );
      case 'divisao-socios':
        return (
          <DivisaoSocios
            socios={socios}
          />
        );

      // 6. FISCAL, JURÍDICO & CONFORMIDADE
      case 'suite-fiscal-sefaz':
        return <SuiteFiscal />;
      case 'conformidade-ambiental':
        return (
          <ComplianceEnvironmentalPage
            licencas={licencas}
            manifestos={manifestos}
          />
        );

      // 7. INTEGRAÇÕES & FERRAMENTAS
      case 'sync-planilhas':
        return <SyncPlanilhas />;
      case 'terminal-specsfy':
        return <SpecsfyTerminalPage />;
      case 'config-permissoes':
        return (
          <SettingsPermissionsPage
            usuarios={usuarios}
            onNovoUsuario={(u) => setUsuarios(prev => [...prev, u])}
          />
        );

      default:
        return (
          <DashboardExecutivo
            kpis={kpis}
            analytics={ANALYTICS_DATA_MOCK}
            onNavigate={(mod) => setCurrentModule(mod)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex antialiased">
      
      {/* Sidebar Corporativa Fixa */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Área de Conteúdo Principal com Offset para Sidebar Fixa (lg:pl-72) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        
        {/* TopNavbar Enterprise Global com Barcode HUD & Sync Status */}
        <TopNavbar
          currentModule={currentModule}
          kpis={kpis}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onQuickAction={(action) => {
            if (action === 'balanca') setCurrentModule('balanca-recepcao');
            if (action === 'pdv') setCurrentModule('pdv-frente-caixa');
            if (action === 'sync') setCurrentModule('sync-planilhas');
          }}
        />

        {/* Viewport do Módulo Ativo */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveModule()}
        </main>

      </div>

    </div>
  );
};

export const PaulinhoGestaoApp: React.FC = () => {
  return (
    <ToastProvider>
      <BarcodeListenerProvider>
        <SyncEngineProvider>
          <PaulinhoGestaoAppContent />
        </SyncEngineProvider>
      </BarcodeListenerProvider>
    </ToastProvider>
  );
};

export default PaulinhoGestaoApp;
