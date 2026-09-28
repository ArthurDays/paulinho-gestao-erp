# Mapeamento e Decomposição de Layout Físico-para-Digital

**Referência**: Imagem de Layout do Galpão (`layout.png`)  
**Metodologia**: SpecKit & Specsfy Visual Decomposition Pattern  
**Aplicação**: Sistema de Gestão para Ferro Velho e Auto Desmanche  
**Data**: 2026-09-27  

---

## 1. Análise Espacial da Fotografia Industrial

A imagem apresenta a planta operacional de um centro avançado de triagem, desmontagem veicular, estocagem e comercialização de sucata e autopeças. O ambiente é dividido em três zonas cromáticas e funcionais contínuas, orientadas do fundo para a frente:

```
+---------------------------------------------------------------+
|                       ZONA 1: DESMANCHE                       |
|   (Piso Terracota/Laranja #D9531E - Mecânica & Triagem Bruta) |
|   - Elevadores automotivos (Sedan preto e SUV prata)         |
|   - Bancada central de ferramentas e desmontagem              |
|   - Separação de metais nobres (Cobre, Alumínio, Catalisador) |
+---------------------------------------------------------------+
|                               |                               |
|                               v Corredor Logístico Empilhadeira
+---------------------------------------------------------------+
|                      ZONA 2: PRATELEIRAS                      |
|   (Piso Verde Industrial #1E7E34 - Armazém Verticalizado)     |
|   - 8 Baterias de estantes industriais pesadas (4 Esq / 4 Dir)|
|   - Caixas Kraft (topo), Peças mecânicas (meio), Bins (base)  |
|   - Linhas amarelas de circulação segura e empilhadeira       |
+---------------------------------------------------------------+
|                               |                               |
|                               v Portas Automáticas "ENTRADA"  |
+---------------------------------------------------------------+
|                        ZONA 3: BALCÃO                         |
|   (Piso Azul Royal #1B4F72 - Atendimento, Caixa & Balança)    |
|   - Balcão linear amadeirado com 4 postos informatizados      |
|   - Vitrine expositora inferior e gôndola de fluidos ao fundo |
|   - Terminal de Pesagem Comercial & Caixa (Pagar / Receber)   |
|   - Faixas amarelas de espera e fluxo de pedestres            |
+---------------------------------------------------------------+
```

---

## 2. Decomposição Tela-a-Tela e Mapeamento de Componentes

### 2.1. ZONA 3 (Inferior Azul) $\rightarrow$ Módulo `BALCÃO & BALANÇA COMERCIAL`
A zona física do **BALCÃO** converte-se no centro operacional de entrada rápida e checkout do sistema.

#### Componentes UI Mapeados da Foto:
1. **`DigitalScaleDisplay` (Display LED da Balança)**:
   - **Origem Física**: Terminal de balança eletrônica no posto de atendimento.
   - **Disposição**: Display proeminente com tipografia digital de alto contraste (verde fosforescente sobre fundo preto/grafite).
   - **Campos**:
     - `Peso Bruto (kg)`: Leitura em tempo real ou input manual calibrado.
     - `Tara (kg)`: Valor do recipiente/veículo com botão rápido de `Tarar Balança (Zero)`.
     - `Peso Líquido (kg)`: Calculado instantaneamente ($PB - T$).
     - `Status da Balança`: Indicador visual de estabilidade de leitura (`Estável`, `Oscilando`, `Zero`).

2. **`MaterialGridSelector` (Matriz Rápida de Classificação de Materiais)**:
   - **Origem Física**: Gôndolas de amostras e classificação de sucata no balcão.
   - **Disposição**: Grid responsivo com cards táteis de cada metal (Cobre Mel, Cobre Misto, Alumínio Perfil, Alumínio Bloco, Ferro Sucata, Latão, Chumbo, Inox, Catalisador).
   - **Propriedades por Card**:
     - Ícone representativo do metal com badge cromático (ex: cobre avermelhado, alumínio prateado, latão dourado).
     - Nome técnico do material e subtipo.
     - Cotação oficial do dia (R$/kg) atualizada dinamicamente.
     - Campo de desconto de impureza (%).

3. **`WeighingSlipTable` (Tabela de Romaneio de Pesagem Multi-Itens)**:
   - **Origem Física**: Prancheta de anotações e teclado de emissão de tickets do atendente.
   - **Colunas**:
     - `#Item` (Sequencial)
     - `Material / Classificação`
     - `Peso Bruto (kg)`
     - `Tara (kg)`
     - `Peso Líquido (kg)`
     - `Desconto Impureza (%)`
     - `Peso Faturado (kg)`
     - `Preço Unitário (R$/kg)`
     - `Subtotal (R$)`
     - `Ações` (Editar, Excluir item)
   - **Rodapé da Tabela**:
     - Total de Quilos Líquidos ($\sum kg$)
     - Descontos Totais ($\sum R\$$)
     - **VALOR TOTAL DA OPERAÇÃO (R$)** em destaque ampliado.

