# Migração para Lovable - Guia de Configuração

## Passo 1: Criar Projeto Supabase

1. Acesse https://supabase.com e crie um novo projeto
2. Anote as credenciais:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (em Settings > API)
   - `SUPABASE_ANON_KEY` (em Settings > API)

## Passo 2: Executar Schema

1. No Supabase Dashboard, vá em **SQL Editor**
2. Copie o conteúdo de `supabase/schema.sql`
3. Execute o SQL

## Passo 3: Criar Edge Functions

Crie as seguintes funções em **Edge Functions**:

1. `get-metrics` - use o código em `supabase/functions/get-metrics/index.ts`
2. `capture-card` - use o código em `supabase/functions/capture-card/index.ts`
3. `log-event` - use o código em `supabase/functions/log-event/index.ts`

## Passo 4: Configurar Variáveis de Ambiente

No Supabase Dashboard, em **Edge Functions > Settings**, adicione:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `ENCRYPTION_KEY` (uma chave forte para criptografar cartões)

## Passo 5: Importar para Lovable

1. Acesse https://lovable.dev
2. Clique em **Import Project**
3. Selecione a pasta `lovable/` deste projeto
4. Configure as variáveis de ambiente no painel Lovable:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Diferenças da Stack Anterior

| Anterior |Novo (Lovable)|
|----------|-------------|
| Flask + SQLite | Supabase (PostgreSQL) |
| JWT manual | Supabase Auth |
| Dados sensíveis expostos | Criptografia AES-GCM |
| Rate limiting manual | Supabase built-in |
| HTML/CSS puro | React + Tailwind |

## afterword

 Após migrar, delete os arquivos antigos:
- `backend/`
- `database/`
- `venv/`