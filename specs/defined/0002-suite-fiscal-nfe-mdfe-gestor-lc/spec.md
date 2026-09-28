# Especificação Integrada: Suíte Fiscal, Gestor LC e Emissão NF-e / MDF-e

| Campo | Valor |
| :--- | :--- |
| Formato | Specsfy/2.0 |
| ID | SPEC-2026-0002 |
| Slug | 0002-suite-fiscal-nfe-mdfe-gestor-lc |
| Status | Defined |
| Effort | 8 |
| Effort updated at | 2026-09-27 |
| Effort rationale | Overhaul de Design System completo eliminando visual legado (cinza/Windows 98) e criação de Suíte Fiscal completa: Gestor LC, Emissor NF-e com assistente passo a passo, Emissor MDF-e com roteirização de frete e status em tempo real SEFAZ. |
| ClickUp Task | TASK-FISCAL-02 |
| Milestones | M1-OverhaulDesignSystem, M2-GestorLC, M3-NFeWizard, M4-MDFeTransport, M5-SEFAZIntegration |
| Definition Gate | Approved |
| Plan Gate | Approved |
| Delivery Gate | Approved |
| Evidence Contract | 1 |
| Interface para pessoas | Sim (Interface Web Moderna com Tokens Corporativos) |
| Atualizada em | 2026-09-27 |

---

## Ato I — Definir

### 1. Problema e Contexto

#### Problema
Sistemas legados de gestão e emissão fiscal para reciclagem e ferro velho frequentemente utilizavam interfaces cinzas, tabelas condensadas e formulários burocráticos sem validação contextual nem automação tributária. Isso causava rejeições frequentes na SEFAZ, erros no cálculo de ICMS/PIS/COFINS diferidos para sucatas metálicas e dificuldade na geração de Manifestos de Documentos Fiscais Eletrônicos (MDF-e) para transporte de carga pesada.

#### Resultado Desejado
1. **Overhaul Visual Irrestrito**: Eliminar totalmente o layout legado e adotar Design System moderno baseado em cartões brancos com cantos arredondados (`border-radius: 12px`), tipografia sans-serif executiva (`Inter` e `Outfit`), acentos Laranja Corporativo (`#EA580C`), texto grafite escuro (`#0F172A`) e badges de status SEFAZ em tempo real.
2. **Gestor LC**: Painel executivo consolidando faturamento mensal, compras de sucata, crédito/débito de ICMS acumulado e romaneios pendentes de faturamento fiscal.
3. **Emissor NF-e Passo a Passo**: Assistente guiado em 4 etapas (Dados do Destinatário/Fornecedor, Produtos & NCM de Metais, Tributação Automática ICMS/PIS/COFINS, Transmissão SEFAZ).
4. **Emissor MDF-e**: Módulo de manifesto para transporte com cadastro de veículo de carga, motorista, rota interestadual e amarração com as chaves das NF-e transportadas.

---

## Ato II — Projetar

### 1. Arquitetura de Componentes e Design System
- **Layout Shell**: Sidebar lateral escura com navegação entre Gestor LC, Emissor NF-e, Emissor MDF-e e retorno ao Galpão Operacional.
- **Tokens Visuais**: Definidos em `public/css/modern_ds.css` e `public/css/variables.css`.
- **Assistente Wizard**: Componente `.wizard-stepper` com círculos de progresso numerados e validação instantânea.
- **Slide-over Drawer**: Painel lateral deslizante para inspeção detalhada de XML, DANFE e logs de retorno da SEFAZ.

---

## Ato III — Entregar e Validar

### 1. Entregáveis Funcionais
- `fiscal.html`: SPA completa da Suíte Fiscal moderna.
- `index.html`: Operações industriais migradas para o novo Design System.
- Endpoints REST `/api/metricas`, `/api/pesagens`, `/api/specsfy/status`.
- Motor de cálculo tributário e emissão simulada com chaves de acesso de 44 dígitos no padrão SEFAZ.
