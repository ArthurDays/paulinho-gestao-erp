# Especificação Funcional: Regras de Negócio de Pesagem, Precificação e Gestão

**Sistema**: Gestão Integrada de Ferro Velho e Auto Desmanche (Paulinho Reciclagem)  
**Padrão**: GitHub SpecKit & Promovaweb Specsfy  
**Versão**: 1.0.0  
**Data**: 2026-09-27  
**Status**: Defined & Ready for Execution  

---

## 1. Visão Geral do Sistema

O sistema atende a um ecossistema operacional híbrido de **Reciclagem de Metais (Ferro Velho)** e **Auto Desmanche (Peças Automotivas Usadas)**, refletindo com fidelidade absoluta o fluxo físico observado na instalação:
- **BALCÃO** (Recepção, Pesagem Comercial, Pagamento a Fornecedores/Catadores e Venda de Peças no Varejo);
- **PRATELEIRAS** (Estoque vertical categorizado, catalogação de autopeças recuperadas, código de barras/QR e rastreabilidade por estante/nível/gaveta);
- **DESMANCHE** (Pátio de desmontagem mecânica, descontaminação de fluidos, triagem de carcaças, separação de metais ferrosos/não-ferrosos e alimentação do estoque).

---

## 2. Regras de Negócio: Módulo de Balança & Pesagem

### RN-BAL-001: Ciclo de Pesagem e Cálculo de Peso Líquido
1. O peso bruto ($P_B$) é capturado a partir da balança eletrônica rodoviária/plataforma ou inserido pelo operador em quilogramas (kg).
2. A tara ($T$) corresponde ao peso do veículo, caçamba, big bag, gaiola ou carrinho utilizado no transporte.
3. O peso bruto deve ser estritamente maior ou igual à tara ($P_B \ge T$).
4. O peso líquido inicial ($P_{L0}$) é calculado por:
   $$P_{L0} = P_B - T$$
5. Caso haja desconto por impureza (terra, óleo, plástico, umidade ou impurezas mistas), o percentual de desconto ($D_{imp}\%$) ou o desconto fixo em kg ($D_{kg}$) é deduzido:
   $$P_{L\text{final}} = \max\left(0, P_{L0} \times \left(1 - \frac{D_{imp}}{100}\right) - D_{kg}\right)$$

### RN-BAL-002: Classificação e Precificação Dinâmica de Materiais
Cada material reciclável possui uma cotação diária de compra (preço pago ao catador/fornecedor) e de venda (preço cobrado de siderúrgicas/fundições/clientes). As categorias mapeadas são:

| Código | Material | Subtipo | Preço Compra (R$/kg) | Preço Venda (R$/kg) | Tolerância Impureza Máx. |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MT-COB-01** | Cobre | Mel (Fio Limpo 1ª) | R$ 42,00 | R$ 48,50 | 2,0% |
| **MT-COB-02** | Cobre | Misto / Queimado | R$ 36,50 | R$ 42,00 | 5,0% |
| **MT-ALU-01** | Alumínio | Perfil Limpo | R$ 11,50 | R$ 14,00 | 2,0% |
| **MT-ALU-02** | Alumínio | Estamparia / Panela | R$ 9,20 | R$ 11,80 | 4,0% |
| **MT-ALU-03** | Alumínio | Bloco de Motor / Antimônio | R$ 8,00 | R$ 10,20 | 8,0% (graxa/óleo) |
| **MT-LAT-01** | Latão | Amarelo / Conectores | R$ 26,00 | R$ 30,50 | 3,0% |
| **MT-FER-01** | Ferro Velho | Sucata Pesada (Chapa/Viga) | R$ 1,20 | R$ 1,65 | 5,0% |
| **MT-FER-02** | Ferro Velho | Sucata Miúda / Estamparia | R$ 0,85 | R$ 1,25 | 7,0% |
| **MT-FER-03** | Ferro Velho | Ferro Fundido (Tambor/Bloco) | R$ 1,10 | R$ 1,50 | 4,0% |
| **MT-BAT-01** | Bateria | Chumbo-Ácido Automotiva | R$ 4,80 | R$ 6,20 | 0,0% (líquido retido) |
| **MT-INO-01** | Inox | 304 Não Magnético | R$ 8,50 | R$ 11,00 | 2,0% |
| **MT-RAD-01** | Radiadores | Cobre/Alumínio Misto | R$ 18,00 | R$ 22,00 | 5,0% |

### RN-BAL-003: Composição de Romaneio de Pesagem (Multi-Itens)
- Uma única operação de pesagem (Romaneio) pode conter múltiplos itens de materiais distintos para o mesmo fornecedor ou cliente.
- O valor de cada item ($V_i$) é dado por:
  $$V_i = P_{L\text{final}, i} \times \text{Preço/kg}_i$$
- O valor total do Romaneio ($V_{\text{total}}$) é o somatório dos itens:
  $$V_{\text{total}} = \sum_{i=1}^n V_i$$

