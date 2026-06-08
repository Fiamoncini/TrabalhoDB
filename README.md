# Mercado NoSQL — Frontend

Frontend de um **e-commerce estilo marketplace** (inspirado no Mercado Livre),
feito em **React + Vite**. Faz parte do trabalho da disciplina de **Banco de
Dados NoSQL**: o catálogo usa produtos com o campo `atributos` flexível (que
muda conforme a categoria), evidenciando a modelagem orientada a documentos.

> Hoje o app roda **100% standalone com dados mock** (não precisa de backend nem
> MongoDB). A troca para a API real é feita apenas na camada de serviços
> (`src/services`), trocando o mock por chamadas HTTP.

## ✨ Funcionalidades

- **Catálogo** com grade de produtos, busca, filtro por categoria e por preço, e ordenação
- **Página de produto** com imagem, avaliação e tabela de **atributos** (schema flexível)
- **Carrinho** com quantidades, subtotais, total e resumo (persistido em `localStorage`)
- **Login / Cadastro** (autenticação mock) e rotas protegidas
- **Meus pedidos** (histórico criado ao finalizar a compra)
- Paleta azul + âmbar, tipografia Sora/Manrope e **animações com Motion**
- Layout responsivo

## 🧱 Stack

- React 19 + Vite
- React Router 7
- Motion (animações)
- Vitest + Testing Library (testes)

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (geralmente http://localhost:5173).

## 🧪 Testes

Desenvolvido com **TDD**. Para rodar a suíte:

```bash
npm test
```

> 83 testes cobrindo lógica (carrinho, filtros, formatação), serviços, contextos
> (Auth/Cart) e componentes/páginas.

## 📁 Estrutura

```
src/
├── components/   # Topbar, CategoryBar, ProdutoCard, Footer, ProtectedRoute
├── pages/        # Catalogo, ProdutoDetalhe, Carrinho, Login, Cadastro, MeusPedidos
├── context/      # AuthContext, CartContext
├── services/     # produtosService, pedidosService (camada de dados — troca p/ API aqui)
├── lib/          # carrinho, filtros, formato (lógica pura, testada)
├── mocks/        # produtos.js (dados de exemplo)
└── index.css     # design system (variáveis de cor, componentes)
```

## 🔌 Ligando na API real (futuro)

Os componentes nunca chamam a rede diretamente — usam `src/services`. Para
integrar com o backend (Express + MongoDB), basta trocar o corpo das funções de
`produtosService` / `pedidosService` por chamadas `axios` e usar o `AuthContext`
com `/auth/login` e `/auth/register`. Há uma instância axios pronta em
`src/api/client.js` (lê `VITE_API_URL`).
