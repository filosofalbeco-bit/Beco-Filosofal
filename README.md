# 🪄 Beco FilosoFal Burguer

Sistema de pedidos temático Harry Potter para hamburgueria.  
Cardápio interativo (Mapa do Maroto), pedidos por mesa, painel garçom e fluxo PIX.

---

## Stack

- **Frontend**: HTML + CSS + JS puro (sem framework)
- **Banco de dados**: [Supabase](https://supabase.com) (PostgreSQL + API REST)
- **Hosting**: [Vercel](https://vercel.com)

---

## Deploy na Vercel

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) → Novo projeto
2. No painel SQL, rode o script em `docs/supabase-schema.sql`
3. Anote sua **URL** e **anon key** (Settings → API)

### 2. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) → Novo projeto → Importar do GitHub
2. Repositório: `filosofalbeco-bit/Beco-Filosofal`
3. Em **Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | chave anon pública |
| `PIX_CHAVE` | sua chave PIX real |
| `PIX_NOME` | nome da conta PIX |
| `WPP_NUM` | `55DD999999999` (WhatsApp) |
| `ADMIN_SENHA` | senha do painel garçom |

> ⚠️ **Importante**: as variáveis acima são públicas (front-end).  
> Nunca coloque chaves privadas aqui. A `SUPABASE_ANON_KEY` é segura para o front-end — ela é a chave pública de leitura/escrita com as regras RLS que você configura.

4. Clique em **Deploy**

### 3. Configurar o config.js (alternativa sem variáveis de build)

Se preferir configurar manualmente antes do deploy, edite `js/config.js` com seus valores reais e faça push. **Não commite PIX ou WhatsApp reais em repositório público.**

---

## URLs especiais

| URL | Função |
|---|---|
| `/` | Site principal |
| `/?mesa=1` | Modo mesa 1 (cliente escaneia QR) |
| `/?mesa=2` | Modo mesa 2 |
| `/?painel=admin` | Painel do garçom (pede senha) |

---

## Melhorias planejadas

- [ ] Juramento do Mapa do Maroto (modal ao abrir cardápio)
- [ ] Toast "Malfeito, feito" ao enviar pedido para cozinha
- [ ] Botão "Encerrar Conta" como barra full-width
- [ ] Separação de roles ADM / Garçom via Supabase Auth
- [ ] QR codes por mesa via LIRA
- [ ] Integração InfinitePay via LIRA serverless

---

## Estrutura de arquivos

```
Beco-Filosofal/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Todos os estilos
├── js/
│   ├── config.js       # Variáveis de configuração
│   └── app.js          # Toda a lógica do sistema
├── docs/
│   └── supabase-schema.sql  # Schema do banco
├── vercel.json         # Configuração da Vercel
└── README.md
```
