# Especificação integrada: Sistema de Gestão para Ferro Velho e Auto Desmanche

| Campo | Valor |
| :--- | :--- |
| Formato | Specsfy/2.0 |
| ID | SPEC-2026-0001 |
| Slug | 0001-sistema-gestao-ferro-velho |
| Status | Delivered |
| Effort | 5 |
| Effort updated at | 2026-09-27 |
| Effort rationale | Sistema completo integrando 3 zonas físicas mapeadas por foto (Desmanche, Prateleiras, Balcão), regras complexas de balança eletrônica, precificação de sucatas e controle de autopeças. |
| ClickUp Task | TASK-REC-01 |
| Milestones | M1-Spec, M2-DesignSystem, M3-ScaleAndBalcao, M4-InventoryAndDismantle, M5-Validation |
| Definition Gate | Approved |
| Plan Gate | Approved |
| Delivery Gate | Approved |
| Evidence Contract | 1 |
| Interface para pessoas | Sim (Interface Web Rica e Responsiva) |
| Atualizada em | 2026-09-27 |

---

## Ato I — Definir

### 1. Problema e resultado

#### Problema
Ferros-velhos e centros de desmontagem veicular (CDVs / desmanches) frequentemente operam com processos fragmentados e anotações manuais em papel para pesagem de metais na balança e localização de peças. Isso resulta em erros de pesagem/tara, divergências financeiras no acerto com catadores e fornecedores, perda de rastreabilidade de peças extraídas de veículos baixados e lentidão no atendimento aos clientes no balcão de vendas.

#### Resultado desejado
Um sistema digital integrado, robusto e de alta fidelidade visual com as instalações reais da empresa (mapeadas nas três zonas da foto: `BALCÃO`, `PRATELEIRAS` e `DESMANCHE`), que permita:
1. Automatizar a pesagem com cálculo instantâneo de Peso Líquido, deduções por impureza e precificação de acordo com a cotação diária dos metais (Cobre, Alumínio, Ferro, Latão, etc.);
2. Emitir romaneios e comprovantes de pesagem térmicos profissionais instantaneamente;
3. Gerenciar o fluxo de pagamentos (a fornecedores) e recebimentos (de clientes e indústrias);
4. Rastrear o estoque tridimensional nas estantes físicas (`EST-01` a `EST-08`), permitindo localização imediata da peça pelo atendente;
5. Controlar o fluxo do pátio de desmanche, desde a baixa do veículo e descontaminação até a geração de sucata para pesagem e peças para as prateleiras.

#### Métricas de sucesso
- **SC-001**: Tempo médio de realização de uma pesagem e emissão de comprovante inferior a 45 segundos por fornecedor.
- **SC-002**: Redução a 0% de divergências matemáticas no cálculo de Peso Bruto versus Tara e descontos de impureza.
- **SC-003**: Localização de qualquer autopeça catalogada nas prateleiras em menos de 10 segundos através de busca por veículo/código.
- **SC-004**: Rastreabilidade documental integral de 100% dos veículos desmanchados com suas certidões de baixa e destino das peças.

---

### 2. Research e esclarecimentos

#### Researchs executados
- **R-001**: Mapeamento espacial da fotografia industrial enviada → A foto comprova três divisões operacionais nítidas:
  * Piso azul no térreo frontal: `BALCAO` com 4 postos de atendimento, balança comercial, caixa e vitrine de óleos/aditivos;
  * Piso verde no centro: `PRATELEIRAS` com 8 grandes estantes metálicas organizadas em 4 níveis verticais e corredor central com empilhadeira amarela;
  * Piso laranja no fundo: `DESMANCHE` com dois elevadores hidráulicos de veículos (sedan e SUV), bancadas pesadas e triagem de carcaças.
- **R-002**: Normativa de Desmanche Lei Federal nº 12.977/2014 (Lei do Desmanche) → Exige cadastro prévio da certidão de baixa do DETRAN, descontaminação prévia de fluidos e emissão de comprovante rastreado.

---

### 3. Escopo e atores

#### Incluído
- Terminal de Balança Digital com simulação de pesagem em tempo real (Peso Bruto, Tara, Peso Líquido, Impureza %, Desconto kg, Preço/kg, Subtotal).
- Tabela de classificação dinâmica de materiais (Cobre Mel, Cobre Misto, Alumínio Perfil, Alumínio Bloco, Ferro Sucata Pesada, Latão, Baterias, Inox).
- Emissão e impressão de Romaneio de Pesagem / Comprovante de Pagamento com layout térmico 80mm.
- Cadastro e seleção ágil de Fornecedores e Clientes com documento e placa de veículo.
- Módulo de Liquidação Financeira: Pagar Fornecedor (PIX, Dinheiro) e Receber de Cliente.
- Matriz interativa das 8 Estantes de Prateleiras com visualização por níveis (Kraft, Mecânica, Pesados, Bins).
- Catálogo de Autopeças Usadas com busca por modelo de veículo, código OEM, condição e venda direta para o balcão.
- Monitor de Baias de Desmanche com controle dos veículos em desmontagem e checklist ambiental de descontaminação.
- Mapa Interativo 3D/Planta Baixa digital com visualização ao vivo do galpão industrial da foto.