4. **`PartnerSelector` (Seletor de Fornecedor / Cliente)**:
   - **Origem Física**: Cadastro visual do cliente atendido nas banquetas azuis e guichês.
   - **Campos**:
     - Tipo de Operação: `COMPRA (Pagar Fornecedor)` vs `VENDA (Receber de Cliente)`.
     - Busca Inteligente: Nome, Razão Social, CPF/CNPJ, Telefone ou Placa do Veículo.
     - Modal de Cadastro Rápido: Adicionar fornecedor em 10 segundos sem sair da tela.

5. **`PaymentActionBar` (Barra de Ações e Liquidação Financeira)**:
   - **Origem Física**: Gaveta de dinheiro, máquina de cartão e impressora de recibos do balcão.
   - **Botões de Ação**:
     - `Pagar / Receber Imediato` (Abre modal de liquidação com opções PIX, Espécie, Cartão, Boleto).
     - `Imprimir Romaneio / Recibo` (Dispara impressão térmica ou visualização prévia de recibo).
     - `Zerar / Novo Romaneio` (Limpa estado para próximo cliente).
     - `Guardar Pré-Romaneio` (Salva pesagem pendente para finalizar após descarga).

6. **`CounterFluidShowcase` (Vitrine de Venda de Balcão)**:
   - **Origem Física**: Prateleira traseira e vitrine de vidro do balcão com aditivos e óleos.
   - **Função**: Permite adicionar itens de conveniência/insumos ao romaneio ou venda direta.

---

### 2.2. ZONA 2 (Intermediária Verde) $\rightarrow$ Módulo `PRATELEIRAS (ESTOQUE INDUSTRIAL)`
A zona física das **PRATELEIRAS** converte-se no gerenciador de estoque espacial tridimensional e rastreabilidade de autopeças.

#### Componentes UI Mapeados da Foto:
1. **`ShelfWarehouseMatrix` (Visualizador Gráfico das 8 Estantes)**:
   - **Origem Física**: As 8 estantes metálicas pesadas divididas em duas alas (4 à esquerda, 4 à direita) ladeando a pista verde da empilhadeira.
   - **Disposição**: Mapa interativo com cards de cada estante (`EST-01` a `EST-08`), exibindo taxa de ocupação, número de itens cadastrados e alerta de capacidade.
   - **Níveis Visuais por Estante**:
     - `N4 Topo - Caixas Kraft`: Acessórios em caixa e peças leves seladas.
     - `N3 Médio-Alto - Mecânica`: Amortecedores, pinças, cilindros mestre, coletores.
     - `N2 Médio-Baixo - Pesados`: Discos de freio, cubos, molas, engrenagens, mangas de eixo.
     - `N1 Base - Bins & Paletes`: Gaveteiros organizadores azuis/amarelos para ferragens e paletes de rodas/pneus.

2. **`PartCatalogDataGrid` (Tabela de Catalogação de Peças Rastreáveis)**:
   - **Origem Física**: Etiquetas e caixas estocadas nas prateleiras.
   - **Campos**:
     - `Código / Barcode / QR`: Identificador único (ex: `PC-2026-00492`).
     - `Descrição da Peça`: (ex: "Disco de Freio Ventilado Dianteiro").
     - `Veículo de Origem`: Link rastreado para o veículo desmanchado (ex: "Jeep Compass 2021 Prata - Sucata #VD-014").
     - `Localização`: Endereçamento exato (ex: `EST-04 / Nível 2 / Posição 08`).
     - `Condição`: Badge cromático (Grau A - Excelente, Grau B - Bom, Grau C - Retífica).
     - `Preço de Venda (R$)`: Valor comercial para venda no balcão.
     - `Status`: `Disponível`, `Reservado Balcão`, `Vendido`.
     - `Ações`: "Vender no Balcão", "Imprimir Etiqueta Térmica QR", "Editar Localização".

3. **`ForkliftDispatchQueue` (Fila de Movimentação Logística)**:
   - **Origem Física**: A empilhadeira amarela e os paletes de madeira ao longo do corredor.
   - **Função**: Fila de tarefas para reposição de peças vindas do desmanche ou separação para clientes no balcão.

---

### 2.3. ZONA 1 (Superior Laranja) $\rightarrow$ Módulo `DESMANCHE (PÁTIO & VEÍCULOS)`
A zona física de **DESMANCHE** converte-se no controle da linha de desmontagem veicular, descontaminação ambiental e geração primária de estoques e sucata.

