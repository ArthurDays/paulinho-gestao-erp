import {
  Material,
  ParceiroComercial,
  VeiculoDesmanche,
  Estante,
  PecaEstoque,
  LancamentoFluxoCaixa,
  ContaPagarReceber,
  SocioRepasse,
  LicencaAmbiental,
  ManifestoDestinacaoResiduo,
  VendaAtacadoLote,
  OrcamentoOficina,
  UsuarioERP,
  KPIMetricas,
  DashboardAnalyticsData
} from '../types/erp';

export const MATERIAIS_MOCK: Material[] = [
  { id: 'MT-COB-01', nome: 'Cobre Mel (Fio Limpo 1ª)', categoria: 'Cobre', precoCompraKg: 42.0, precoVendaKg: 48.5, toleranciaImpurezaPct: 2.0, corHex: '#ef4444', icone: 'fa-bolt', descricao: 'Fios elétricos desencapados, brilhantes, sem queima.' },
  { id: 'MT-COB-02', nome: 'Cobre Misto / Queimado', categoria: 'Cobre', precoCompraKg: 36.5, precoVendaKg: 42.0, toleranciaImpurezaPct: 5.0, corHex: '#dc2626', icone: 'fa-fire', descricao: 'Tubos soldados, induzidos de motor, chicotes queimados.' },
  { id: 'MT-ALU-01', nome: 'Alumínio Perfil Limpo', categoria: 'Aluminio', precoCompraKg: 11.5, precoVendaKg: 14.0, toleranciaImpurezaPct: 2.0, corHex: '#38bdf8', icone: 'fa-border-all', descricao: 'Esquadrias, perfis de cortina de carroceria, sem ferro.' },
  { id: 'MT-ALU-02', nome: 'Alumínio Estamparia / Chaparia', categoria: 'Aluminio', precoCompraKg: 9.2, precoVendaKg: 11.8, toleranciaImpurezaPct: 4.0, corHex: '#0284c7', icone: 'fa-shapes', descricao: 'Chapas automotivas, panelas sem alça, recortes limpos.' },
  { id: 'MT-FER-01', nome: 'Ferro Sucata Pesada (Chapas/Vigas)', categoria: 'Ferro', precoCompraKg: 1.2, precoVendaKg: 1.65, toleranciaImpurezaPct: 5.0, corHex: '#64748b', icone: 'fa-weight-hanging', descricao: 'Chassis de caminhão, vigas I, eixos maciços acima de 4mm.' },
  { id: 'MT-FER-02', nome: 'Ferro Fundido (Tambores/Discos)', categoria: 'Ferro', precoCompraKg: 1.1, precoVendaKg: 1.5, toleranciaImpurezaPct: 4.0, corHex: '#475569', icone: 'fa-circle-notch', descricao: 'Discos de freio trincados, blocos de motor de ferro.' },
  { id: 'MT-BAT-01', nome: 'Bateria Chumbo-Ácido Automotiva', categoria: 'Baterias', precoCompraKg: 4.8, precoVendaKg: 6.2, toleranciaImpurezaPct: 0.0, corHex: '#a855f7', icone: 'fa-car-battery', descricao: 'Baterias automotivas seladas de 45Ah a 180Ah íntegras.' },
  { id: 'MT-LAT-01', nome: 'Latão Amarelo / Conexões / Buchas', categoria: 'Latao', precoCompraKg: 26.0, precoVendaKg: 30.5, toleranciaImpurezaPct: 3.0, corHex: '#eab308', icone: 'fa-gem', descricao: 'Torneiras, conexões hidráulicas, buchas de suspensão.' }
];