#### Fora de escopo
- Integração física via porta serial RS-232/USB direta de drivers de balança proprietários (a interface oferece leitura emulada e entrada calibrada).
- Emissão de Nota Fiscal Eletrônica (NF-e/NFC-e) SEFAZ via certificado digital A1 nesta primeira fase (foco no Romaneio/Comprovante Operacional).

#### Atores
- **Operador da Balança / Balconista**: Opera o terminal de pesagem, seleciona materiais, fecha romaneios e realiza vendas de autopeças.
- **Caixa / Gerente Financeiro**: Autoriza pagamentos a fornecedores de sucata (PIX/Espécie) e confere o fechamento do caixa diário.
- **Mecânico / Desmontador**: Opera no pátio de desmanche, executa o checklist de descontaminação e insere peças aproveitáveis no sistema.
- **Operador de Empilhadeira / Estoquista**: Armazena as peças nas prateleiras e retira peças vendidas para entrega no balcão.

---

### 4. Princípios e restrições do projeto
- **PR-001**: Toda pesagem deve registrar data/hora, operador e os dados matemáticos integrais (bruto, tara, líquido, desconto).
- **PR-002**: O sistema deve possuir estética industrial moderna, modo escuro de alto contraste para ambiente de oficina e fidelidade cromática com a foto (#1B4F72 Azul Balcão, #1E7E34 Verde Prateleiras, #D9531E Laranja Desmanche).
- **PR-003**: Nenhuma dependência externa pesada deve impedir o funcionamento offline ou em rede local.

---

### 5. Histórias de usuário

#### US-001 — Pesagem Comercial e Emissão de Romaneio no Balcão (P1)
Como **Operador do Balcão**, quero registrar a pesagem de um lote de materiais trazidos por um fornecedor (ex: Cobre e Alumínio), aplicando tara e eventuais descontos de impureza, para emitir o romaneio de pesagem com o valor total devido.
- **Por que P1**: É a atividade central de faturamento e aquisição de matéria-prima do ferro-velho.
- **Teste independente**: Adicionar 15.5 kg de Cobre Mel com tara 0.5 kg e impureza 0% a R$ 42,00/kg; o sistema deve calcular 15.0 kg líquidos e total de R$ 630,00, gerando o romaneio impresso.
- **Requisitos**: FR-001, FR-002, FR-003, FR-004.

#### US-002 — Liquidação Financeira: Pagar Fornecedor / Receber Cliente (P1)
Como **Caixa**, quero liquidar o romaneio de pesagem efetuando o pagamento ao fornecedor via PIX imediato com geração de comprovante assinado, para garantir segurança jurídica e rapidez.
- **Por que P1**: Evita filas e conflitos no balcão de pagamento.
- **Requisitos**: FR-005, FR-006.

#### US-003 — Localização e Consulta de Peças nas Prateleiras (P2)
Como **Balconista**, quero pesquisar uma peça solicitada pelo cliente (ex: "Disco de Freio Jeep Compass") e identificar imediatamente em qual estante e nível ela está armazenada, para que o operador de empilhadeira possa retirá-la.
- **Por que P2**: Maximiza as vendas de autopeças e reduz o tempo de espera do cliente.
- **Requisitos**: FR-007, FR-008.

#### US-004 — Entrada de Veículo para Desmanche e Descontaminação (P2)
Como **Mecânico do Desmanche**, quero registrar um veículo que chegou ao pátio, preencher o checklist de descontaminação e destinar as peças extraídas para as prateleiras e a sucata para a balança.
- **Por que P2**: Cumpre exigências legais e alimenta o estoque de peças e metais.
- **Requisitos**: FR-009, FR-010.

---

### 6. Cenários BDD de aceite

#### AC-001 — Pesagem de Metal com Desconto de Tara e Impureza
**Cobre**: US-001, FR-001, FR-002, FR-003

```gherkin
@US-001 @FR-001 @FR-002 @AC-001
Feature: Cálculo de Pesagem no Balcão Comercial

  Scenario: Catador entrega 25.8 kg de Alumínio Perfil com tara de balde de 1.8 kg e 2% de impureza
    Given que o operador selecionou o material "Alumínio Perfil" com preço de R$ 11,50/kg
    When informa o Peso Bruto de 25.80 kg e a Tara de 1.80 kg
    And define o desconto de impureza em 2.0%
    Then o Peso Líquido Inicial calculado deve ser 24.00 kg
    And o Peso Faturado Final deve ser 23.52 kg
    And o Subtotal calculado deve ser R$ 270,48
```

#### AC-002 — Validação de Invariante de Tara Maior que Peso Bruto
**Cobre**: US-001, FR-001

```gherkin
@US-001 @FR-001 @AC-002
Feature: Proteção contra Inversão de Pesagem

  Scenario: Operador digita tara superior ao peso bruto por engano
    Given que a balança registra Peso Bruto de 10.00 kg
    When o operador tenta definir a Tara como 12.00 kg
    Then o sistema bloqueia a confirmação do item
    And exibe alerta visual "A Tara não pode exceder o Peso Bruto"
```

#### AC-003 — Impressão do Comprovante de Romaneio com QR Code PIX
**Cobre**: US-001, US-002, FR-004, FR-006

```gherkin
@US-001 @US-002 @FR-004 @FR-006 @AC-003
Feature: Emissão de Recibo Operacional Térmico

  Scenario: Fechamento de Romaneio de Compra
    Given que o romaneio contém 2 itens totalizando R$ 1.450,00
    And o fornecedor "João Carlos da Silva - CPF 123.456.789-00" foi selecionado
    When o caixa clica em "Pagar com PIX"
    Then o sistema registra a transação como "Pago"
    And abre a visualização do Recibo Térmico com dados da empresa, itens e assinatura
```

---

### 7. Requisitos

#### Funcionais
- **FR-001**: O sistema deve permitir a leitura contínua ou inserção manual do Peso Bruto em kg com duas casas decimais.
- **FR-002**: O sistema deve permitir tarar a balança (subtração da tara do recipiente ou caçamba) e calcular o Peso Líquido automaticamente.
- **FR-003**: O sistema deve permitir aplicar descontos percentuais ou fixos em kg por impurezas do material.
- **FR-004**: O sistema deve manter uma tabela de cotação diária de materiais (Cobre, Alumínio, Ferro, Latão, etc.) com preço de compra e preço de venda por kg.
- **FR-005**: O sistema deve permitir adicionar múltiplos itens em um mesmo Romaneio de Pesagem para um mesmo parceiro.
- **FR-006**: O sistema deve gerar comprovante/romaneio em formato de cupom térmico e permitir impressão direta.
- **FR-007**: O sistema deve permitir pesquisar autopeças por nome, categoria, veículo de origem, código OEM ou prateleira.
- **FR-008**: O sistema deve mapear visualmente as 8 estantes industriais (`EST-01` a `EST-08`) e seus 4 níveis verticais.
- **FR-009**: O sistema deve permitir registrar veículos de entrada para desmanche com dados cadastrais e certidão de baixa.
- **FR-010**: O sistema deve exigir checklist de descontaminação de fluidos antes da liberação do desmanche de peças.
- **FR-011**: O sistema deve permitir transformar componentes desmanchados em peças para prateleiras ou em sucata metálica para pesagem.
- **FR-012**: O sistema deve manter registro das transações financeiras (Entradas de Vendas e Saídas de Compras).
- **FR-013**: O sistema deve exibir a planta industrial interativa com navegação rápida entre `BALCÃO`, `PRATELEIRAS` e `DESMANCHE`.

#### Não funcionais
- **NFR-001**: Tempo de resposta em qualquer cálculo ou filtro de pesquisa inferior a 100ms.
- **NFR-002**: Interface visual em alto padrão estético (Industrial Dark Mode, acentos em azul, verde e laranja correspondentes ao piso do galpão).
- **NFR-003**: Execução em qualquer navegador moderno sem necessidade de plugins proprietários.

---

## Ato II — Projetar e Provar

### 8. Plano técnico e Arquitetura

```text
paulinho-gestao/
├── spec/
│   ├── features.md
│   ├── layout_mapping.md
│   ├── data_model.md
│   └── tasks.md
├── specs/
│   └── defined/
│       └── 0001-sistema-gestao-ferro-velho/
│           └── spec.md
├── data/
│   └── db.json (Banco de dados inicial com sucatas, veículos e estoque)
├── public/
│   ├── layout.png (Foto oficial do galpão)
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css (Design tokens)
│   │   ├── components.css (Cards, botões, modais, balança)
│   │   └── main.css
│   └── js/
│       ├── state.js (Gestão reativa de estado da aplicação)
│       ├── api.js (Comunicação com backend REST)
│       ├── balcao.js (Terminal de balança e romaneios)
│       ├── prateleiras.js (Visualizador de estantes e catálogo)
│       ├── desmanche.js (Baias de desmontagem e descontaminação)
│       ├── floorplan.js (Planta interativa do galpão)
│       └── app.js (Orquestrador da UI e inicializador)
├── server.py (Servidor REST nativo Python 3.14 de alta performance)
└── index.html (Aplicação SPA industrial com visual moderno e rico)
```

---

## Ato III — Entregar e Validar

### 11. Plano de Testes & Evidências
- **T-001**: Teste da lógica matemática de pesagem (bruto, tara, impureza, subtotal).
- **T-002**: Teste de persistência de romaneios no banco de dados local.
- **T-003**: Teste de baixa de estoque nas prateleiras ao realizar venda de balcão.
- **T-004**: Teste de integridade visual e responsividade das três zonas (Desmanche, Prateleiras, Balcão).
