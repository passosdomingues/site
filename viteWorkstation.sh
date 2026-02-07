#!/bin/bash

# --- Funções de Cor para Saídas ---
print_info() {
    printf "\n\e[1;34m%s\e[0m\n" "$1"
}
print_success() {
    printf "\e[1;32m%s\e[0m\n" "$1"
}
print_warning() {
    printf "\e[1;33m%s\e[0m\n" "$1"
}
print_error() {
    printf "\e[1;31m%s\e[0m\n" "$1"
}
print_command() {
    printf "\e[2;37m\$ %s\e[0m\n" "$1"
}

# --- Início do Script ---
clear
print_info "==============================================="
print_info "  🚀 Script de Configuração de Ambiente Vite  "
print_info "==============================================="

# PASSO 1: Ativar o NVM na sessão atual do terminal
print_info "\n[PASSO 1 de 5] Ativando o NVM..."
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
    print_success "NVM ativado com sucesso para esta sessão."
else
    print_error "Erro: Não foi possível encontrar o script do NVM."
    print_warning "Certifique-se de ter instalado o NVM corretamente."
    exit 1
fi

# PASSO 2: Instalar e usar a versão LTS mais recente do Node.js
print_info "\n[PASSO 2 de 5] Instalando a versão LTS do Node.js..."
print_command "nvm install --lts"
nvm install --lts
print_command "nvm use --lts"
nvm use --lts
NODE_VERSION=$(node -v)
print_success "Node.js instalado e em uso! Versão atual: $NODE_VERSION"

# PASSO 3: Limpar o projeto anterior e configurar o NPM
print_info "\n[PASSO 3 de 5] Limpando e configurando..."
PROJECT_DIR="site-pessoal"
if [ -d "$PROJECT_DIR" ]; then
    print_command "rm -rf $PROJECT_DIR"
    rm -rf "$PROJECT_DIR"
    print_warning "Diretório '$PROJECT_DIR' antigo removido."
fi
print_command "npm config set strict-ssl true"
npm config set strict-ssl true
print_success "Configuração do NPM restaurada para 'strict-ssl=true'."

# PASSO 4: Criar o novo projeto Vite
print_info "\n[PASSO 4 de 5] Criando o projeto Vite..."
print_command "npm create vite@latest $PROJECT_DIR -- --template vanilla"
npm create vite@latest "$PROJECT_DIR" -- --template vanilla

# Verifica se o diretório do projeto foi criado
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "A criação do projeto Vite falhou. Por favor, verifique os erros acima."
    exit 1
fi

# PASSO 5: Criar o arquivo .gitignore
print_info "\n[PASSO 5 de 5] Criando o arquivo .gitignore..."
GITIGNORE_FILE="$PROJECT_DIR/.gitignore"
print_command "cd $PROJECT_DIR && touch .gitignore"
cd "$PROJECT_DIR"
cat > .gitignore << EOL
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Arquivos de ambiente local
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Dependências
node_modules
/dist
/build

# Cache de editores de código
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea
.DS_Store

# Vite
.vite/
EOL
print_success "Arquivo .gitignore criado com sucesso dentro de '$PROJECT_DIR/'."

# --- Conclusão ---
print_info "\n======================================================="
print_success "🎉 Ambiente pronto! Seu projeto Vite está configurado."
print_info "======================================================="
print_warning "\nPróximos passos:"
echo "1. Navegue para o diretório do projeto: cd $PROJECT_DIR"
echo "2. Inicie o servidor de desenvolvimento: npm run dev"
echo "3. Comece a desenvolver!"