export const PARCEIROS_MOCK: ParceiroComercial[] = [
  { id: 'PAR-001', tipo: 'FORNECEDOR', nome: 'Sebastião da Silva (Tião da Carreta)', documento: '512.839.108-44', telefone: '(11) 98765-4321', chavePix: '11987654321', placaVeiculo: 'BTZ-9012', categoria: 'Catador Autônomo' },
  { id: 'PAR-002', tipo: 'AMBOS', nome: 'Auto Mecânica & Funilaria São Jorge Ltda', documento: '14.283.910/0001-55', telefone: '(11) 3456-7890', chavePix: 'financeiro@mecanicasaojorge.com.br', placaVeiculo: 'BRA2E19', categoria: 'Oficina Credenciada' },
  { id: 'PAR-003', tipo: 'FORNECEDOR', nome: 'Marcos Vinicius de Oliveira', documento: '382.190.472-00', telefone: '(11) 99123-8877', chavePix: 'marcos.metais@gmail.com', placaVeiculo: 'EVM-4567', categoria: 'Comerciante de Sucata' },
  { id: 'PAR-004', tipo: 'CLIENTE', nome: 'Siderúrgica & Fundição AçoForte S/A', documento: '03.921.847/0001-90', telefone: '(19) 3211-5000', chavePix: '03921847000190', placaVeiculo: 'FXT-8899', categoria: 'Indústria Siderúrgica' },
  { id: 'PAR-005', tipo: 'CLIENTE', nome: 'Carlos Eduardo Mendonça (Cliente Balcão)', documento: '421.789.012-33', telefone: '(11) 97412-3322', chavePix: 'carlos.edu@hotmail.com', placaVeiculo: 'RJK-8B15', categoria: 'Consumidor Final' }
];

export const ESTANTES_MOCK: Estante[] = [
  { id: 'EST-01', ala: 'Esquerda', posicaoCorredor: 4, titulo: 'Freios, Discos & Pinças', capacidadeMaxItens: 40, ocupacaoItens: 31, icone: 'fa-disc', niveis: [] },
  { id: 'EST-02', ala: 'Esquerda', posicaoCorredor: 3, titulo: 'Suspensão, Molas & Amortecedores', capacidadeMaxItens: 40, ocupacaoItens: 28, icone: 'fa-cogs', niveis: [] },
  { id: 'EST-03', ala: 'Esquerda', posicaoCorredor: 2, titulo: 'Motor, Cabeçotes & Pistões', capacidadeMaxItens: 40, ocupacaoItens: 35, icone: 'fa-wrench', niveis: [] },
  { id: 'EST-04', ala: 'Esquerda', posicaoCorredor: 1, titulo: 'Caixas Kraft & Acessórios Leves', capacidadeMaxItens: 50, ocupacaoItens: 44, icone: 'fa-box', niveis: [] },
  { id: 'EST-05', ala: 'Direita', posicaoCorredor: 4, titulo: 'Rodas de Liga, Pneus & Bins', capacidadeMaxItens: 40, ocupacaoItens: 29, icone: 'fa-life-ring', niveis: [] },
  { id: 'EST-06', ala: 'Direita', posicaoCorredor: 3, titulo: 'Bins Azuis & Peças Médias', capacidadeMaxItens: 50, ocupacaoItens: 41, icone: 'fa-archive', niveis: [] },
  { id: 'EST-07', ala: 'Direita', posicaoCorredor: 2, titulo: 'Alternadores & Motores de Partida', capacidadeMaxItens: 40, ocupacaoItens: 26, icone: 'fa-bolt', niveis: [] },
  { id: 'EST-08', ala: 'Direita', posicaoCorredor: 1, titulo: 'Chicotes Elétricos & Módulos ECU', capacidadeMaxItens: 50, ocupacaoItens: 39, icone: 'fa-microchip', niveis: [] }
];

export const VEICULOS_MOCK: VeiculoDesmanche[] = [
  {
    id: 'VD-001',
    marcaModelo: 'Volkswagen Jetta TSI 2.0 Preto',
    ano: 2019,
    placa: 'GHT-4J82',
    chassi: '9BWKB41K9KM089211',
    renavam: '01129482710',
    certidaoBaixaDetran: 'DETRAN-SP/BAIXA-2026-9812',
    baiaId: 'BAIA-01',
    baiaNome: 'Baia 1 (Elevador Esquerdo)',
    status: 'Em Desmontagem',
    progressoPct: 85,
    descontaminado: true,
    fluidosDrenados: { oleoMotorLitros: 4.5, oleoCambioLitros: 6.0, fluidoArrefecimentoLitros: 7.0, fluidoFreioLitros: 0.8, bateriaChumboRemovida: true, gasRefrigeranteRecolhido: true },
    fotoTag: 'Sedan Preto da foto',
    pecasGeradasQtd: 13,
    sucataGeradaKg: 420.0,
    dataEntrada: '2026-09-20'
  },
  {
    id: 'VD-002',
    marcaModelo: 'Jeep Compass Longitude 2.0 Flex Prata',
    ano: 2021,
    placa: 'RJK-8B15',
    chassi: '9886FB218MK209144',
    renavam: '01239847192',
    certidaoBaixaDetran: 'DETRAN-SP/BAIXA-2026-4431',
    baiaId: 'BAIA-02',
    baiaNome: 'Baia 2 (Elevador Direito)',
    status: 'Em Desmontagem',
    progressoPct: 45,
    descontaminado: true,
    fluidosDrenados: { oleoMotorLitros: 4.8, oleoCambioLitros: 5.5, fluidoArrefecimentoLitros: 6.5, fluidoFreioLitros: 0.9, bateriaChumboRemovida: true, gasRefrigeranteRecolhido: true },
    fotoTag: 'SUV Prata da foto',
    pecasGeradasQtd: 8,
    sucataGeradaKg: 310.0,
    dataEntrada: '2026-09-24'
  }
];

