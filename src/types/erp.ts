/**
 * Paulinho Gestão - ERP Industrial para Ferro-Velho, Reciclagem & CDV
 * Definições de Tipos TypeScript (Domain-Driven Design)
 * Compatível com Leis Ambientais e Lei do Desmonte (Lei Federal 12.977/2014)
 */

// ============================================================================
// 1. MÓDULO BALANÇA & TRIAGEM DE METAIS
// ============================================================================

export type MaterialCategory =
  | 'Cobre'
  | 'Aluminio'
  | 'Ferro'
  | 'Latao'
  | 'Inox'
  | 'Baterias'
  | 'Especiais';

export interface Material {
  id: string; // Ex: "MT-COB-01"
  nome: string;
  categoria: MaterialCategory;
  precoCompraKg: number;
  precoVendaKg: number;
  toleranciaImpurezaPct: number;
  corHex: string;
  icone: string;
  descricao: string;
}

export type TipoOperacaoPesagem = 'COMPRA' | 'VENDA';

export interface PesagemItem {
  id: string;
  materialId: string;
  materialNome: string;
  categoria: MaterialCategory;
  pesoBrutoKg: number;
  taraKg: number;
  pesoLiquidoBaseKg: number;
  descontoImpurezaPct: number;
  descontoImpurezaKg: number;
  pesoFaturadoKg: number;
  precoUnitarioKg: number;
  subtotal: number;
}

export interface ParceiroComercial {
  id: string;
  tipo: 'FORNECEDOR' | 'CLIENTE' | 'AMBOS';
  nome: string;
  documento: string; // CPF ou CNPJ
  telefone: string;
  chavePix?: string;
  placaVeiculo?: string;
  categoria: 'Catador Autônomo' | 'Oficina Credenciada' | 'Comerciante de Sucata' | 'Indústria Siderúrgica' | 'Consumidor Final';
}

export type MetodoLiquidacao = 'PIX' | 'DINHEIRO' | 'TRANSFERENCIA' | 'CARTAO';

export interface RomaneioPesagem {
  id: string; // Ex: "ROM-2026-089"
  dataHora: string;
  tipo: TipoOperacaoPesagem;
  parceiro: ParceiroComercial;
  itens: PesagemItem[];
  pesoBrutoTotalKg: number;
  taraTotalKg: number;
  pesoLiquidoTotalKg: number;
  valorTotal: number;
  metodoLiquidacao?: MetodoLiquidacao;
  status: 'PENDENTE' | 'LIQUIDADO' | 'CANCELADO';
  chaveAcessoNfe?: string;
}

// ============================================================================
// 2. MÓDULO PÁTIO DE DESMANCHE & DESCONTAMINAÇÃO AMBIENTAL (CDV)
// ============================================================================

export interface FluidosDrenados {
  oleoMotorLitros: number;
  oleoCambioLitros: number;
  fluidoArrefecimentoLitros: number;
  fluidoFreioLitros: number;
  bateriaChumboRemovida: boolean;
  gasRefrigeranteRecolhido: boolean;
}

export type StatusDesmanche =
  | 'Aguardando Baixa'
  | 'Em Descontaminação'
  | 'Em Desmontagem'
  | 'Desmontado'
  | 'Carcaça Prensada';

export interface VeiculoDesmanche {
  id: string; // Ex: "VD-001"
  marcaModelo: string;
  ano: number;
  placa: string;
  chassi: string;
  renavam: string;
  certidaoBaixaDetran: string; // Lei 12.977/2014
  baiaId: 'BAIA-01' | 'BAIA-02';
  baiaNome: string;
  status: StatusDesmanche;
  progressoPct: number;
  descontaminado: boolean;
  fluidosDrenados: FluidosDrenados;
  fotoTag: string;
  pecasGeradasQtd: number;
  sucataGeradaKg: number;
  dataEntrada: string;
}

// ============================================================================
// 3. MÓDULO PRATELEIRAS & ESTOQUE VERTICALIZADO
// ============================================================================

export type AlaEstante = 'Esquerda' | 'Direita';

export interface NivelEstanteInfo {
  nivel: 1 | 2 | 3 | 4;
  codigo: 'N1' | 'N2' | 'N3' | 'N4';
  nome: string;
  descricao: string;
  capacidadeItens: number;
  ocupacaoItens: number;
}

