# Projeto completo – site final

Este repositório contém as três partes da aplicação:

- **loja** – frontend da loja (Vite + React)
- **admin** – painel de administração (Vite + React)
- **backend** – API Node (Vexopay + Supabase)

## Como rodar localmente

1. **Instalar dependências**
   ```bash
   cd "Área de trabalho/site final"
   npm install        # instala workspaces (loja, admin, backend)
   ```

2. **Configurar variáveis de ambiente**
   Copie os arquivos de exemplo e preencha com as suas chaves:
   ```bash
   cp loja/.env.example loja/.env
   cp admin/.env.example admin/.env
   cp backend/.env.example backend/.env
   ```

3. **Iniciar tudo** (duas opções)
   - **Separadamente** (cada tela em sua porta):
     ```bash
     cd loja && npm run dev   # http://localhost:8081
     cd ../admin && npm run dev   # http://localhost:8080
     cd ../backend && npm run dev   # http://localhost:3000
     ```
   - **De uma só vez** (usa workspaces):
     ```bash
     npm run dev-all
     ```

4. **Build de produção** (gerará pastas `dist/` em cada sub‑pasta):
   ```bash
   npm run build-all
   ```

## Deploy rápido (Vercel/Netlify)

- Conecte o repositório ao serviço.
- Defina **Root Directory** como `site final`.
- Use os scripts acima ou configure o build para cada sub‑pasta.

## Observação

Os arquivos `node_modules` não são versionados. Sempre execute `npm install` após clonar o repo.