export const PECAS_MOCK: PecaEstoque[] = [
  { id: 'PC-2026-001', codigoOem: '1K0615301AA', descricao: 'Par de Discos de Freio Ventilados Dianteiros', categoria: 'Freios', veiculoOrigem: 'Volkswagen Jetta TSI 2.0 (VD-001)', estanteId: 'EST-01', nivel: 2, posicaoRack: 'N2-P04', condicao: 'Grau A - Excelente', precoCusto: 180.0, precoVenda: 480.0, quantidadeEstoque: 2, estoqueMinimo: 1, status: 'Disponível', codigoBarrasQr: 'QR-001', dataEntrada: '2026-09-22' },
  { id: 'PC-2026-002', codigoOem: '1K0615423J', descricao: 'Pinça de Freio Traseira Esquerda c/ Atuador', categoria: 'Freios', veiculoOrigem: 'Volkswagen Jetta TSI 2.0 (VD-001)', estanteId: 'EST-01', nivel: 2, posicaoRack: 'N2-P08', condicao: 'Grau A - Excelente', precoCusto: 110.0, precoVenda: 320.0, quantidadeEstoque: 1, estoqueMinimo: 1, status: 'Disponível', codigoBarrasQr: 'QR-002', dataEntrada: '2026-09-22' },
  { id: 'PC-2026-003', codigoOem: '5Q0413029', descricao: 'Amortecedor Dianteiro Pressurizado Gas', categoria: 'Suspensão', veiculoOrigem: 'Volkswagen Jetta TSI 2.0 (VD-001)', estanteId: 'EST-02', nivel: 3, posicaoRack: 'N3-P02', condicao: 'Grau A - Excelente', precoCusto: 95.0, precoVenda: 290.0, quantidadeEstoque: 4, estoqueMinimo: 2, status: 'Disponível', codigoBarrasQr: 'QR-003', dataEntrada: '2026-09-23' },
  { id: 'PC-2026-004', codigoOem: '06K903023', descricao: 'Alternador Bosch 140A 14V', categoria: 'Elétrica', veiculoOrigem: 'Volkswagen Jetta TSI 2.0 (VD-001)', estanteId: 'EST-07', nivel: 2, posicaoRack: 'N2-P01', condicao: 'Grau A - Excelente', precoCusto: 210.0, precoVenda: 650.0, quantidadeEstoque: 1, estoqueMinimo: 1, status: 'Disponível', codigoBarrasQr: 'QR-004', dataEntrada: '2026-09-23' },
  { id: 'PC-2026-005', codigoOem: '51984201', descricao: 'Módulo de Injeção Eletrônica Magneti Marelli', categoria: 'Elétrica', veiculoOrigem: 'Jeep Compass 2.0 Flex (VD-002)', estanteId: 'EST-08', nivel: 4, posicaoRack: 'N4-P11', condicao: 'Grau A - Excelente', precoCusto: 320.0, precoVenda: 980.0, quantidadeEstoque: 1, estoqueMinimo: 1, status: 'Disponível', codigoBarrasQr: 'QR-005', dataEntrada: '2026-09-25' },
  { id: 'PC-2026-006', codigoOem: '68249821AA', descricao: 'Compressor de Ar Condicionado Denso', categoria: 'Motor', veiculoOrigem: 'Jeep Compass 2.0 Flex (VD-002)', estanteId: 'EST-03', nivel: 2, posicaoRack: 'N2-P05', condicao: 'Grau B - Bom Estado', precoCusto: 240.0, precoVenda: 750.0, quantidadeEstoque: 1, estoqueMinimo: 1, status: 'Disponível', codigoBarrasQr: 'QR-006', dataEntrada: '2026-09-25' },
  { id: 'PC-2026-007', codigoOem: '5209812-RD', descricao: 'Jogo de Rodas Liga Leve Aro 18 Original Compass', categoria: 'Rodas', veiculoOrigem: 'Jeep Compass 2.0 Flex (VD-002)', estanteId: 'EST-05', nivel: 1, posicaoRack: 'N1-P01', condicao: 'Grau A - Excelente', precoCusto: 600.0, precoVenda: 1850.0, quantidadeEstoque: 1, estoqueMinimo: 1, status: 'Disponível', codigoBarrasQr: 'QR-007', dataEntrada: '2026-09-26' }
];