export interface Estante {
  id: string; // Ex: "EST-01" a "EST-08"
  ala: AlaEstante;
  posicaoCorredor: number; // 1 a 4
  titulo: string;
  capacidadeMaxItens: number;
  ocupacaoItens: number;
  icone: string;
  niveis: NivelEstanteInfo[];
}

export type CondicaoPeca =
  | 'Grau A - Excelente'
  | 'Grau B - Bom Estado'
  | 'Grau C - Recondicionável';

export interface PecaEstoque {
  id: string; // Ex: "PC-2026-001"
  codigoOem: string;
  descricao: string;
  categoria: 'Freios' | 'Mecânica' | 'Suspensão' | 'Elétrica' | 'Motor' | 'Rodas' | 'Fixação';
  veiculoOrigem: string;
  veiculoId?: string;
  estanteId: string;
  nivel: 1 | 2 | 3 | 4;
  posicaoRack: string; // Ex: "N2-P04"
  condicao: CondicaoPeca;
  precoCusto: number;
  precoVenda: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  status: 'Disponível' | 'Vendido' | 'Reservado';
  codigoBarrasQr: string;
  dataEntrada: string;
}

// ============================================================================
// 4. MÓDULO FISCAL & VENDAS
// ============================================================================

export interface VendaBalcao {
  id: string;
  dataHora: string;
  clienteNome: string;
  documentoCliente?: string;
  itens: {
    pecaId?: string;
    descricao: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
  }[];
  valorTotal: number;
  formaPagamento: MetodoLiquidacao;
  chaveNfeSefaz?: string;
  statusFiscal: 'Autorizada' | 'Pendente' | 'Contingência';
}

// ============================================================================
// 5. MÓDULO DE SINCRONIZAÇÃO INTELIGENTE COM PLANILHAS (INVENTORY SYNC)
// ============================================================================

export type SyncStatus = 'CONECTADO' | 'SINCRONIZANDO' | 'ERRO' | 'DESCONECTADO';

export interface SheetTabMapping {
  abaNome: 'Peças' | 'Veículos' | 'Sucatas';
  colunasMapeadas: Record<string, string>;
  totalLinhasLidas: number;
  ultimaAtualizacao: string;
}

export interface SheetSyncConfig {
  planilhaUrl: string;
  planilhaId: string;
  webhookUrl: string;
  modoSincronizacao: 'AUTOMATICO_WEBHOOK' | 'MANUAL_CSV' | 'INTERVALO_CRON';
  intervaloMinutos: number;
  statusConexao: SyncStatus;
  ultimaSincronizacao: string;
  abas: SheetTabMapping[];
}

export interface SyncHistoryLog {
  id: string;
  dataHora: string;
  origem: 'Google Sheets' | 'Arquivo CSV' | 'Webhook Push';
  itensAdicionados: number;
  itensAtualizados: number;
  status: 'SUCESSO' | 'FALHA';
  mensagem: string;
}

// ============================================================================
// 6. INTELIGÊNCIA DE NEGÓCIOS & ANALYTICS
// ============================================================================

export interface FaturamentoDiarioPoint {
  data: string; // "Seg", "Ter", "Qua", etc.
  comprasSucata: number;
  vendasBalcao: number;
  lucroLiquido: number;
}

export interface LucroCategoriaPoint {
  categoria: string;
  valor: number;
  porcentagem: number;
  corHex: string;
}

export interface DashboardAnalyticsData {
  faturamentoSemanal: FaturamentoDiarioPoint[];
  distribuicaoLucro: LucroCategoriaPoint[];
  taxaOcupacaoGalpaoPct: number;
  totalPecasEstoque: number;
  totalVeiculosPatio: number;
  ticketMedioVendas: number;
  margemLucroGeralPct: number;
}

export interface KPIMetricas {
  totalPagoFornecedoresHoje: number;
  totalVendasBalcaoHoje: number;
  totalMetaisPesadosHojeKg: number;
  pecasDisponiveisEstoque: number;
  veiculosEmDesmancheAtivos: number;
  taxaOcupacaoArmazemPct: number;
  saldoIcmsAcumulado: number;
}

export interface ZoneCoordinates {
  id: string;
  nome: string;
  zonaNumero: 1 | 2 | 3;
  corHex: string;
  descricao: string;
  svgPoints: string;
  centroideX: number;
  centroideY: number;
  statusBadge: {
    texto: string;
    tipo: 'normal' | 'alerta' | 'critico';
  };
}

