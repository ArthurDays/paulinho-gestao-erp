# Plano de Tarefas e Execução (Tasks & Verification)

**Metodologia**: SpecKit Task Breakdown & Specsfy Ato III (Entregar e Validar)  
**Sistema**: Sistema de Gestão para Ferro Velho e Auto Desmanche  
**Status**: Executando  

---

## 1. Fase 1: Fundação de Dados e Backend

- [x] **TSK-001**: Modelar schema e criar base de dados inicial em JSON (`data/db.json`) com:
  - Materiais e cotações reais (Cobre, Alumínio, Ferro, Latão, Inox, Baterias);
  - As 8 Estantes das Prateleiras com níveis e peças reais correspondentes às fotos (discos de freio, amortecedores, alternadores, pinças, caixas kraft);
  - Baias de desmanche com os 2 veículos da foto (Sedan escuro na Baia 1 e SUV prata na Baia 2);
  - Parceiros cadastrados (fornecedores de sucata, catadores e oficinas).
- [x] **TSK-002**: Implementar servidor backend REST nativo em Python (`server.py`):
  - Endpoints para `/api/materiais`, `/api/pesagens`, `/api/estoque`, `/api/desmanche`, `/api/contatos`, `/api/metricas`;
  - Roteamento estático para arquivos web (`public/`, `index.html`, `layout.png`).

---

## 2. Fase 2: Design System e Estética Visual

- [x] **TSK-003**: Implementar `public/css/variables.css` e tokens visuais:
  - Paleta escura industrial de alto impacto;
  - Cores semânticas das 3 zonas físicas da foto:
    * `--color-balcao: #1b4f72` (Azul Balcão / Entrada)
    * `--color-prateleiras: #1e7e34` (Verde Armazém / Corredor)
    * `--color-desmanche: #d9531e` (Laranja Oficina / Elevadores)
  - Display digital fosforescente da balança (`--color-scale-led: #22c55e`).
- [x] **TSK-004**: Criar componentes de layout e planta baixa interativa (`FacilityFloorplan`):
  - Reproduzir a vista aérea do galpão com áreas clicáveis para saltar diretamente para cada setor.

---

## 3. Fase 3: Módulo Balcão & Balança Comercial (Zona Azul)

- [x] **TSK-005**: Construir o display digital da balança com:
  - Simulação de leitura em tempo real ou input manual;
  - Campo de Tara com botão de zerar/tarar;
  - Cálculo instantâneo de Peso Líquido e impureza.
- [x] **TSK-006**: Construir a grade rápida de seleção de materiais (Cobre, Alumínio, Ferro, Latão, etc.) com cotações vivas.
- [x] **TSK-007**: Construir a tabela de múltiplos itens da pesagem com subtotal e total faturado.
- [x] **TSK-008**: Construir ações de liquidação:
  - Seletor de fornecedor/cliente;
  - Modal de pagamento com opções PIX, Dinheiro e Cartão;
  - Modal de visualização e impressão de Romaneio Térmico 80mm com QR Code.

---

## 4. Fase 4: Módulo Prateleiras & Estoque (Zona Verde)

- [x] **TSK-009**: Construir visualizador matricial das 8 estantes industriais (`EST-01` a `EST-08`):
  - Visualização de Nível 4 (Caixas Kraft), Nível 3 (Mecânica), Nível 2 (Pesados) e Nível 1 (Bins/Paletes);
  - Indicador de capacidade e peças armazenadas.
- [x] **TSK-010**: Construir catálogo de peças com filtro instantâneo por veículo, código OEM, condição e botão "Vender no Balcão".

---

## 5. Fase 5: Módulo Desmanche (Zona Laranja)

- [x] **TSK-011**: Construir o monitor das baias de desmanche:
  - Baia 1: Sedan escuro em desmontagem;
  - Baia 2: SUV prata em desmontagem;
  - Bancada central de ferramentas.
- [x] **TSK-012**: Construir o formulário de entrada de veículo e o checklist de descontaminação ambiental.
- [x] **TSK-013**: Implementar ação de triagem de peças desmanchadas (enviar autopeça para prateleira ou sucata para balança).

---

## 6. Fase 6: Validação e Testes Funcionais

- [x] **TSK-014**: Executar bateria de testes dos cálculos da balança e persistência.
- [x] **TSK-015**: Subir o servidor local e validar a aplicação no navegador via browser subagent.

---

## 7. Fase 7: Overhaul do Design System & Eliminação do Visual Legado

- [x] **TSK-016**: Criar biblioteca de tokens unificada `public/css/modern_ds.css`:
  - Cartões brancos (`#FFFFFF`), fundo neutro (`#F8FAFC`), texto grafite (`#0F172A`), acentos Laranja Corporativo (`#EA580C`);
  - Tipografia moderna sans-serif (Inter, Outfit) e mono para balança.
- [x] **TSK-017**: Refatorar `index.html` substituindo elementos legados por sidebar executiva com badges de status, cards de borda suave e responsividade total.
- [x] **TSK-018**: Adaptar orquestrador `public/js/app.js` para chaveamento de abas moderno e breadcrumb em tempo real.

---

## 8. Fase 8: Suíte Fiscal, Gestor LC, NF-e & MDF-e

- [x] **TSK-019**: Construir Dashboard Executivo Gestor LC com KPIs de faturamento, compras e saldo tributário de ICMS/PIS/COFINS.
- [x] **TSK-020**: Construir Assistente Passo a Passo (Wizard) de Emissão de NF-e para Sucata e Autopeças com validação instantânea.
- [x] **TSK-021**: Construir Emissor de MDF-e com roteirização de frete, motorista e vinculação de chaves NF-e.
- [x] **TSK-022**: Integrar monitoramento de status da SEFAZ com badges pulsantes e visualizador slide-over de XML/DANFE.

---

## 9. Fase 9: Sincronização Massiva, Planilhas & Auditoria

- [x] **TSK-023**: Implementar endpoints de integração `/api/sync/planilha` e `/api/sync/template-csv` com deduplicação por código OEM e recálculo de ocupação de estantes.
- [x] **TSK-024**: Desenvolver o módulo frontend de sincronização (`SyncModule` e `tab-sync`) com upload CSV, colagem manual, preview e histórico permanente de auditoria em `db.json`.