export const FLUXO_CAIXA_MOCK: LancamentoFluxoCaixa[] = [
  { id: 'LAN-2026-101', dataHora: '27/09/2026 18:45', tipo: 'ENTRADA', categoria: 'Venda Balcão', descricao: 'Venda Alternador Jetta (PC-2026-004) - Cliente Carlos Eduardo', valor: 650.0, formaPagamento: 'PIX', saldoAposLancamento: 48250.80 },
  { id: 'LAN-2026-102', dataHora: '27/09/2026 17:15', tipo: 'SAIDA', categoria: 'Compra Sucata Fornecedor', descricao: 'Romaneio #ROM-089 (50.5 kg Cobre Mel) - Fornecedor Sebastião da Silva', valor: 2121.0, formaPagamento: 'PIX', saldoAposLancamento: 47600.80 },
  { id: 'LAN-2026-103', dataHora: '27/09/2026 15:30', tipo: 'SAIDA', categoria: 'Infraestrutura / Servidor VPS', descricao: 'Mensalidade VPS Cloud Hostinger & Backup Automático', valor: 149.90, formaPagamento: 'CARTAO', saldoAposLancamento: 49721.80 },
  { id: 'LAN-2026-104', dataHora: '27/09/2026 14:10', tipo: 'ENTRADA', categoria: 'Venda Balcão', descricao: 'Venda Par de Discos Ventilados Jetta - Mecânica São Jorge', valor: 480.0, formaPagamento: 'PIX', saldoAposLancamento: 49871.70 },
  { id: 'LAN-2026-105', dataHora: '27/09/2026 11:20', tipo: 'SAIDA', categoria: 'Combustível Empilhadeira / Caminhão', descricao: 'Abastecimento GLP Empilhadeira e Diesel Caminhão Caçamba', valor: 420.0, formaPagamento: 'DINHEIRO', saldoAposLancamento: 49391.70 },
  { id: 'LAN-2026-106', dataHora: '27/09/2026 09:05', tipo: 'ENTRADA', categoria: 'Venda Atacado Lote', descricao: 'Adiantamento Faturamento 12 Toneladas Sucata Pesada - AçoForte S/A', valor: 14400.0, formaPagamento: 'TRANSFERENCIA', saldoAposLancamento: 49811.70 }
];

export const CONTAS_PAGAR_RECEBER_MOCK: ContaPagarReceber[] = [
  { id: 'CPR-001', tipo: 'PAGAR', descricao: 'Taxa Anual de Vistoria CETESB & Licença de Operação', parceiroNome: 'CETESB - Agência Ambiental', dataVencimento: '10/10/2026', valor: 1850.0, status: 'ABERTO', categoria: 'Taxas / Licenças' },
  { id: 'CPR-002', tipo: 'RECEBER', descricao: 'Saldo Lote 12 Toneladas Sucata Pesada NF-e #1428', parceiroNome: 'Siderúrgica & Fundição AçoForte S/A', dataVencimento: '05/10/2026', valor: 5400.0, status: 'ABERTO', categoria: 'Venda Atacado', documentoFiscalNumero: 'NFE-1428' },
  { id: 'CPR-003', tipo: 'PAGAR', descricao: 'Manutenção Preventiva Elevador Hidráulico Baia 1', parceiroNome: 'Hidráulica & Pistões Paulista', dataVencimento: '02/10/2026', valor: 780.0, status: 'ABERTO', categoria: 'Manutenção Pátio' },
  { id: 'CPR-004', tipo: 'PAGAR', descricao: 'Certidões de Baixa DETRAN 3x Veículos Admitidos', parceiroNome: 'DETRAN-SP / Despachante Credenciado', dataVencimento: '28/09/2026', dataPagamento: '27/09/2026', valor: 450.0, status: 'PAGO', categoria: 'Taxas DETRAN' }
];