// ============================================================================
// 7. MÓDULO COMERCIAL & VENDAS (PDV, ATACADO, ORÇAMENTOS)
// ============================================================================

export interface ItemCarrinhoPDV {
  peca: PecaEstoque;
  quantidade: number;
  descontoUnitario: number;
  subtotal: number;
}

export interface VendaAtacadoLote {
  id: string;
  dataEmissao: string;
  cliente: ParceiroComercial;
  material: Material;
  pesoLiquidoKg: number;
  precoKg: number;
  valorTotal: number;
  statusEntrega: 'Carregando' | 'Em Trânsito' | 'Entregue Siderúrgica';
  numeroMdfe?: string;
  chaveNfe?: string;
}

export interface OrcamentoOficina {
  id: string;
  dataCriacao: string;
  validadeDias: number;
  oficinaParceira: ParceiroComercial;
  veiculoReferencia: string;
  itens: {
    pecaId: string;
    descricao: string;
    precoOriginal: number;
    precoOrcado: number;
    disponibilidade: 'Em Estoque' | 'A Desmontar';
  }[];
  valorTotal: number;
  status: 'PENDENTE' | 'APROVADO' | 'EXPIRADO' | 'CONVERTIDO_VENDA';
}

// ============================================================================
// 8. MÓDULO FINANCEIRO & CAIXA
// ============================================================================

export type TipoLancamentoFinanceiro = 'ENTRADA' | 'SAIDA';
export type CategoriaDespesa = 
  | 'Compra Sucata Fornecedor'
  | 'Infraestrutura / Servidor VPS'
  | 'Manutenção Equipamentos / Balança'
  | 'Combustível Empilhadeira / Caminhão'
  | 'Despesas Administrativas'
  | 'Taxas DETRAN / Licenças';

export interface LancamentoFluxoCaixa {
  id: string;
  dataHora: string;
  tipo: TipoLancamentoFinanceiro;
  categoria: CategoriaDespesa | string;
  descricao: string;
  valor: number;
  formaPagamento: MetodoLiquidacao;
  referenciaOrigem?: string; // Ex: ID Romaneio ou ID Venda
  saldoAposLancamento: number;
}

export interface ContaPagarReceber {
  id: string;
  tipo: 'PAGAR' | 'RECEBER';
  descricao: string;
  parceiroNome: string;
  dataVencimento: string;
  dataPagamento?: string;
  valor: number;
  status: 'ABERTO' | 'PAGO' | 'VENCIDO' | 'CANCELADO';
  categoria: string;
  documentoFiscalNumero?: string;
}

export interface SocioRepasse {
  id: string;
  nome: string;
  percentualParticipacao: number; // Ex: 50%
  lucroPeriodoBase: number;
  valorProLabore: number;
  despesasReembolsaveis: number;
  valorTotalRepasse: number;
  statusPagamento: 'Pendente' | 'Transferido';
  chavePix: string;
}

// ============================================================================
// 9. CONFORMIDADE AMBIENTAL, AUDITORIA & SEGURANÇA
// ============================================================================

export interface LicencaAmbiental {
  id: string;
  orgaoEmissor: 'CETESB' | 'IBAMA' | 'POLICIA_CIVIL' | 'CORPO_BOMBEIROS';
  titulo: string;
  numeroLicenca: string;
  dataEmissao: string;
  dataVencimento: string;
  diasParaVencer: number;
  status: 'VIGENTE' | 'RENOVACAO_SOLICITADA' | 'VENCIDA';
  documentoPdfUrl?: string;
}

export interface ManifestoDestinacaoResiduo {
  id: string; // Ex: "MTR-2026-081"
  tipoResiduo: 'Óleo Usado Lubrificante (OLUC)' | 'Baterias Chumbo-Ácido' | 'Gás Refrigerante R134a' | 'Fluidos de Freio';
  quantidadeLitrosKg: number;
  transportadorCertificado: string;
  destinadorFinal: string;
  dataColeta: string;
  certificadoDestinacaoNumero: string;
  leiEnquadramento: 'Lei Federal 12.977/2014 & Resolução CONAMA 362/05';
}

export interface UsuarioERP {
  id: string;
  nome: string;
  email: string;
  cargo: 'Administrador' | 'Operador de Pátio' | 'Operador de Balança' | 'Caixa / Comercial' | 'Contador Fiscal';
  status: 'Ativo' | 'Inativo';
  ultimoAcesso: string;
  permissoes: string[];
}


