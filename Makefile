# ═══════════════════════════════════════════════════════════════════
#  Makefile — Site Pessoal | Rafael Passos Domingues
#  Automação local: dev, build, preview, clean, deploy, check
# ═══════════════════════════════════════════════════════════════════

# Diretório do projeto Vite
APP_DIR := site-pessoal

# Cores para output legível
RESET  := \033[0m
BOLD   := \033[1m
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
RED    := \033[0;31m
CYAN   := \033[0;36m

.DEFAULT_GOAL := help

# ─────────────────────────────────────────────
# HELP — lista todos os targets com descrições
# ─────────────────────────────────────────────
.PHONY: help
help:
	@echo ""
	@echo "$(BOLD)$(CYAN)Site Pessoal — Rafael Passos Domingues$(RESET)"
	@echo "$(BLUE)──────────────────────────────────────────────────────────$(RESET)"
	@echo ""
	@echo "$(BOLD)Desenvolvimento:$(RESET)"
	@echo "  $(GREEN)make dev$(RESET)        → Inicia servidor local (http://localhost:3000)"
	@echo "  $(GREEN)make build$(RESET)      → Gera build de produção em $(APP_DIR)/dist/"
	@echo "  $(GREEN)make preview$(RESET)    → Serve o build de produção localmente"
	@echo ""
	@echo "$(BOLD)Manutenção:$(RESET)"
	@echo "  $(GREEN)make install$(RESET)    → Instala/atualiza dependências npm"
	@echo "  $(GREEN)make clean$(RESET)      → Remove dist/ e node_modules/"
	@echo "  $(GREEN)make reset$(RESET)      → clean + install"
	@echo ""
	@echo "$(BOLD)Deploy:$(RESET)"
	@echo "  $(GREEN)make deploy$(RESET)     → build + commit + push → GitHub Actions → gh-pages"
	@echo "  $(GREEN)make deploy-dry$(RESET) → Apenas faz o build sem publicar"
	@echo ""
	@echo "$(BOLD)Utilitários:$(RESET)"
	@echo "  $(GREEN)make check$(RESET)      → Verifica versões de node, npm e git"
	@echo "  $(GREEN)make status$(RESET)     → Git status resumido"
	@echo "  $(GREEN)make log$(RESET)        → Últimos 10 commits"
	@echo ""

# ─────────────────────────────────────────────
# DESENVOLVIMENTO
# ─────────────────────────────────────────────
.PHONY: dev
dev: _check-node
	@echo "$(CYAN)→ Iniciando servidor de desenvolvimento...$(RESET)"
	cd $(APP_DIR) && npm run dev

.PHONY: build
build: _check-node
	@echo "$(CYAN)→ Gerando build de produção...$(RESET)"
	cd $(APP_DIR) && npm run build
	@echo "$(GREEN)✓ Build concluído em $(APP_DIR)/dist/$(RESET)"

.PHONY: preview
preview: build
	@echo "$(CYAN)→ Servindo build de produção...$(RESET)"
	cd $(APP_DIR) && npm run preview

# ─────────────────────────────────────────────
# MANUTENÇÃO
# ─────────────────────────────────────────────
.PHONY: install
install: _check-node
	@echo "$(CYAN)→ Instalando dependências...$(RESET)"
	cd $(APP_DIR) && npm install
	@echo "$(GREEN)✓ Dependências instaladas.$(RESET)"

.PHONY: clean
clean:
	@echo "$(YELLOW)→ Removendo dist/ e node_modules/...$(RESET)"
	rm -rf $(APP_DIR)/dist
	rm -rf $(APP_DIR)/node_modules
	@echo "$(GREEN)✓ Limpeza concluída.$(RESET)"

.PHONY: reset
reset: clean install
	@echo "$(GREEN)✓ Reset completo.$(RESET)"

# ─────────────────────────────────────────────
# DEPLOY
# ─────────────────────────────────────────────
.PHONY: deploy
deploy: build
	@echo "$(CYAN)→ Preparando deploy...$(RESET)"
	@# Verifica se há algo para commitar
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "$(YELLOW)→ Há mudanças locais. Commitando...$(RESET)"; \
		git add -A; \
		git commit -m "deploy: $$(date '+%Y-%m-%d %H:%M') — build automático via Makefile"; \
	else \
		echo "$(BLUE)→ Nenhuma mudança local para commitar.$(RESET)"; \
	fi
	@echo "$(CYAN)→ Enviando para GitHub (dispara GitHub Actions)...$(RESET)"
	git push origin main
	@echo ""
	@echo "$(GREEN)$(BOLD)✓ Push realizado!$(RESET)"
	@echo "$(GREEN)  → GitHub Actions vai fazer o build e deploy automaticamente.$(RESET)"
	@echo "$(GREEN)  → Acompanhe em: https://github.com/passosdomingues/site/actions$(RESET)"

.PHONY: deploy-dry
deploy-dry: build
	@echo "$(GREEN)✓ Build de produção gerado. Nenhum deploy realizado (dry-run).$(RESET)"
	@echo "$(BLUE)  → Arquivos em: $(APP_DIR)/dist/$(RESET)"

# ─────────────────────────────────────────────
# UTILITÁRIOS
# ─────────────────────────────────────────────
.PHONY: check
check:
	@echo "$(BOLD)Verificando ambiente de desenvolvimento...$(RESET)"
	@echo ""
	@printf "  Node.js:  "; node --version 2>/dev/null || echo "$(RED)NÃO ENCONTRADO$(RESET)"
	@printf "  npm:      "; npm --version 2>/dev/null || echo "$(RED)NÃO ENCONTRADO$(RESET)"
	@printf "  git:      "; git --version 2>/dev/null || echo "$(RED)NÃO ENCONTRADO$(RESET)"
	@echo ""
	@echo "$(BOLD)Branch atual:$(RESET) $$(git branch --show-current 2>/dev/null || echo 'N/A')"
	@echo "$(BOLD)Último commit:$(RESET) $$(git log -1 --pretty=format:'%h %s' 2>/dev/null || echo 'N/A')"
	@echo ""

.PHONY: status
status:
	@echo "$(BOLD)Git Status:$(RESET)"
	@git status --short

.PHONY: log
log:
	@git log --oneline --graph -10

# ─────────────────────────────────────────────
# INTERNOS (prefixo _ = não aparecem no help)
# ─────────────────────────────────────────────
.PHONY: _check-node
_check-node:
	@node --version > /dev/null 2>&1 || (echo "$(RED)Erro: Node.js não encontrado. Instale em https://nodejs.org$(RESET)" && exit 1)
	@[ -f "$(APP_DIR)/package.json" ] || (echo "$(RED)Erro: $(APP_DIR)/package.json não encontrado.$(RESET)" && exit 1)
	@[ -d "$(APP_DIR)/node_modules" ] || (echo "$(YELLOW)Aviso: node_modules não encontrado. Rodando npm install...$(RESET)" && $(MAKE) install)