export const SOCIOS_REPASSE_MOCK: SocioRepasse[] = [
  { id: 'SOC-01', nome: 'Paulo César (Paulinho)', percentualParticipacao: 60, lucroPeriodoBase: 38400.0, valorProLabore: 6500.0, despesasReembolsaveis: 420.0, valorTotalRepasse: 23460.0, statusPagamento: 'Pendente', chavePix: 'paulinho.reciclagem@gmail.com' },
  { id: 'SOC-02', nome: 'Marcelo Oliveira (Sócio Operacional)', percentualParticipacao: 40, lucroPeriodoBase: 38400.0, valorProLabore: 5000.0, despesasReembolsaveis: 180.0, valorTotalRepasse: 15540.0, statusPagamento: 'Pendente', chavePix: 'marcelo.gestao@gmail.com' }
];

export const LICENCAS_MOCK: LicencaAmbiental[] = [
  { id: 'LIC-01', orgaoEmissor: 'CETESB', titulo: 'Licença de Operação (LO) - Triagem e Desmanche de Veículos', numeroLicenca: 'CETESB-LO/2025-9814', dataEmissao: '15/03/2025', dataVencimento: '15/03/2027', diasParaVencer: 534, status: 'VIGENTE' },
  { id: 'LIC-02', orgaoEmissor: 'IBAMA', titulo: 'Certificado de Registro Técnico Federal (CTF/APP)', numeroLicenca: 'CTF-IBAMA/7482910', dataEmissao: '01/01/2026', dataVencimento: '31/12/2026', diasParaVencer: 95, status: 'VIGENTE' },
  { id: 'LIC-03', orgaoEmissor: 'POLICIA_CIVIL', titulo: 'Credenciamento DETRAN/Polícia Civil - Lei do Desmonte 12.977', numeroLicenca: 'DETRAN-CDV/SP-0042', dataEmissao: '10/05/2024', dataVencimento: '10/05/2027', diasParaVencer: 590, status: 'VIGENTE' },
  { id: 'LIC-04', orgaoEmissor: 'CORPO_BOMBEIROS', titulo: 'Auto de Vistoria do Corpo de Bombeiros (AVCB)', numeroLicenca: 'AVCB-SP-2025-1192', dataEmissao: '20/08/2025', dataVencimento: '20/08/2026', diasParaVencer: -38, status: 'RENOVACAO_SOLICITADA' }
];

export const MANIFESTOS_RESIDUOS_MOCK: ManifestoDestinacaoResiduo[] = [
  { id: 'MTR-2026-081', tipoResiduo: 'Óleo Usado Lubrificante (OLUC)', quantidadeLitrosKg: 450, transportadorCertificado: 'Lwart Lubrificantes Coleta Autorizada', destinadorFinal: 'Rerrefino Lwart Indústria', dataColeta: '22/09/2026', certificadoDestinacaoNumero: 'CERT-LWART-2026-8812', leiEnquadramento: 'Lei Federal 12.977/2014 & Resolução CONAMA 362/05' },
  { id: 'MTR-2026-082', tipoResiduo: 'Baterias Chumbo-Ácido', quantidadeLitrosKg: 620, transportadorCertificado: 'Moura Reciclagem Ambiental', destinadorFinal: 'Acumuladores Moura S/A', dataColeta: '25/09/2026', certificadoDestinacaoNumero: 'CERT-MOURA-2026-3310', leiEnquadramento: 'Lei Federal 12.977/2014 & Resolução CONAMA 362/05' }
];

export const VENDAS_ATACADO_MOCK: VendaAtacadoLote[] = [
  { id: 'ATC-2026-041', dataEmissao: '27/09/2026', cliente: PARCEIROS_MOCK[3], material: MATERIAIS_MOCK[4], pesoLiquidoKg: 12450.0, precoKg: 1.65, valorTotal: 20542.50, statusEntrega: 'Em Trânsito', numeroMdfe: 'MDF-SP-2026-00441', chaveNfe: '35260903921847000190550010000014281298410291' },
  { id: 'ATC-2026-040', dataEmissao: '24/09/2026', cliente: PARCEIROS_MOCK[3], material: MATERIAIS_MOCK[0], pesoLiquidoKg: 1820.0, precoKg: 48.50, valorTotal: 88270.00, statusEntrega: 'Entregue Siderúrgica', numeroMdfe: 'MDF-SP-2026-00438', chaveNfe: '35260903921847000190550010000014251298410882' }
];

