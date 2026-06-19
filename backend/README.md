# Mercado NoSQL — Backend (API)

API REST do e-commerce **Mercado NoSQL**, feita em **Node + Express + Mongoose**
sobre **MongoDB**, com autenticação **JWT** (senhas com hash via bcrypt).

É o backend que o frontend (React + Vite, na raiz do repositório) consome através
da camada `src/services`.

## 🧱 Stack

- Node.js (ESM) + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + `bcryptjs`
- `cors`, `dotenv`

## 📁 Estrutura

```
backend/
├── src/
│   ├── server.js              # entrada: conecta no banco e sobe o servidor
│   ├── app.js                 # monta o Express (rotas, cors, json, erros)
│   ├── config/db.js           # conexão com o MongoDB
│   ├── models/                # Usuario, Produto, Pedido (schemas Mongoose)
│   ├── middleware/            # auth (JWT) e tratamento de erros
│   ├── controllers/          # regras de auth, produtos e pedidos
│   ├── routes/               # /api/auth, /api/produtos, /api/pedidos
│   ├── utils/asyncHandler.js  # captura erros de handlers async
│   └── seed/                  # popula os produtos no banco
└── .env.example
```

## 🔌 Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/register` | — | Cria conta. Body: `{ nome, email, senha }` → `{ token, usuario }` |
| POST | `/api/auth/login` | — | Login. Body: `{ email, senha }` → `{ token, usuario }` |
| GET | `/api/produtos` | — | Lista. Query: `categoria`, `busca`, `ordenar` (`relevancia\|menor-preco\|maior-preco\|nome`) |
| GET | `/api/produtos/:id` | — | Detalhe de um produto (ex.: `/api/produtos/p01`) |
| POST | `/api/pedidos` | 🔒 Bearer | Cria pedido. Body: `{ itens: [...], enderecoEntrega? }` |
| GET | `/api/pedidos` | 🔒 Bearer | Lista os pedidos do usuário logado |
| GET | `/api/health` | — | Healthcheck |

Rotas protegidas (🔒) exigem o header `Authorization: Bearer <token>`.

## 🚀 Rodar localmente

Pré-requisito: ter um MongoDB acessível (instalado localmente **ou** uma URI do
MongoDB Atlas).

```bash
cd backend
npm install
cp .env.example .env      # no Windows (PowerShell): copy .env.example .env
# edite o .env e preencha MONGODB_URI e JWT_SECRET
npm run seed              # popula os 8 produtos no banco
npm run dev               # sobe a API em http://localhost:5000 (com reload)
```

Para produção: `npm start`.

## ☁️ Hospedar o banco (MongoDB Atlas)

1. Crie uma conta em https://www.mongodb.com/atlas e um cluster **free (M0)**.
2. Em **Database Access**, crie um usuário/senha do banco.
3. Em **Network Access**, libere o acesso: `0.0.0.0/0` (qualquer IP) — necessário
   para o Render conseguir conectar.
4. Em **Connect → Drivers**, copie a connection string. Ela fica assim:
   `mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/mercado_nosql`
   (acrescente `/mercado_nosql` antes do `?` para definir o nome do banco).

## ☁️ Hospedar a API (Render — Web Service)

1. No Render: **New → Web Service** e conecte o repositório `TrabalhoDB`.
2. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Em **Environment**, adicione as variáveis:
   - `MONGODB_URI` = a connection string do Atlas
   - `JWT_SECRET` = uma string aleatória longa
   - `CORS_ORIGIN` = a URL do frontend (ex.: `https://trabalhodb.onrender.com`)
4. Após o primeiro deploy, rode o seed **uma vez** (Render → Shell):
   `npm run seed`

Por fim, no **frontend** (static site), aponte `VITE_API_URL` para a URL da API:
`https://<sua-api>.onrender.com/api` e refaça o deploy.
