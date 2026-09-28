# 🚗 Paulinho Gestão ERP — Hybrid Enterprise Architecture
> **Sistema Integrado de Gestão para Ferro-Velho, Reciclagem de Metais, CDV (Centro de Desmanche Veicular) e Oficina Mecânica**  
> *Arquitetura Híbrida: Unindo a estética SaaS moderna (Bento Grid, Clean UI, Tailwind) com a densidade de dados e profundidade funcional de sistemas ERP desktop de classe enterprise.*

[![Specsfy Suite](https://img.shields.io/badge/Specsfy%20Tests-14%2F14%20PASS-10b981?style=for-the-badge&logo=checkmarx)](specsfy.py)
[![SEFAZ DF](https://img.shields.io/badge/SEFAZ--DF-Schema%20v4.00%20(0ms)-0284c7?style=for-the-badge&logo=shield)](http://localhost:8080)
[![Lei Federal 12.977](https://img.shields.io/badge/Lei%20Federal-12.977%2F2014%20(CDV)-ea580c?style=for-the-badge&logo=gov.uk)](data/db.json)
[![TypeScript & Python](https://img.shields.io/badge/Stack-Python%203%20%2B%20TypeScript%20%2B%20HTML5-3b82f6?style=for-the-badge&logo=python)](server.py)

---

## 📌 Visão Geral do Sistema

O **Paulinho Gestão ERP** foi construído sob medida para atender à operação complexa do **Ferro Velho do Paulinho LTDA** (CNPJ: 44.628.855/0001-37 • Samambaia Norte - DF). A solução consolida em uma única interface responsiva e de alta performance todo o ciclo de vida do pátio:

1. **Recepção e Pesagem Comercial:** Balança digital de metais (Cobre, Alumínio, Latão, Baterias) com cálculo de tara, dedução automática de impurezas e liquidação instantânea via PIX.
2. **Centro de Desmanche Veicular (CDV):** Rastreabilidade total exigida pelo DETRAN (Lei 12.977/2014), checklist de descontaminação ambiental (drenagem de óleo, freio, gás R134a, baterias) e geração de etiquetas térmicas antifurto com QR Code.
3. **Armazém Vertical Inteligente:** 8 baterias de estantes físicas (EST-01 a EST-08) com mapeamento 3D em 4 níveis (N1 a N4) e baixa automática de estoque.
4. **Clientes & Ordens de Serviço (Master-Detail):** Orçamentos de oficina e peças com calculadora lateral em tempo real (produtos, mão de obra, descontos, adiantamentos e total líquido).
5. **Motor de Retorno Preventivo ("Recall"):** Algoritmo que calcula o tempo médio de desgaste de peças trocadas (ex: 60 dias para amortecedores, 6 meses para discos de freio) e dispara contatos de cortesia via WhatsApp em 1 clique.
6. **Financeiro & Fluxo de Caixa Diário:** Visualização em alta densidade com coloração condicional de linhas (verde para entradas, vermelho para despesas), controle de contas a pagar/receber e DRE gerencial para identificar onde o dinheiro está lucrando e onde está vazando.
7. **Suíte Fiscal SEFAZ-DF:** Emissão em tempo real com latência zero de NF-e (Modelo 55 com ICMS diferido Art. 392 RICMS), NFC-e (Modelo 65 com QR Code de balcão), MDF-e com manifesto de transporte e visualizador oficial de DANFE com download de XML assinado.

---

## 🏛️ Diagrama de Arquitetura do Sistema

```mermaid
graph TB
    subgraph CLIENT_LAYER["🖥️ Interface Híbrida do Usuário (Data-Dense & SaaS Bento)"]
        UI_BENTO["Visão Geral Bento Grid<br/>(KPIs, Calendário, IA Assistant)"]
        UI_RIBBON["Desktop Ribbon Menu<br/>(Ações Rápidas, Relatórios, PDF)"]
        UI_TABLES["AdvancedDataTable<br/>(Zebra Striping, Filtros Header)"]
        UI_MODALS["Master-Detail Engine<br/>(O.S. Calculator, DANFE, CDV)"]
        UI_SCANNER["Universal Barcode Listener<br/>(Laser Wedge 150ms Chime)"]
    end

    subgraph ENGINE_LAYER["⚙️ Núcleo de Processamento & Regras de Negócio (Python HTTP Engine)"]
        SRV["server.py (Porta 8080)<br/>Embedded High-Performance HTTP Engine"]
        
        subgraph SERVICES["Serviços Especializados"]
            SCALE_SVC["Módulo de Balança & Pesagem<br/>(Cálculo Líquido & Impurezas)"]
            OS_SVC["OrdemServicoEngine<br/>(Cálculo Peças + Serviços - Descontos)"]
            CDV_SVC["WorkflowDescontaminacao<br/>(Auditoria Lei 12.977 & DETRAN)"]
            RECALL_SVC["RecallPreventivoEngine<br/>(Previsão Retorno & WhatsApp)"]
            DRE_SVC["DRE & Diagnóstico Financeiro<br/>(Margem por Setor & Gargalos)"]
            FISCAL_SVC["FiscalEngine SEFAZ<br/>(Chave 44 Dígitos, XML, DANFE, ICMS Diferido)"]
            SYNC_SVC["SyncEngine System-First<br/>(Fila em Background & CSV Importer)"]
        end
    end

    subgraph STORAGE_LAYER["💾 Persistência & Bancos de Dados"]
        DB_LOCAL[("data/db.json<br/>0ms Latência Local-First")]
        XML_STORE[("Repositório de XMLs Fiscais<br/>Schema v4.00 Assinado")]
        AUDIT_LOG[("Log Permanente de Auditoria<br/>Transações & Romaneios")]
    end

    subgraph EXTERNAL_LAYER["🌐 Integrações Externas & Governança"]
        SEFAZ["SEFAZ-DF & SEFAZ-SP<br/>(Autorização NF-e / NFC-e / MDF-e)"]
        DETRAN["DETRAN-DF<br/>(Certidões de Baixa & QR Antifurto)"]
        WHATSAPP["WhatsApp Cloud API / Web<br/>(Notificações e Recall 1-Clique)"]
        G_SHEETS["Google Sheets / Planilhas Cloud<br/>(Export/Import Assíncrono)"]
        SPECSFY["Specsfy SDD Test Runner<br/>(14 Testes Automatizados)"]
    end

    %% Relações
    CLIENT_LAYER -->|REST API Requests JSON| SRV
    SRV --> SERVICES
    SERVICES -->|Gravação Local Imediata| STORAGE_LAYER
    SYNC_SVC -.->|Fila Assíncrona Background| G_SHEETS
    FISCAL_SVC -->|Transmissão Oficial| SEFAZ
    CDV_SVC -->|Validação Rastreabilidade| DETRAN
    RECALL_SVC -->|Disparo de Mensagens| WHATSAPP
    SRV -.->|Verificação de Integridade| SPECSFY
```

---

## 🔄 Fluxo Operacional Ponta a Ponta

```mermaid
sequenceDiagram
    autonumber
    actor Operador as Operador / Balconista
    participant UI as Interface Paulinho Gestão
    participant Server as server.py (REST)
    participant DB as db.json (Local-First)
    participant SEFAZ as SEFAZ / DETRAN
    actor Cliente as Cliente / Frotista

    Note over Operador, Cliente: 1. Recepção de Veículo & Desmonte CDV
    Operador->>UI: Bipa Entrada do Veículo / Placa
    UI->>Server: POST /api/desmanche/descontaminar
    Server->>DB: Salva Checklist 5 Fluidos (Lei 12.977)
    Server-->>UI: Veículo liberado para Desmonte nas Baias (0ms)

    Note over Operador, Cliente: 2. Estoque Vertical & Triagem
    Operador->>UI: Cadastra Peça Nobre (Ex: Discos Jetta)
    UI->>Server: POST /api/desmanche/triagem (Destino: EST-01)
    Server->>DB: Aloca no Nível N2-P04 e incrementa ocupação
    Server-->>UI: Peça disponível no Balcão e PDV

    Note over Operador, Cliente: 3. Abertura e Execução de Ordem de Serviço
    Operador->>UI: Abre O.S. Master-Detail (Cliente Rodrigo Alencar)
    UI->>UI: Adiciona Discos (R$ 1.020) + Mão de Obra (R$ 450)
    UI->>UI: Calculadora aplica Desconto e calcula Total: R$ 1.470
    Operador->>UI: Clica em "Finalizar O.S."
    UI->>Server: POST /api/ordens-servico/status (FINALIZADA)
    Server->>DB: Dá baixa na peça da EST-01 e lança Contas a Receber
    Server-->>UI: O.S. Faturada com Sucesso

    Note over Operador, Cliente: 4. Emissão Fiscal SEFAZ & DANFE
    Operador->>UI: Clica em "Emitir NF-e (0ms)"
    UI->>Server: POST /api/fiscal/emitir (Mod 55)
    Server->>SEFAZ: Transmite Schema v4.00 com Chave 44 Dígitos
    SEFAZ-->>Server: Protocolo Autorizado
    Server->>DB: Armazena XML e autorização
    Server-->>UI: Abre Modal DANFE com Código de Barras e QR Code

    Note over Operador, Cliente: 5. Motor de Retorno Preventivo (Recall)
    Server->>UI: Sistema detecta prazo de revisão preventiva
    Operador->>UI: Clica em "Chamar no WhatsApp (1-Clique)"
    UI->>Cliente: Envia mensagem personalizada para agendar revisão cortesia
```

---

## 📊 Matriz Funcional dos Módulos

### 1. Visual Density & Data Grids (NODE 1)
- **Componente `AdvancedDataTable`:** Tabelas em formato Data Grid de alta densidade com zebra striping sutil, cabeçalhos ordenáveis e fontes monoespaçadas numéricas.
- **Componente `FooterSummary`:** Barra de rodapé com somatórios automáticos de entradas, despesas, saldos líquidos e totalizadores de itens.
- **Componente `RibbonMenu`:** Barra de ações rápidas superior inspirada em interfaces desktop corporativas (*Adicionar Dinheiro*, *Retirar Dinheiro*, *Novo Cliente*, *Nova O.S.*, *Checklist CDV*, *Relatórios/DRE*, *Salvar PDF*).

### 2. Operações, O.S. e Retorno Preventivo (NODE 2)
- **Engine Master-Detail de O.S.:** Visualização idêntica à referência clássica de oficina. Permite manipular dinamicamente tabelas de serviços e peças, sincronizando com a calculadora lateral (*Total Produtos*, *Total Serviços*, *Descontos R$ e %*, *Adiantamento* e *Total a Pagar*).
- **Checklist CDV:** Conformidade obrigatória com os 5 quesitos da Lei 12.977/2014 (óleo de motor/câmbio, fluído de freio, gás R134a, baterias e combustível).
- **Recall Preventivo Automático:** Identifica o momento exato para convidar o cliente de volta (ex: reaperto de amortecedores aos 60 dias ou inspeção de pastilhas aos 6 meses), gerando o link direto do WhatsApp com mensagem formatada.

### 3. Financeiro & Fluxo de Caixa (NODE 3)
- **Coloração Condicional de Linhas:** Linhas de **Entrada** recebem fundo verde suave (`.row-entrada`), enquanto linhas de **Saída / Despesa** recebem fundo vermelho/coral (`.row-saida`) para leitura imediata do operador.
- **Contas a Receber e a Pagar:** Filtragem por período, formas de pagamento (PIX, Boleto, Cartão, Dinheiro) e situação (Abertas, Baixadas, Vencidas com alerta de juros).
- **DRE: Qual Serviço Lucra Mais?**
  - Peças Usadas CDV: **64,1%** de margem líquida.
  - Mão de Obra de Oficina: **78,1%** de margem líquida.
  - Sucatas de Balança: **14,8%** a **27,2%** de margem.
- **Diagnóstico: Onde Está Vazando Dinheiro?**
  - Perda por vazamento no maçarico de oxicorte (**-R$ 1.450/mês**).
  - Oxidação de lataria exposta à chuva (**-R$ 820/mês**).
  - Juros por atraso em boletos bancários (**-R$ 340/mês**).
  - Peças paradas há mais de 180 dias (**-R$ 3.800 imobilizado**).

### 4. Busca Universal & Performance (NODE 4)
- **Barra de Busca Global:** Filtragem em tempo real sobre clientes, frotas, placas, chassis e referências financeiras com resposta inferior a 5ms.
- **Painéis Ocultáveis:** Filtros avançados integrados que não poluem a área principal de dados.

### 5. Integração System-First (NODE 5)
- **0ms Local-First:** Gravação instantânea no banco local `data/db.json`. Sincronizações com planilhas e serviços externos ocorrem em segundo plano assíncrono para garantir fluidez total na tela.

---

## 🛠️ Especificação de Endpoints da API REST

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/clientes` | Retorna todos os clientes cadastrados com veículos e histórico |
| `POST` | `/api/clientes` | Cadastra novo cliente com veículo e rastreabilidade |
| `GET` | `/api/ordens-servico` | Retorna histórico de ordens de serviço (produtos, serviços, totais) |
| `POST` | `/api/ordens-servico` | Grava nova O.S. ou atualiza dados com recálculo automático |
| `POST` | `/api/ordens-servico/status` | Altera status da O.S. (`ABERTA`, `EM EXECUÇÃO`, `FINALIZADA`) |
| `GET` | `/api/financeiro/contas` | Retorna extrato de contas a pagar, a receber e movimentações |
| `POST` | `/api/financeiro/contas` | Cria novo lançamento financeiro (Entrada ou Saída) |
| `POST` | `/api/financeiro/liquidar` | Dá baixa / liquida conta financeira e atualiza saldo |
| `GET` | `/api/financeiro/diagnostico` | Retorna margens de lucro por serviço e vazamentos detectados |
| `GET` | `/api/fiscal/notas` | Retorna notas fiscais emitidas (NF-e Mod 55 e NFC-e Mod 65) |
| `POST` | `/api/fiscal/emitir` | Transmite nota para SEFAZ com geração de XML e chave 44 dígitos |
| `GET` | `/api/estoque` | Retorna 8 baterias de estantes e catálogo de autopeças |
| `POST` | `/api/estoque/vender` | Dá baixa imediata de item vendido na estante física |
| `GET` | `/api/materiais` | Cotações vivas de metais (Cobre, Alumínio, Baterias, Ferro) |
| `POST` | `/api/pesagens` | Registra novo romaneio de balança com cálculo de tara e líquido |
| `GET` | `/api/sync/template-csv` | Download do arquivo modelo CSV para importação de inventário |
| `POST` | `/api/sync/planilha` | Importa e deduplica peças em lote via planilha |
| `GET` | `/api/specsfy/status` | Retorna status de conformidade e testes da governança SDD |

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Python 3.8+** instalado no ambiente.
- Navegador web moderno (Chrome, Edge, Firefox, Brave).

### 1. Inicializar o Servidor
No diretório do projeto, execute:
```bash
python server.py
```
O console exibirá:
```text
================================================================
Paulinho Gestao - Ferro Velho & Auto Desmanche Rodando!
Servidor ativo em: http://localhost:8080
================================================================
```

### 2. Acessar o ERP no Navegador
- **Interface Principal:** [http://localhost:8080/](http://localhost:8080/)
- **Módulo Fiscal Dedicado:** [http://localhost:8080/fiscal.html](http://localhost:8080/fiscal.html)

### 3. Executar os Testes Automatizados (Specsfy)
```bash
python specsfy.py test
```
Saída esperada:
```text
Executando bateria de testes automatizados do Specsfy (14 Testes)...

  ✓ T-001: Cálculo de Pesagem Líquida (Bruto - Tara) ... PASS
  ✓ T-002: Dedução de Impureza Percentual no Cobre/Alumínio ... PASS
  ✓ T-003: Invariante de Proteção (Tara >= Bruto Bloqueada) ... PASS
  ✓ T-004: Persistência de Romaneio Multi-Itens no db.json ... PASS
  ✓ T-005: Baixa Automática de Peça na Estante ao Vender ... PASS
  ✓ T-006: Checklist de Descontaminação Ambiental (Lei 12.977) ... PASS
  ✓ T-007: Servidor HTTP REST e Entrega dos Assets Estáticos ... PASS
  ✓ T-008: Validação de Chave de Acesso NF-e (44 dígitos SEFAZ) ... PASS
  ✓ T-009: Cálculo de ICMS Diferido para Sucatas Metálicas ... PASS
  ✓ T-010: Geração e Vinculação de Manifesto de Carga MDF-e ... PASS
  ✓ T-011: Sincronização e Importação de Planilha CSV (POST /api/sync/planilha) ... PASS
  ✓ T-012: Exportação de Template CSV de Inventário (GET /api/sync/template-csv) ... PASS
  ✓ T-013: Sincronização Assíncrona System-First e Fila Background ... PASS
  ✓ T-014: Leitura de Código de Barras Wedge e Áudio Chime (0ms) ... PASS

Todos os 14 testes passaram com sucesso! (100% de cobertura operacional, fiscal, sync e scanner)
```

---

## 📄 Licença e Conformidade Legal
- **Lei Federal nº 12.977/2014:** Regula e disciplina a atividade de desmontagem de veículos automotores terrestres.
- **Resoluções CONAMA:** Destinação ecológica de óleos lubrificantes, fluidos e logística reversa de baterias chumbo-ácido.
- **SEFAZ / ENCAT:** Nota Fiscal Eletrônica Schema v4.00 com ICMS diferido conforme Artigo 392 do RICMS.
- **Desenvolvido por:** [Arthur Dias (ArthurDays)](https://github.com/ArthurDays)