export const ORCAMENTOS_MOCK: OrcamentoOficina[] = [
  { id: 'ORC-2026-088', dataCriacao: '27/09/2026', validadeDias: 5, oficinaParceira: PARCEIROS_MOCK[1], veiculoReferencia: 'Volkswagen Jetta TSI 2019', itens: [{ pecaId: 'PC-2026-001', descricao: 'Par Discos de Freio Ventilados', precoOriginal: 480.0, precoOrcado: 430.0, disponibilidade: 'Em Estoque' }, { pecaId: 'PC-2026-004', descricao: 'Alternador Bosch 140A', precoOriginal: 650.0, precoOrcado: 590.0, disponibilidade: 'Em Estoque' }], valorTotal: 1020.0, status: 'PENDENTE' },
  { id: 'ORC-2026-087', dataCriacao: '26/09/2026', validadeDias: 3, oficinaParceira: PARCEIROS_MOCK[1], veiculoReferencia: 'Jeep Compass Longitude 2021', itens: [{ pecaId: 'PC-2026-005', descricao: 'Módulo Injeção Eletrônica', precoOriginal: 980.0, precoOrcado: 900.0, disponibilidade: 'Em Estoque' }], valorTotal: 900.0, status: 'APROVADO' }
];

export const USUARIOS_MOCK: UsuarioERP[] = [
  { id: 'USR-01', nome: 'Paulo César', email: 'paulinho@paulinhogestao.com.br', cargo: 'Administrador', status: 'Ativo', ultimoAcesso: 'Agora mesmo', permissoes: ['ALL_PERMISSIONS'] },
  { id: 'USR-02', nome: 'Marcelo Oliveira', email: 'marcelo@paulinhogestao.com.br', cargo: 'Caixa / Comercial', status: 'Ativo', ultimoAcesso: 'Há 15 minutos', permissoes: ['PDV_ACCESS', 'BALANCA_ACCESS', 'ESTOQUE_VIEW'] },
  { id: 'USR-03', nome: 'Cláudio Ferreira (Balança)', email: 'claudio@paulinhogestao.com.br', cargo: 'Operador de Balança', status: 'Ativo', ultimoAcesso: 'Há 5 minutos', permissoes: ['BALANCA_WEIGH', 'ROMANEIO_PRINT'] },
  { id: 'USR-04', nome: 'Rodrigo Antunes (Mecânico Chefe)', email: 'rodrigo@paulinhogestao.com.br', cargo: 'Operador de Pátio', status: 'Ativo', ultimoAcesso: 'Há 1 hora', permissoes: ['DESMANCHE_UPDATE', 'TRIAGEM_EXECUTE'] }
];

export const KPI_METRICAS_MOCK: KPIMetricas = {
  totalPagoFornecedoresHoje: 2130.80,
  totalVendasBalcaoHoje: 1840.00,
  totalMetaisPesadosHojeKg: 1450.5,
  pecasDisponiveisEstoque: 8,
  veiculosEmDesmancheAtivos: 2,
  taxaOcupacaoArmazemPct: 78.4,
  saldoIcmsAcumulado: 4120.30
};

export const ANALYTICS_DATA_MOCK: DashboardAnalyticsData = {
  faturamentoSemanal: [
    { data: 'Seg', comprasSucata: 3200, vendasBalcao: 4500, lucroLiquido: 1300 },
    { data: 'Ter', comprasSucata: 2800, vendasBalcao: 5100, lucroLiquido: 2300 },
    { data: 'Qua', comprasSucata: 4100, vendasBalcao: 6200, lucroLiquido: 2100 },
    { data: 'Qui', comprasSucata: 3500, vendasBalcao: 4800, lucroLiquido: 1300 },
    { data: 'Sex', comprasSucata: 5400, vendasBalcao: 8100, lucroLiquido: 2700 },
    { data: 'Sáb', comprasSucata: 2130, vendasBalcao: 3400, lucroLiquido: 1270 }
  ],
  distribuicaoLucro: [
    { categoria: 'Autopeças Usadas (CDV)', valor: 28400, porcentagem: 58, corHex: '#10b981' },
    { categoria: 'Cobre & Metais Nobres', valor: 12500, porcentagem: 26, corHex: '#f97316' },
    { categoria: 'Ferro & Sucata Pesada', valor: 5200, porcentagem: 11, corHex: '#0284c7' },
    { categoria: 'Baterias & Outros', valor: 2400, porcentagem: 5, corHex: '#a855f7' }
  ],
  taxaOcupacaoGalpaoPct: 78.4,
  totalPecasEstoque: 243,
  totalVeiculosPatio: 7,
  ticketMedioVendas: 485.00,
  margemLucroGeralPct: 34.2
};