### RN-BAL-004: Liquidação Financeira & Pagamento/Recebimento
1. **Operação de Compra (Pagar Fornecedor/Catador)**:
   - Saída de caixa da empresa.
   - Métodos suportados: **PIX Imediato** (via QR Code ou Chave Pix), **Dinheiro em Espécie**, **Transferência Bancária** ou **Vale/Crédito em Peças**.
   - Identificação do fornecedor obrigatória para transações acima de R$ 500,00 (Conformidade com resolução de segurança e combate à receptação).
2. **Operação de Venda (Receber de Cliente/Siderúrgica)**:
   - Entrada de caixa da empresa.
   - Métodos suportados: PIX, Cartão de Débito, Cartão de Crédito, Boleto Faturado ou Dinheiro.

### RN-BAL-005: Emissão e Impressão de Romaneio / Recibo
Ao finalizar a pesagem, o sistema gera o comprovante oficial contendo:
- Número Sequencial do Ticket/Romaneio (ex: `#ROM-2026-0842`);
- Data e Hora exata de pesagem;
- Dados da Empresa (Razão Social, CNPJ, Endereço, Contato);
- Dados do Fornecedor / Cliente (Nome, Documento, Placa do Veículo se houver);
- Grade detalhada dos materiais com Peso Bruto, Tara, Peso Líquido, Impureza, Preço Unitário e Subtotal;
- Resumo Financeiro com Método de Pagamento e Assinatura do Conferente e do Fornecedor;
- Formato otimizado para impressoras térmicas não fiscais de 80mm / 58mm e formato A4.

---

## 3. Regras de Negócio: Módulo de Desmanche (Pátio & Triagem)

### RN-DES-001: Entrada e Baixa de Veículo
1. Todo veículo admitido para desmanche deve registrar: Placa, RENAVAM, Chassi, Marca/Modelo, Ano, Cor e Número da Certidão de Baixa Permanente junto ao DETRAN.
2. Status inicial: `Pátio de Entrada` $\rightarrow$ `Em Descontaminação` $\rightarrow$ `Em Desmontagem` $\rightarrow$ `Desmontado/Prensado`.

### RN-DES-002: Descontaminação Ambiental Obrigatória
Antes da remoção mecânica das peças, é obrigatório registrar a extração e descarte controlado de:
- Óleo lubrificante do motor e transmissão;
- Fluido de freio e fluido de direção hidráulica;
- Gás refrigerante do ar-condicionado (R134a/R1234yf);
- Combustível residual do tanque;
- Bateria automotiva de chumbo-ácido.

### RN-DES-003: Bifurcação de Destino: Autopeça vs Sucata
Para cada componente extraído no posto de desmanche:
- **Se a peça estiver íntegra e aprovada no teste funcional**: Gera um registro de produto rastreado com etiqueta de código de barras, encaminhado imediatamente para as **PRATELEIRAS** com precificação comercial.
- **Se a peça estiver danificada, trincada ou não comercializável**: É classificada como sucata metálica (bloco de ferro fundido, chapa de aço, radiador amassado, cabeçote trincado) e direcionada em caçambas para a **BALANÇA**.

---

## 4. Regras de Negócio: Módulo de Prateleiras (Estoque & Rastreabilidade)

### RN-EST-001: Endereçamento Físico Tridimensional
O layout de prateleiras mapeia a estrutura visual observada na foto:
- **Estantes**: `EST-01` a `EST-08` (4 estantes na ala esquerda, 4 na ala direita);
- **Níveis de Altura**:
  - `Nível 4 (Topo)`: Caixas fechadas de papelão com peças leves/acessórios;
  - `Nível 3 (Médio-Alto)`: Peças mecânicas intermediárias (amortecedores, pinças de freio, motores de arranque);
  - `Nível 2 (Médio-Baixo)`: Componentes pesados (discos de freio, cubos, molas helicoidais, semi-eixos);
  - `Nível 1 (Base/Chão)`: Gaveteiros organizadores azuis e amarelos (sensores, parafusos, conexões de latão/cobre) e paletes com rodas/pneus.

### RN-EST-002: Classificação de Estado de Conservação da Peça
- **Grau A (Excelente)**: Peça semi-nova, sem desgaste aparente, testada em bancada;
- **Grau B (Bom/Regular)**: Peça com marcas de uso normais, 100% funcional;
- **Grau C (Recuperável)**: Peça que necessita de retífica leve ou limpeza para uso.

### RN-EST-003: Baixa de Estoque e Venda no Balcão
Quando o atendente do **BALCÃO** realiza a venda de uma peça:
1. O sistema reserva a peça e emite ordem de coleta com indicação exata da localização (ex: `EST-03-N2-G04`);
2. A peça é retirada fisicamente das prateleiras;
3. Ao confirmar o pagamento no caixa, o status da peça passa para `Vendido` e é associada ao cupom/recibo de venda com termo de garantia legal de 90 dias.
