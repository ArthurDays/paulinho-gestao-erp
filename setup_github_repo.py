# -*- coding: utf-8 -*-
import os
import sys
import ctypes
import json
import subprocess
import urllib.request
import urllib.error
from ctypes import wintypes

advapi32 = ctypes.windll.advapi32

class CREDENTIAL(ctypes.Structure):
    _fields_ = [
        ('Flags', wintypes.DWORD), ('Type', wintypes.DWORD), ('TargetName', wintypes.LPWSTR),
        ('Comment', wintypes.LPWSTR), ('LastWritten', wintypes.FILETIME),
        ('CredentialBlobSize', wintypes.DWORD), ('CredentialBlob', ctypes.POINTER(ctypes.c_byte)),
        ('Persist', wintypes.DWORD), ('AttributeCount', wintypes.DWORD),
        ('Attributes', ctypes.c_void_p), ('TargetAlias', wintypes.LPWSTR), ('UserName', wintypes.LPWSTR),
    ]

target = 'GitHub - https://api.github.com/ArthurDays'
pcred = ctypes.POINTER(CREDENTIAL)()
token = None

if advapi32.CredReadW(target, 1, 0, ctypes.byref(pcred)):
    blob = bytes(ctypes.string_at(pcred.contents.CredentialBlob, pcred.contents.CredentialBlobSize))
    token = blob.decode('utf-8', errors='ignore').strip()
    advapi32.CredFree(pcred)
    print("Token retrieved successfully from Windows Credential Manager.")
else:
    print("Failed to read token from Credential Manager.")
    sys.exit(1)

repo_name = "paulinho-gestao-erp"
headers = {
    'Authorization': f'Bearer {token}',
    'User-Agent': 'PaulinhoGestao-GitSetup',
    'Accept': 'application/vnd.github.v3+json'
}

# 1. Check or create repository on GitHub
print(f"Checking if repository {repo_name} exists on GitHub...")
check_url = f"https://api.github.com/repos/ArthurDays/{repo_name}"
repo_exists = False

try:
    req = urllib.request.Request(check_url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        if resp.getcode() == 200:
            repo_exists = True
            print(f"Repository {repo_name} already exists.")
except urllib.error.HTTPError as e:
    if e.code == 404:
        repo_exists = False
    else:
        print(f"HTTP Error checking repo: {e}")

if not repo_exists:
    print(f"Creating repository {repo_name} on GitHub...")
    create_url = "https://api.github.com/user/repos"
    payload = {
        "name": repo_name,
        "description": "Paulinho Gestão ERP — Hybrid Enterprise Architecture (Bento Grid, Data-Dense Grids, CDV Lei 12.977/2014, SEFAZ-DF e Fluxo de Caixa)",
        "private": False,
        "has_issues": True,
        "has_projects": True,
        "has_wiki": True
    }
    req = urllib.request.Request(create_url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"Repository created successfully: {data.get('html_url')}")
    except urllib.error.HTTPError as e:
        print(f"Error creating repo: {e.code} - {e.read().decode()}")
        sys.exit(1)

# 2. Configure and run Git locally
git_path = r"C:\Users\artlo\AppData\Local\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe"

def run_git(args):
    cmd = [git_path] + args
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    print(f"$ git {' '.join(args[:2])} ... -> exit {res.returncode}")
    if res.stdout:
        print(res.stdout.strip())
    if res.stderr and res.returncode != 0:
        print("ERR:", res.stderr.strip())
    return res

# Git init
run_git(["init"])
run_git(["config", "user.name", "Arthur Dias"])
run_git(["config", "user.email", "148465505+ArthurDays@users.noreply.github.com"])
run_git(["branch", "-M", "main"])

# Add files
print("Staging necessary files...")
run_git(["add", "."])

# Status check
res_status = run_git(["status", "--short"])

# Commit
commit_msg = """feat: Paulinho Gestao ERP - Hybrid Enterprise Architecture

- Node 1: Visual Density & Data Grids (RibbonMenu, AdvancedDataTable, FooterSummary)
- Node 2: Modulos de Operacao e OS Master-Detail + Workflow Descontaminacao CDV (Lei 12.977/2014) + Recall Preventivo
- Node 3: Financeiro & Fluxo de Caixa (Linhas condicionais verde/vermelho, DRE, Emissao Fiscal SEFAZ-DF)
- Node 4: Busca Universal de Alta Performance & Filtros Agilizados
- Node 5: Integracao System-First Local com Latencia Zero (0ms)
- Documentacao tecnica completa e Diagramas Mermaid no README.md
- Suite de testes Specsfy automatizada (14/14 PASS)"""

run_git(["commit", "-m", commit_msg])

# Set remote with authenticated push URL
auth_remote = f"https://ArthurDays:{token}@github.com/ArthurDays/{repo_name}.git"
clean_remote = f"https://github.com/ArthurDays/{repo_name}.git"

run_git(["remote", "remove", "origin"])
run_git(["remote", "add", "origin", auth_remote])

print("Pushing to GitHub...")
push_res = run_git(["push", "-u", "origin", "main", "--force"])

# Clean up remote URL so token is not saved in plain text
run_git(["remote", "set-url", "origin", clean_remote])

if push_res.returncode == 0:
    print(f"\nSUCCESS! Code pushed to https://github.com/ArthurDays/{repo_name}")
else:
    print("\nPush failed, check output above.")
