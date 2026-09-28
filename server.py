#!/usr/bin/env python3
"""
Paulinho Gestão - Sistema Integrado de Ferro Velho e Auto Desmanche
Servidor HTTP e API RESTful nativo em Python 3.14
Padrão: GitHub SpecKit & Promovaweb Specsfy
"""

import json
import os
import sys
import mimetypes
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "data", "db.json")

def load_db():
    if not os.path.exists(DB_FILE):
        return {}
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(data):
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def calcular_dv_nfe(chave_43):
    pesos = [2, 3, 4, 5, 6, 7, 8, 9]
    soma = 0
    p_idx = 0
    for char in reversed(chave_43):
        soma += int(char) * pesos[p_idx]
        p_idx = (p_idx + 1) % len(pesos)
    resto = soma % 11
    if resto in (0, 1):
        return 0
    return 11 - resto

def gerar_chave_acesso(uf="53", aamm=None, cnpj="44628855000137", mod="55", serie="001", n_nf=1, tp_emis="1", c_nf=None):
    if aamm is None:
        now = datetime.now()
        aamm = f"{now.strftime('%y%m')}"
    if c_nf is None:
        import random
        c_nf = f"{random.randint(10000000, 99999999)}"
    s_serie = str(serie).zfill(3)
    s_nnf = str(n_nf).zfill(9)
    s_cnf = str(c_nf).zfill(8)
    base = f"{uf}{aamm}{cnpj}{mod}{s_serie}{s_nnf}{tp_emis}{s_cnf}"
    dv = calcular_dv_nfe(base)
    return f"{base}{dv}"

class GestaoHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        response_bytes = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(response_bytes)

    def _send_file(self, filepath, content_type=None):
        if not os.path.exists(filepath) or os.path.isdir(filepath):
            self.send_error(404, "Arquivo não encontrado")
            return
        
        if content_type is None:
            content_type, _ = mimetypes.guess_type(filepath)
            if content_type is None:
                content_type = "application/octet-stream"
        
        with open(filepath, "rb") as f:
            content = f.read()

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("ETag", f'W/"paulinho-{os.path.getmtime(filepath)}"')
        self.end_headers()
        self.wfile.write(content)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # Rotas da API
        if path == "/api/materiais":
            db = load_db()
            return self._send_json(db.get("materiais", []))
        
        if path == "/api/parceiros":
            db = load_db()
            return self._send_json(db.get("parceiros", []))
        
        if path == "/api/pesagens":
            db = load_db()
            return self._send_json(db.get("romaneios", []))
        
        if path == "/api/estoque":
            db = load_db()
            return self._send_json({
                "estantes": db.get("estantes", []),
                "pecas": db.get("pecas_estoque", []),
                "balcao_conveniencia": db.get("produtos_balcao_conveniencia", [])
            })
        
        if path == "/api/desmanche":
            db = load_db()
            return self._send_json({
                "veiculos": db.get("veiculos_desmanche", [])
            })
        
        if path == "/api/metricas":
            db = load_db()
            romaneios = db.get("romaneios", [])
            pecas = db.get("pecas_estoque", [])
            veiculos = db.get("veiculos_desmanche", [])

            total_pago = sum(r.get("valor_total", 0) for r in romaneios if r.get("tipo") == "COMPRA")
            total_vendido = sum(r.get("valor_total", 0) for r in romaneios if r.get("tipo") == "VENDA")
            total_kg_processados = sum(r.get("peso_liquido_total", 0) for r in romaneios)
            
            pecas_disponiveis = sum(1 for p in pecas if p.get("status") == "Disponível")
            veiculos_ativos = sum(1 for v in veiculos if v.get("status") == "Em Desmontagem")

            return self._send_json({
                "total_pago_fornecedores": total_pago,
                "total_vendas": total_vendido,
                "total_kg_hoje": round(total_kg_processados, 2),
                "pecas_disponiveis": pecas_disponiveis,
                "veiculos_em_desmanche": veiculos_ativos,
                "estantes_total": len(db.get("estantes", [])),
                "total_romaneios": len(romaneios)
            })

        if path == "/api/sync/template-csv":
            csv_header = "ID_PECA;CODIGO_OEM;DESCRICAO;CATEGORIA;VEICULO_ORIGEM;ESTANTE_ID;NIVEL;POSICAO;PRECO_CUSTO;PRECO_VENDA;QUANTIDADE;CONDICAO"
            csv_rows = [
                "PC-IMP-001;1K0615301AA;Par Discos Freio Ventilados;Freios;Jetta TSI 2.0;EST-01;2;N2-P04;180.00;480.00;2;Grau A - Excelente",
                "PC-IMP-002;5Q0413029;Amortecedor Dianteiro;Suspensão;Golf TSI;EST-02;3;N3-P02;95.00;290.00;4;Grau A - Excelente",
                "PC-IMP-003;06K903023;Alternador Bosch 140A;Elétrica;Jetta TSI;EST-07;2;N2-P01;210.00;650.00;1;Grau B - Bom Estado"
            ]
            csv_content = csv_header + "\n" + "\n".join(csv_rows) + "\n"
            csv_bytes = csv_content.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", "attachment; filename=template_inventario_paulinho_gestao.csv")
            self.send_header("Content-Length", str(len(csv_bytes)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(csv_bytes)
            return

        if path == "/api/sync/historico":
            db = load_db()
            return self._send_json(db.get("sync_historico", []))

        if path == "/api/fiscal/notas":
            db = load_db()
            return self._send_json(db.get("notas_fiscais", []))

        if path == "/api/clientes":
            db = load_db()
            return self._send_json(db.get("clientes", []))

        if path == "/api/ordens-servico":
            db = load_db()
            return self._send_json(db.get("ordens_servico", []))

        if path == "/api/financeiro/contas":
            db = load_db()
            return self._send_json(db.get("contas_financeiro", []))

        if path == "/api/financeiro/diagnostico":
            db = load_db()
            return self._send_json(db.get("diagnostico_financeiro", {}))

        if path == "/api/specsfy/status":
            import subprocess
            py_exe = sys.executable
            specsfy_script = os.path.join(BASE_DIR, "specsfy.py")
            qs = parse_qs(parsed.query)
            arg = qs.get("cmd", ["status"])[0]
            try:
                out = subprocess.check_output([py_exe, specsfy_script, arg], stderr=subprocess.STDOUT, text=True, encoding="utf-8")
            except Exception as e:
                out = f"Erro ao executar specsfy: {str(e)}"
            return self._send_json({"output": out, "timestamp": datetime.now().isoformat()})

        # Servir Arquivos Estáticos
        if path == "/" or path == "/index.html":
            return self._send_file(os.path.join(BASE_DIR, "index.html"), "text/html; charset=utf-8")
        
        if path == "/fiscal" or path == "/fiscal.html":
            return self._send_file(os.path.join(BASE_DIR, "fiscal.html"), "text/html; charset=utf-8")
        
        if path == "/layout.png":
            return self._send_file(os.path.join(BASE_DIR, "layout.png"), "image/png")

        # Caminho sob public/
        rel_path = path.lstrip("/")
        file_candidate = os.path.join(BASE_DIR, "public", rel_path)
        if os.path.exists(file_candidate) and not os.path.isdir(file_candidate):
            return self._send_file(file_candidate)
        
        # Fallback para raiz
        direct_candidate = os.path.join(BASE_DIR, rel_path)
        if os.path.exists(direct_candidate) and not os.path.isdir(direct_candidate):
            return self._send_file(direct_candidate)

        self.send_error(404, f"Rota não encontrada: {path}")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_length)
        payload = {}
        if post_body:
            try:
                decoded = post_body.decode("utf-8")
            except UnicodeDecodeError:
                decoded = post_body.decode("latin-1", errors="replace")
            try:
                payload = json.loads(decoded)
            except Exception as e:
                return self._send_json({"error": f"JSON inválido: {str(e)}"}, status=400)

        db = load_db()

        if path == "/api/pesagens":
            # Registrar novo Romaneio de Pesagem
            romaneios = db.get("romaneios", [])
            novo_id = f"ROM-2026-{len(romaneios) + 842:05d}"
            
            payload["id"] = novo_id
            payload["data_hora"] = datetime.now().isoformat()
            payload["status"] = "PAGO" if payload.get("metodo_pagamento") != "A_FATURAR" else "PENDENTE"
            
            romaneios.insert(0, payload)
            db["romaneios"] = romaneios
            save_db(db)
            return self._send_json({"success": True, "romaneio": payload}, status=201)

        if path == "/api/parceiros":
            parceiros = db.get("parceiros", [])
            novo_id = f"PAR-{len(parceiros) + 1:03d}"
            payload["id"] = novo_id
            parceiros.append(payload)
            db["parceiros"] = parceiros
            save_db(db)
            return self._send_json({"success": True, "parceiro": payload}, status=201)

        if path == "/api/materiais/atualizar":
            # Atualiza preços de cotação do dia
            materiais = db.get("materiais", [])
            mat_id = payload.get("id")
            for m in materiais:
                if m.get("id") == mat_id:
                    if "preco_compra_kg" in payload:
                        m["preco_compra_kg"] = float(payload["preco_compra_kg"])
                    if "preco_venda_kg" in payload:
                        m["preco_venda_kg"] = float(payload["preco_venda_kg"])
                    break
            db["materiais"] = materiais
            save_db(db)
            return self._send_json({"success": True, "materiais": materiais})

        if path == "/api/estoque/vender":
            peca_id = payload.get("id")
            pecas = db.get("pecas_estoque", [])
            encontrada = None
            for p in pecas:
                if p.get("id") == peca_id:
                    p["status"] = "Vendido"
                    encontrada = p
                    break
            if encontrada:
                # Diminui ocupação da estante
                est_id = encontrada.get("estante_id")
                for e in db.get("estantes", []):
                    if e.get("id") == est_id and e.get("ocupacao", 0) > 0:
                        e["ocupacao"] -= 1
                        break
                db["pecas_estoque"] = pecas
                save_db(db)
                return self._send_json({"success": True, "peca": encontrada})
            return self._send_json({"error": "Peça não localizada"}, status=404)

        if path == "/api/desmanche/descontaminar":
            veic_id = payload.get("id")
            veiculos = db.get("veiculos_desmanche", [])
            for v in veiculos:
                if v.get("id") == veic_id:
                    v["descontaminado"] = True
                    v["status"] = "Em Desmontagem"
                    v["baia"] = "Baia 1 (Elevador Esquerdo)"
                    v["fluidos_drenados"] = payload.get("fluidos", v.get("fluidos_drenados"))
                    break
            db["veiculos_desmanche"] = veiculos
            save_db(db)
            return self._send_json({"success": True, "veiculo": veic_id})

        if path == "/api/desmanche/triagem":
            # Extração de peça ou sucata
            destino = payload.get("destino") # "ESTOQUE" ou "BALANCA"
            veic_id = payload.get("veiculo_id")
            
            # Atualiza veículo
            for v in db.get("veiculos_desmanche", []):
                if v.get("id") == veic_id:
                    v["progresso"] = min(100, v.get("progresso", 0) + 15)
                    if destino == "ESTOQUE":
                        v["pecas_geradas"] = v.get("pecas_geradas", 0) + 1
                    else:
                        v["sucata_gerada_kg"] = v.get("sucata_gerada_kg", 0) + float(payload.get("peso", 10))
                    break

            if destino == "ESTOQUE":
                pecas = db.get("pecas_estoque", [])
                nova_peca = {
                    "id": f"PC-2026-{len(pecas)+1:03d}",
                    "codigo_oem": payload.get("codigo_oem", "OEM-AUTO"),
                    "descricao": payload.get("descricao", "Peça Usada Reciclada"),
                    "categoria": payload.get("categoria", "Mecânica"),
                    "veiculo_origem": payload.get("veiculo_origem", "Veículo Desmanche"),
                    "estante_id": payload.get("estante_id", "EST-01"),
                    "nivel": int(payload.get("nivel", 2)),
                    "posicao": payload.get("posicao", "N2-P01"),
                    "condicao": payload.get("condicao", "Grau A - Excelente"),
                    "preco_venda": float(payload.get("preco_venda", 250.0)),
                    "status": "Disponível",
                    "foto_icone": "fa-cogs"
                }
                pecas.append(nova_peca)
                db["pecas_estoque"] = pecas
                # Aumenta ocupação da estante
                for e in db.get("estantes", []):
                    if e.get("id") == nova_peca["estante_id"]:
                        e["ocupacao"] = min(e.get("capacidade_max", 50), e.get("ocupacao", 0) + 1)
                        break

            save_db(db)
            return self._send_json({"success": True, "message": "Triagem processada com sucesso"})

        if path == "/api/sync/planilha":
            # Importação de dados via CSV (text) ou JSON array
            db = load_db()
            pecas = db.get("pecas_estoque", [])
            historico = db.get("sync_historico", [])
            existentes_oem = {p.get("codigo_oem"): idx for idx, p in enumerate(pecas)}

            adicionados = 0
            atualizados = 0
            novas_pecas = []

            # Determinar se o payload é CSV text ou JSON array
            csv_text = payload.get("csv_text", "")
            json_items = payload.get("items", [])

            if csv_text:
                # Parse CSV semicolon-delimited (skip header)
                lines = [l.strip() for l in csv_text.strip().split("\n") if l.strip()]
                for i, line in enumerate(lines):
                    if i == 0 and "CODIGO_OEM" in line.upper():
                        continue  # skip header
                    cols = line.split(";")
                    if len(cols) < 10:
                        continue
                    item = {
                        "id": cols[0].strip() if cols[0].strip().startswith("PC-") else f"PC-SYNC-{len(pecas) + adicionados + 1:03d}",
                        "codigo_oem": cols[1].strip(),
                        "descricao": cols[2].strip(),
                        "categoria": cols[3].strip(),
                        "veiculo_origem": cols[4].strip(),
                        "estante_id": cols[5].strip(),
                        "nivel": int(cols[6].strip()) if cols[6].strip().isdigit() else 2,
                        "posicao": cols[7].strip() if len(cols) > 7 else f"N{cols[6].strip()}-P01",
                        "preco_custo": float(cols[8].strip()) if len(cols) > 8 else 0.0,
                        "preco_venda": float(cols[9].strip()) if len(cols) > 9 else 0.0,
                        "quantidade": int(cols[10].strip()) if len(cols) > 10 and cols[10].strip().isdigit() else 1,
                        "condicao": cols[11].strip() if len(cols) > 11 else "Grau B - Bom Estado",
                        "status": "Disponível",
                        "foto_icone": "fa-cogs"
                    }
                    novas_pecas.append(item)

            elif json_items:
                for jitem in json_items:
                    item = {
                        "id": jitem.get("id", f"PC-SYNC-{len(pecas) + adicionados + 1:03d}"),
                        "codigo_oem": jitem.get("codigo_oem", "OEM-AUTO"),
                        "descricao": jitem.get("descricao", "Peça Importada via Sync"),
                        "categoria": jitem.get("categoria", "Mecânica"),
                        "veiculo_origem": jitem.get("veiculo_origem", "Importação Planilha"),
                        "estante_id": jitem.get("estante_id", "EST-01"),
                        "nivel": int(jitem.get("nivel", 2)),
                        "posicao": jitem.get("posicao", "N2-P01"),
                        "preco_custo": float(jitem.get("preco_custo", 0)),
                        "preco_venda": float(jitem.get("preco_venda", 0)),
                        "quantidade": int(jitem.get("quantidade", 1)),
                        "condicao": jitem.get("condicao", "Grau B - Bom Estado"),
                        "status": "Disponível",
                        "foto_icone": jitem.get("foto_icone", "fa-cogs")
                    }
                    novas_pecas.append(item)

            # Deduplicação e merge
            for nova in novas_pecas:
                oem = nova.get("codigo_oem")
                if oem in existentes_oem:
                    # Atualiza peça existente (preço, quantidade)
                    idx = existentes_oem[oem]
                    pecas[idx]["preco_venda"] = nova.get("preco_venda", pecas[idx]["preco_venda"])
                    pecas[idx]["preco_custo"] = nova.get("preco_custo", pecas[idx].get("preco_custo", 0))
                    pecas[idx]["quantidade"] = nova.get("quantidade", pecas[idx].get("quantidade", 1))
                    atualizados += 1
                else:
                    nova["id"] = f"PC-SYNC-{len(pecas) + 1:03d}"
                    pecas.append(nova)
                    existentes_oem[oem] = len(pecas) - 1
                    adicionados += 1
                    # Atualiza ocupação da estante
                    for e in db.get("estantes", []):
                        if e.get("id") == nova.get("estante_id"):
                            e["ocupacao"] = min(e.get("capacidade_max", 50), e.get("ocupacao", 0) + 1)
                            break

            # Log de auditoria
            log_entry = {
                "id": f"SYNC-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "data_hora": datetime.now().isoformat(),
                "origem": "Arquivo CSV" if csv_text else "JSON API",
                "itens_adicionados": adicionados,
                "itens_atualizados": atualizados,
                "status": "SUCESSO",
                "mensagem": f"Sincronização processada: {adicionados} novos, {atualizados} atualizados no inventário."
            }
            historico.insert(0, log_entry)

            db["pecas_estoque"] = pecas
            db["sync_historico"] = historico
            save_db(db)

            return self._send_json({
                "success": True,
                "adicionados": adicionados,
                "atualizados": atualizados,
                "total_pecas": len(pecas),
                "log": log_entry
            }, status=201)

        if path == "/api/fiscal/emitir":
            notas = db.get("notas_fiscais", [])
            proximo_num = len(notas) + 843
            modelo = payload.get("modelo", "55")
            tipo_op = payload.get("tipo_operacao", "SAIDA")
            natureza = payload.get("natureza_operacao", "Venda de Autopeças Usadas (Lei 12.977/2014)")
            
            chave = gerar_chave_acesso(
                uf="53",
                cnpj="44628855000137",
                mod=modelo,
                serie="001",
                n_nf=proximo_num
            )
            protocolo = f"153260{proximo_num:06d}{datetime.now().strftime('%H%M%S')}"
            
            dest = payload.get("destinatario", {
                "nome": "Consumidor Final",
                "documento": "000.000.000-00",
                "tipo_doc": "CPF",
                "ie": "ISENTO",
                "endereco": "Balcão Presencial"
            })
            
            itens = payload.get("itens", [])
            v_prod = sum(float(it.get("valor_total", 0)) for it in itens)
            tem_diferido = any(it.get("icms_diferido", False) for it in itens)
            
            base_icms = v_prod if not tem_diferido and modelo == "55" else 0.0
            v_icms = round(base_icms * 0.18, 2) if not tem_diferido and modelo == "55" else 0.0
            
            obs = payload.get("observacoes_fiscais", "")
            if tem_diferido and "392" not in obs:
                obs += " | ICMS DIFERIDO CONFORME ART. 392 DO RICMS/SP (DECRETO 45.490/2000)."
                
            nova_nota = {
                "id": f"{'NFCE' if modelo == '65' else 'NFE'}-{proximo_num:06d}",
                "numero": proximo_num,
                "serie": "001",
                "modelo": modelo,
                "tipo_operacao": tipo_op,
                "natureza_operacao": natureza,
                "chave_acesso": chave,
                "protocolo_sefaz": protocolo,
                "data_emissao": datetime.now().isoformat(),
                "status": "AUTORIZADA",
                "emitente": {
                    "razao_social": "FERRO VELHO DO PAULINHO LTDA",
                    "nome_fantasia": "Ferro Velho Paulinho",
                    "cnpj": "44.628.855/0001-37",
                    "ie": "07.982.114/001-20",
                    "cnae": "4530-7/04",
                    "endereco": "Quadra Qn 425 Cj I Lt 1 - Samambaia Norte (Samambaia)",
                    "cep": "72.327-509",
                    "municipio": "Brasília",
                    "uf": "DF"
                },
                "destinatario": dest,
                "itens": itens,
                "totais": {
                    "valor_produtos": round(v_prod, 2),
                    "base_icms": round(base_icms, 2),
                    "valor_icms": round(v_icms, 2),
                    "valor_frete": 0.0,
                    "valor_total": round(v_prod, 2)
                },
                "forma_pagamento": payload.get("forma_pagamento", "PIX"),
                "observacoes_fiscais": obs.strip()
            }
            
            xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe{chave}" versao="4.00">
      <ide>
        <cUF>53</cUF>
        <cNF>{chave[35:43]}</cNF>
        <natOp>{natureza}</natOp>
        <mod>{modelo}</mod>
        <serie>1</serie>
        <nNF>{proximo_num}</nNF>
        <dhEmi>{nova_nota['data_emissao']}</dhEmi>
        <tpNF>{'0' if tipo_op == 'ENTRADA' else '1'}</tpNF>
        <idDest>1</idDest>
        <cMunFG>5300108</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>1</tpEmis>
        <cDV>{chave[43]}</cDV>
        <tpAmb>1</tpAmb>
        <finNFe>1</finNFe>
      </ide>
      <emit>
        <CNPJ>44628855000137</CNPJ>
        <xNome>FERRO VELHO DO PAULINHO LTDA</xNome>
        <xFant>Ferro Velho Paulinho</xFant>
        <IE>0798211400120</IE>
        <CRT>1</CRT>
        <CNAE>4530704</CNAE>
      </emit>
      <dest>
        <CPF>{dest.get('documento', '').replace('.', '').replace('-', '')}</CPF>
        <xNome>{dest.get('nome', '')}</xNome>
      </dest>
      <total>
        <ICMSTot>
          <vBC>{nova_nota['totais']['base_icms']:.2f}</vBC>
          <vICMS>{nova_nota['totais']['valor_icms']:.2f}</vICMS>
          <vProd>{nova_nota['totais']['valor_produtos']:.2f}</vProd>
          <vNF>{nova_nota['totais']['valor_total']:.2f}</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
  <protNFe versao="4.00">
    <infProt>
      <tpAmb>1</tpAmb>
      <verAplic>SP_NFE_PL_009_V4</verAplic>
      <chNFe>{chave}</chNFe>
      <dhRecbto>{nova_nota['data_emissao']}</dhRecbto>
      <nProt>{protocolo}</nProt>
      <digVal>zFqA7vB6gY==</digVal>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>"""
            nova_nota["xml"] = xml_content
            
            notas.insert(0, nova_nota)
            db["notas_fiscais"] = notas
            save_db(db)
            return self._send_json({"success": True, "nota": nova_nota}, status=201)

        if path == "/api/clientes":
            clientes = db.get("clientes", [])
            novo_id = f"CLI-{len(clientes) + 1:03d}"
            payload["id"] = novo_id
            payload["data_cadastro"] = datetime.now().strftime("%Y-%m-%d")
            payload["total_gasto"] = float(payload.get("total_gasto", 0.0))
            payload["qtd_servicos"] = int(payload.get("qtd_servicos", 0))
            payload["retorno_status"] = "EM_DIA"
            clientes.insert(0, payload)
            db["clientes"] = clientes
            save_db(db)
            return self._send_json({"success": True, "cliente": payload}, status=201)

        if path == "/api/ordens-servico":
            ordens = db.get("ordens_servico", [])
            novo_id = f"OS-2026-{len(ordens) + 1045}"
            payload["id"] = novo_id
            payload["data_abertura"] = datetime.now().strftime("%Y-%m-%d")
            
            # Cálculo de totais
            v_pecas = sum(float(p.get("valor_total", 0)) for p in payload.get("itens_pecas", []))
            v_serv = sum(float(s.get("valor_total", 0)) for s in payload.get("itens_servicos", []))
            desc = float(payload.get("desconto", 0.0))
            payload["valor_pecas"] = round(v_pecas, 2)
            payload["valor_servicos"] = round(v_serv, 2)
            payload["valor_total"] = round(v_pecas + v_serv, 2)
            payload["valor_liquido"] = round(max(0, (v_pecas + v_serv) - desc), 2)
            
            if payload.get("status") == "FINALIZADA" or payload.get("status") == "CONCLUIDO":
                payload["data_conclusao"] = datetime.now().strftime("%Y-%m-%d")

            # Atualizar cliente se existir
            cli_id = payload.get("cliente_id")
            for c in db.get("clientes", []):
                if c.get("id") == cli_id:
                    c["total_gasto"] = round(c.get("total_gasto", 0) + payload["valor_liquido"], 2)
                    c["qtd_servicos"] = c.get("qtd_servicos", 0) + 1
                    c["ultima_visita"] = payload["data_abertura"]
                    break

            # Se usar peças de estoque, dar baixa
            pecas_db = db.get("pecas_estoque", [])
            for p_item in payload.get("itens_pecas", []):
                p_id = p_item.get("id")
                for p in pecas_db:
                    if p.get("id") == p_id:
                        p["status"] = "Vendido"
                        break

            ordens.insert(0, payload)
            db["ordens_servico"] = ordens
            save_db(db)
            return self._send_json({"success": True, "ordem_servico": payload}, status=201)

        if path == "/api/ordens-servico/status":
            os_id = payload.get("id")
            novo_status = payload.get("status")
            ordens = db.get("ordens_servico", [])
            achou = None
            for os_item in ordens:
                if os_item.get("id") == os_id:
                    os_item["status"] = novo_status
                    if novo_status in ("CONCLUIDO", "FINALIZADA"):
                        os_item["data_conclusao"] = datetime.now().strftime("%Y-%m-%d")
                    achou = os_item
                    break
            if achou:
                db["ordens_servico"] = ordens
                save_db(db)
                return self._send_json({"success": True, "ordem_servico": achou})
            return self._send_json({"error": "Ordem de serviço não encontrada"}, status=404)

        if path == "/api/financeiro/contas":
            contas = db.get("contas_financeiro", [])
            tipo = payload.get("tipo", "PAGAR")
            prefix = "CP" if tipo == "PAGAR" else "CR"
            novo_id = f"{prefix}-{len(contas) + 1:03d}"
            payload["id"] = novo_id
            if "status" not in payload:
                payload["status"] = "PENDENTE" if tipo == "PAGAR" else "A_RECEBER"
            contas.insert(0, payload)
            db["contas_financeiro"] = contas
            save_db(db)
            return self._send_json({"success": True, "conta": payload}, status=201)

        if path == "/api/financeiro/liquidar":
            conta_id = payload.get("id")
            contas = db.get("contas_financeiro", [])
            achou = None
            for c in contas:
                if c.get("id") == conta_id:
                    c["status"] = "PAGO" if c.get("tipo") == "PAGAR" else "RECEBIDO"
                    c["data_pagamento"] = datetime.now().strftime("%Y-%m-%d")
                    achou = c
                    break
            if achou:
                db["contas_financeiro"] = contas
                save_db(db)
                return self._send_json({"success": True, "conta": achou})
            return self._send_json({"error": "Conta financeira não encontrada"}, status=404)

        self.send_error(404, "Endpoint POST não encontrado")

def run(port=8080):
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, GestaoHandler)
    print("================================================================")
    print("Paulinho Gestao - Ferro Velho & Auto Desmanche Rodando!")
    print(f"Servidor ativo em: http://localhost:{port}")
    print("================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado com sucesso.")

if __name__ == "__main__":
    run()
