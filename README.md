# DJ The Source - Sistema de Eventos

Sistema completo de orçamento para locação de sonorização, iluminação, garçons, recepcionistas, DJs, decoradores e locação de salão.

## Estrutura do projeto

- `server/` - backend Node.js com Express
- `client/` - frontend React com Vite

## Funcionalidades

- Escolha de serviços por página dedicada
- Orçamento dinâmico baseado em horas, quantidade e convidados
- Cadastro de novos colaboradores com valor/hora editável
- Edição de valores de serviços e colaboradores
- Envio de orçamento por email ao organizador do evento
- Site responsivo com logo animado de moving head

## Comandos utilizados

```powershell
cd "c:\Users\salva\Documents\Ensino\Projeto - DJTHESOURCE- VERSÕES\Projeto versão NODE\24.06.26 - II\dj-the-source"

md server,client

cd server
npm init -y
npm install express cors nodemailer dotenv
npm install --save-dev nodemon

cd ..\client
npm create vite@latest . -- --template react
npm install react-router-dom

cd ..\server
npm install

cd ..\client
npm install
```

## Executar

```powershell
cd server
npm start

cd ..\client
npm run dev
```

## Configuração de email e Supabase

Copie `.env.example` para `.env` em `server/` e ajuste as variáveis SMTP.

Adicione também as variáveis Supabase:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Crie as tabelas no Supabase usando o arquivo `server/supabase-tables.sql`, ou execute as instruções no SQL Editor.

As tabelas necessárias são:

- `services`
- `clients`
- `quotes`

As colunas incluem campos como `id`, `title`, `description`, `rateLabel`, `unitLabel`, `basePrice`, `values`, `hourly`, `options`, `createdAt`, `quoteText`, `clientName`, `clientEmail`, `clientPhone`, `organizerEmail`, `password` e `email`.
