# Paulinho Gestão ERP

Aplicação de gestão para operações de ferro-velho, estoque de autopeças e oficina. Reúne interfaces de pesagem, desmanche, clientes, ordens de serviço e financeiro, com servidor HTTP em Python e persistência local em JSON.

## Estado do projeto

O repositório contém uma implementação para demonstração e desenvolvimento local. A presença de uma tela, rota ou registro não comprova integração externa nem prontidão para produção.

**O módulo fiscal é simulado:** em [server.py](server.py), a rota `/api/fiscal/emitir` gera localmente a chave, o protocolo, o XML e o status `AUTORIZADA`. Esse fluxo não transmite a nota à SEFAZ nem realiza assinatura digital do XML. Os documentos gerados devem ser tratados como artefatos de demonstração.

## Funcionalidades e limites

| Área | Implementação observada | Limite |
| --- | --- | --- |
| Pesagens | Registro de romaneios e informações de pagamento | Marcar um registro como pago não executa uma transferência bancária. |
| Estoque | Consulta, venda de peças e organização por estantes | A persistência usa arquivo JSON local. |
| Desmanche | Registro de descontaminação e triagem de peças | Não representa validação por órgão externo. |
| Clientes e ordens de serviço | Cadastro, cálculo de totais e atualização de status | As regras devem ser validadas antes do uso operacional. |
| Financeiro | Contas, liquidação local e leitura de diagnóstico armazenado | Indicadores presentes nos dados não comprovam resultados reais de clientes. |
| Importação | Recebimento de CSV ou itens JSON pela API | Importar dados não comprova sincronização contínua com Google Sheets. |
| Fiscal | Geração local de registro e XML demonstrativo | Sem autorização externa no endpoint de emissão. |

## Executar localmente

Pré-requisitos: Python 3 e navegador moderno.

```bash
git clone https://github.com/ArthurDays/paulinho-gestao-erp.git
cd paulinho-gestao-erp
python server.py
```

Abra [http://localhost:8080](http://localhost:8080). A interface fiscal está em [http://localhost:8080/fiscal.html](http://localhost:8080/fiscal.html).

Use uma cópia de desenvolvimento com dados fictícios. As operações modificam `data/db.json`.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| [server.py](server.py) | Servidor HTTP, rotas e persistência |
| [index.html](index.html) | Interface principal |
| [fiscal.html](fiscal.html) | Interface fiscal demonstrativa |
| [public/](public/) | JavaScript, estilos e imagens |
| [src/](src/) | Componentes e serviços TypeScript/TSX; não são compilados pelo comando Python acima |
| [spec/](spec/) e [specs/](specs/) | Documentação e especificações |
| [specsfy.py](specsfy.py) | Ferramenta de verificação do projeto |

## Rotas principais

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET / POST | `/api/clientes` | Consultar ou cadastrar clientes |
| GET / POST | `/api/ordens-servico` | Consultar ou registrar ordens |
| POST | `/api/ordens-servico/status` | Alterar status |
| GET / POST | `/api/financeiro/contas` | Consultar ou registrar contas |
| POST | `/api/financeiro/liquidar` | Registrar liquidação local |
| GET | `/api/estoque` | Consultar estoque |
| POST | `/api/estoque/vender` | Registrar venda de peça |
| GET / POST | `/api/pesagens` | Consultar ou registrar romaneios |
| GET | `/api/sync/template-csv` | Baixar modelo de importação |
| POST | `/api/sync/planilha` | Importar CSV ou itens JSON |
| GET | `/api/fiscal/notas` | Consultar registros fiscais locais |
| POST | `/api/fiscal/emitir` | Gerar registro fiscal simulado |

## Verificação

O comando documentado para a ferramenta do projeto é:

```bash
python specsfy.py test
```

Consulte a saída da execução na versão utilizada. Este README não certifica aprovação dos testes, percentual de cobertura, latência ou conformidade fiscal. Quantidade de testes não equivale a percentual de cobertura.

## Próximos passos técnicos

- Implementar e validar autenticação e autorização nas rotas.
- Revisar exposição de arquivos pelo servidor HTTP.
- Evoluir a persistência e as garantias de integridade para uso concorrente.
- Identificar as simulações também nas interfaces e nos documentos exportados.
- Implementar integrações externas com ambientes de teste e evidências de funcionamento.
- Publicar resultados reproduzíveis de testes e medições de desempenho.

## Autor

[Arthur Days](https://github.com/ArthurDays)