#### Componentes UI Mapeados da Foto:
1. **`VehicleBayMonitor` (Monitor dos Postos de Desmanche)**:
   - **Origem Física**: Os dois elevadores hidráulicos com veículos em desmontagem (Sedan preto na Baia 1 e SUV prata na Baia 2).
   - **Componente**: Cards dos postos operacionais:
     - `Baia 1 - Elevador Hidráulico A`: Veículo ativo, modelo, placa, progresso de desmontagem (%).
     - `Baia 2 - Elevador Hidráulico B`: Veículo ativo, modelo, placa, progresso de desmontagem (%).
     - `Bancada de Triagem Central`: Mesa com ferramentas para triagem de chicotes, motores de partida, compressores e desmontagem fina.

2. **`VehicleIntakeForm` (Recepção e Baixa de Veículo)**:
   - **Campos**: Placa, Chassi, RENAVAM, Marca, Modelo, Ano, Cor, Leiloeiro/Origem, Certificado de Baixa DETRAN, Quilometragem estimada.
   - **Checklist de Entrada**: Condições de chegada e integridade mecânica.

3. **`DecontaminationChecklist` (Protocolo de Despoluição Ambiental)**:
   - **Origem Física**: Tanques de contenção e carrinhos de dreno de fluidos visíveis próximos às ferramentas.
   - **Aferições Obrigatórias**:
     - [x] Óleo do motor drenado (Litros aferidos)
     - [x] Óleo do câmbio drenado
     - [x] Líquido de arrefecimento extraído
     - [x] Fluido de freio sangrado
     - [x] Bateria chumbo-ácido removida e enviada à pesagem
     - [x] Gás do ar-condicionado recolhido
     - [x] Cilindro de GNV despressurizado (se aplicável)

4. **`PartHarvestingMatrix` (Bifurcação de Desmonte: Autopeça vs Sucata Metálica)**:
   - **Origem Física**: Peças dispostas ordenadamente no chão laranja ao redor dos veículos para triagem.
   - **Fluxo do Componente**:
     - Peças Reaproveitáveis $\rightarrow$ Seleciona categoria $\rightarrow$ Define preço sugerido $\rightarrow$ Gera etiqueta $\rightarrow$ Direciona para `PRATELEIRAS`.
     - Sucata e Restos Metálicos $\rightarrow$ Seleciona tipo de liga (Ferro pesado, Cobre de chicote, Alumínio de carcaça) $\rightarrow$ Pesa na balança de triagem $\rightarrow$ Integra ao lote de sucata da empresa.

---

## 3. Especificação do Modelo de Componentes (Design System Reutilizável)

De acordo com as diretrizes do SpecKit e do Specsfy, criamos uma hierarquia modular de componentes limpos, robustos e interoperáveis:

| Nome do Componente | Diretório Previsto | Responsabilidade Principal |
| :--- | :--- | :--- |
| `AppShell` | `src/components/layout/AppShell.js` | Estrutura mestre contendo barra superior com status da balança, navegação pelas 3 zonas e métricas de caixa |
| `FacilityFloorplan` | `src/components/layout/FacilityFloorplan.js` | Mini-mapa interativo reproduzindo a visão aérea da foto com hotspots navegáveis para `DESMANCHE`, `PRATELEIRAS` e `BALCAO` |
| `ScaleTerminal` | `src/components/balcao/ScaleTerminal.js` | Balança digital com cálculo em tempo real de bruto, tara, líquido, descontos e totalizador |
| `MaterialPicker` | `src/components/balcao/MaterialPicker.js` | Seletor visual de metais e materiais recicláveis com cotações dinâmicas |
| `WeighingTable` | `src/components/balcao/WeighingTable.js` | Tabela dinâmica de múltiplos itens da pesagem com edição e exclusão |
| `ReceiptModal` | `src/components/balcao/ReceiptModal.js` | Visualizador e impressor de comprovante/romaneio em formato térmico de alta definição |
| `ShelfMatrix` | `src/components/prateleiras/ShelfMatrix.js` | Mapa das 8 estantes industriais com visualização dos 4 níveis e ocupação |
| `InventoryTable` | `src/components/prateleiras/InventoryTable.js` | Grid de peças com busca instantânea, filtro por veículo, código OEM e estado |
| `DismantleBays` | `src/components/desmanche/DismantleBays.js` | Monitor das baias de desmanche, veículos em desmontagem e peças extraídas |
| `VehicleModal` | `src/components/desmanche/VehicleModal.js` | Formulário de entrada de sucata veicular e checklist de descontaminação |
| `DailySummary` | `src/components/relatorios/DailySummary.js` | Painel executivo com kg pesados por metal, volume financeiro pago e recebido |
