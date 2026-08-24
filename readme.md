#  E-commerce — Projeto Freelancer

> Plataforma de e-commerce desenvolvida sob demanda para um cliente, com catálogo de produtos, autenticação de usuários, gerenciamento administrativo, checkout e integração com o Mercado Pago.

Projeto desenvolvido como trabalho freelancer, com foco na criação de uma solução de comércio eletrônico funcional, responsiva e preparada para operação real.

A aplicação possui backend desenvolvido em **Node.js/Express**, banco de dados **PostgreSQL**, autenticação baseada em sessão, gerenciamento de produtos e integração com a API do **Mercado Pago** para criação de pedidos, checkout e atualização do status dos pagamentos.

> **Nota sobre o projeto:** este repositório foi disponibilizado como parte do meu portfólio profissional. Informações confidenciais do cliente, credenciais, chaves de API, dados reais de compradores e outros dados sensíveis não fazem parte do código público.

---

#  Sumário

* [Sobre o Projeto](#-sobre-o-projeto)
* [Demonstração](#-demonstração)
* [Contexto do Projeto](#-contexto-do-projeto)
* [Principais Funcionalidades](#-principais-funcionalidades)
* [Arquitetura do Projeto](#-arquitetura-do-projeto)
* [Fluxo da Aplicação](#-fluxo-da-aplicação)
  * [Cadastro de Usuário](#cadastro-de-usuário)
  * [Login](#login)
  * [Catálogo de Produtos](#catálogo-de-produtos)
  * [Gerenciamento de Produtos](#gerenciamento-de-produtos)
  * [Criação do Pedido](#criação-do-pedido)
  * [Checkout com Mercado Pago](#checkout-com-mercado-pago)
  * [Webhook de Pagamento](#webhook-de-pagamento)
* [Integração com Mercado Pago](#-integração-com-mercado-pago)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Estrutura de Pastas](#-estrutura-de-pastas)
* [Instalação](#-instalação)
* [Configuração do Ambiente](#-configuração-do-ambiente)
* [Banco de Dados](#-banco-de-dados)
* [Executando o Projeto](#-executando-o-projeto)
* [Documentação da API](#-documentação-da-api)
  * [Autenticação](#autenticação)
  * [Produtos](#produtos)
  * [Pedidos e Pagamentos](#pedidos-e-pagamentos)
* [Segurança](#-segurança)
* [Privacidade e Proteção de Dados](#-privacidade-e-proteção-de-dados)
* [Testes](#-testes)
* [Melhorias Futuras](#-melhorias-futuras)
* [Considerações sobre o Projeto Freelancer](#-considerações-sobre-o-projeto-freelancer)
* [Licença](#-licença)
* [Autor](#-autor)

---

#  Sobre o Projeto

Este projeto foi desenvolvido como uma solução personalizada de e-commerce para um cliente.

O objetivo foi construir uma plataforma capaz de disponibilizar produtos, permitir o cadastro e autenticação de clientes, gerenciar o catálogo através de uma área administrativa e processar pedidos utilizando o Mercado Pago.

A aplicação foi estruturada separando responsabilidades entre **rotas, controllers, models, middlewares e camada de configuração**, permitindo manutenção e evolução futuras.

O backend utiliza PostgreSQL para persistência dos dados e Express Session para gerenciamento das sessões dos usuários.

O projeto também possui integração com o Mercado Pago para criação de preferências de pagamento, consulta de pagamentos e recebimento de notificações através de webhook.

---

#  Principais Funcionalidades

##  E-commerce

* ✔ Catálogo de produtos
* ✔ Página individual de produto
* ✔ Exibição de preço e estoque
* ✔ Produtos ativos/inativos
* ✔ Controle de estoque
* ✔ Preço promocional
* ✔ Descrição detalhada do produto
* ✔ Ficha técnica
* ✔ Sistema de checkout
* ✔ Criação de pedidos

##  Usuários

* ✔ Cadastro de usuários
* ✔ Login
* ✔ Logout
* ✔ Autenticação baseada em sessão
* ✔ Hash de senhas utilizando bcrypt
* ✔ Validação de dados
* ✔ Perfil do usuário

##  Administração

* ✔ Cadastro de produtos
* ✔ Edição de produtos
* ✔ Exclusão lógica de produtos
* ✔ Ativação/desativação de produtos
* ✔ Controle de estoque
* ✔ Gerenciamento de pedidos
* ✔ Consulta do status dos pagamentos

A exclusão de produtos é feita de maneira lógica, mantendo o registro no banco para preservar a integridade do histórico de pedidos.

##  Pagamentos

* ✔ Integração com Mercado Pago
* ✔ Criação de preferência de pagamento
* ✔ Checkout externo do Mercado Pago
* ✔ Registro do pedido no PostgreSQL
* ✔ Armazenamento do `preference_id`
* ✔ Armazenamento do `payment_id`
* ✔ Consulta de pagamento
* ✔ Webhook para atualização do status
* ✔ Consulta do status de pagamento por pedido

---

#  Demonstração

> As imagens abaixo representam a interface desenvolvida para o projeto.

## Página inicial / Loja

![Loja](./docs/lojadomecanico.png)

## Página de produto

![Produto](./docs/produto.png)

## Carrinho

![Cart](./docs/cart.PNG)

## Identificação 1/2

![Cart](./docs/cart.%20identificação.png)

## Identificação 2/2

![Cart](./docs/ident2.png)


## Cadastro

![Cadastro](./docs/continuarcompra.PNG)



> Caso os nomes das imagens sejam diferentes no repositório, ajuste os caminhos acima para corresponder aos arquivos presentes na pasta `docs`.

---

#  Contexto do Projeto

Este projeto possui uma característica diferente de projetos acadêmicos, experimentais ou fictícios.

Ele foi desenvolvido **sob demanda para um cliente**, seguindo requisitos definidos para uma operação de e-commerce.

Durante o desenvolvimento foram consideradas necessidades como:

* experiência de compra;
* gerenciamento de produtos;
* controle de estoque;
* cadastro e autenticação;
* processamento de pedidos;
* integração com gateway de pagamento;
* atualização do status de pagamentos;
* armazenamento estruturado dos dados;
* segurança das credenciais;
* possibilidade de manutenção e evolução futura.

Por questões de **confidencialidade**, informações específicas sobre o cliente, regras internas do negócio, credenciais, dados reais de usuários e configurações privadas não são disponibilizadas neste repositório.

---

#  Arquitetura do Projeto

```text
                     ┌─────────────────────┐
                     │       Cliente       │
                     │      Navegador      │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │      Frontend       │
                     │ HTML / CSS / JS     │
                     └──────────┬──────────┘
                                │ HTTP
                                ▼
                     ┌─────────────────────┐
                     │   API Node.js      │
                     │      Express       │
                     └──────────┬──────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
       ┌─────────────┐   ┌─────────────┐   ┌──────────────┐
       │ Middleware  │   │ Controllers │   │    Routes    │
       │ Auth/Sec.   │   │             │   │              │
       └─────────────┘   └──────┬──────┘   └──────────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │     PostgreSQL      │
                     │                     │
                     │ users               │
                     │ session             │
                     │ produtos            │
                     │ pedidos             │
                     └─────────────────────┘
                                │
                                │
                                ▼
                     ┌─────────────────────┐
                     │    Mercado Pago     │
                     │                     │
                     │ Checkout            │
                     │ Payments            │
                     │ Webhooks            │
                     └─────────────────────┘
```

---

#  Fluxo da Aplicação

## Pipeline Base

As requisições seguem aproximadamente o seguinte fluxo:

```text
Cliente
   ↓
Express
   ↓
Middlewares
   ↓
Routes
   ↓
Controller
   ↓
PostgreSQL / API externa
   ↓
Resposta HTTP
```

---

## Cadastro de Usuário

`POST /auth/register`

```text
Cliente
   ↓
Validação
   ↓
Auth Route
   ↓
Verificação de usuário existente
   ↓
bcrypt
   ↓
User Model
   ↓
PostgreSQL
   ↓
Criação da sessão
   ↓
Resposta HTTP
```

O cadastro utiliza `bcrypt` para armazenar o hash da senha e cria uma sessão para o usuário após o registro.

---

## Login

`POST /auth/login`

```text
Cliente
   ↓
Validação
   ↓
Auth Route
   ↓
Busca usuário
   ↓
bcrypt.compare()
   ↓
Regeneração da sessão
   ↓
Session Cookie
   ↓
Resposta HTTP
```

A sessão é regenerada durante o login para reduzir o risco de **session fixation**.

---

## Catálogo de Produtos

`GET /produtos`

```text
Cliente
   ↓
Produtos Route
   ↓
Produto Controller
   ↓
PostgreSQL
   ↓
Produtos ativos
   ↓
JSON
```

O endpoint permite retornar os produtos disponíveis para a loja, enquanto a aplicação também possui suporte à consulta dos produtos para gerenciamento administrativo.

---

## Gerenciamento de Produtos

As operações principais são:

```text
POST   /produtos
GET    /produtos
GET    /produtos/:id
PUT    /produtos/:id
DELETE /produtos/:id
```

O controller realiza operações de criação, consulta, atualização e exclusão lógica dos produtos.

---

## Criação do Pedido

`POST /pedidos`

```text
Cliente
   ↓
Checkout
   ↓
API
   ↓
Validação dos dados
   ↓
PostgreSQL
   ↓
Pedido criado
   ↓
Preference ID
```

Os pedidos armazenam informações necessárias para o processamento da compra, incluindo identificação do cliente, valor total, informações de contato e endereço de entrega.

---

## Checkout com Mercado Pago

`POST /preferencia`

```text
Cliente
   ↓
Checkout
   ↓
Backend
   ↓
Mercado Pago API
   ↓
Criação da preferência
   ↓
Checkout URL
   ↓
Cliente
```

A aplicação utiliza o backend para criar a preferência de pagamento e disponibilizar ao cliente o fluxo de checkout do Mercado Pago.

---

## Webhook de Pagamento

`POST /webhook`

```text
Mercado Pago
      ↓
Webhook
      ↓
Backend
      ↓
Consulta do pagamento
      ↓
Identificação do pedido
      ↓
Atualização do status
      ↓
PostgreSQL
```

O sistema disponibiliza um endpoint específico para receber notificações de alteração de status dos pagamentos.

---

# 💳 Integração com Mercado Pago

A integração com o Mercado Pago é responsável pelo fluxo de pagamento do e-commerce.

Principais operações implementadas:

| Operação                   | Endpoint                       |
| -------------------------- | ------------------------------ |
| Criar pedido               | `POST /pedidos`                |
| Criar preferência          | `POST /preferencia`            |
| Receber webhook            | `POST /webhook`                |
| Consultar pagamento        | `GET /pagamento/:id`           |
| Consultar status do pedido | `GET /pedido/:pedidoId/status` |
| Listar pedidos             | `GET /pedidos`                 |

O projeto mantém no banco identificadores como `preference_id` e `payment_id`, permitindo relacionar os pagamentos aos pedidos.

> **Importante:** credenciais de produção e tokens de acesso ao Mercado Pago não são armazenados no código-fonte público.

---

#  Tecnologias Utilizadas

## Backend

* Node.js
* Express.js
* PostgreSQL
* `pg`
* Express Session
* `connect-pg-simple`
* bcrypt
* express-validator
* express-rate-limit
* Helmet
* CORS
* dotenv
* sanitize-html
* xss

## Pagamentos

* Mercado Pago SDK
* Webhooks
* API de pagamentos

## Frontend

* HTML5
* CSS3
* JavaScript
* Interface responsiva

## Ferramentas

* Git
* GitHub
* VS Code
* Postman

O `package.json` do projeto inclui, entre outras dependências, Express 5, PostgreSQL, bcrypt, Helmet, rate limiting, Mercado Pago, validação e sanitização de entradas.

---

#  Estrutura de Pastas

```text
ecommerce-freelancer
│
├── config
│   └── dbpg.js
│
├── controllers
│   ├── mercadopagoController.js
│   └── produtoController.js
│
├── middleware
│   ├── authMiddleware.js
│   ├── authtrue.js
│   ├── sanitize.js
│   └── validators.js
│
├── models
│   └── userModel.js
│
├── routes
│   ├── authRoutes.js
│   ├── Mercadopagoroutes.js
│   └── produtosRoutes.js
│
├── views
│   ├── 404.html
│   ├── adminprodutos.html
│   ├── login.html
│   ├── loja.html
│   ├── produto.html
│   ├── register.html
│   ├── singlecheckout.html
│   └── midia
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── schema.sql
├── server.js
└── README.md
```

A estrutura atual do repositório separa controllers, middleware, models, routes, views, configuração e schema do banco.

---

#  Instalação

## Pré-requisitos

Antes de iniciar, tenha instalado:

* Node.js 18+
* Git
* PostgreSQL
* Conta no Mercado Pago para configurar o ambiente de pagamento
* Editor de código, como VS Code

---

## Clonar o projeto

```bash
git clone https://github.com/rikael7/ecommerce-freelancer.git
```

Acesse a pasta:

```bash
cd ecommerce-freelancer
```

---

## Instalar dependências

```bash
npm install
```

As dependências são instaladas a partir do `package.json` existente no projeto.

---

#  Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
# Servidor
PORT= 3000  
NODE_ENV= development

# Sessão
SESSION_SECRET= troque-este-valor-por-uma-string-aleatoria-e-segura

# postgree
DATABASE_URL=


# Mercado pago
MP_ACCESS_TOKEN= seu_access_token do mercado pago para o server fazer a criação de preferencia
MP_WEBHOOK_SECRET= secret do webhook para validar se realmente vem do mercado pago
APP_URL= url do seu site #coloque a url usada em produção


```

> ⚠️ Os nomes das variáveis devem corresponder exatamente aos utilizados pelo código da aplicação.

> ⚠️ Nunca publique `.env`, tokens do Mercado Pago, senhas do banco ou outras credenciais no GitHub.

O repositório já possui um `.env.example` para auxiliar na configuração do ambiente.

---

#  Banco de Dados

O projeto utiliza **PostgreSQL**.

O schema completo está disponível em:

```text
schema.sql
```

Para executar:

```bash
psql -U seu_usuario -d seu_banco -f schema.sql
```

Também é possível executar o arquivo utilizando ferramentas como DBeaver ou pgAdmin.

## Principais tabelas

| Tabela     | Descrição                                    |
| ---------- | -------------------------------------------- |
| `users`    | Usuários e credenciais                       |
| `session`  | Sessões persistidas                          |
| `produtos` | Catálogo e estoque                           |
| `pedidos`  | Pedidos realizados e informações de checkout |

A estrutura de produtos possui campos como nome, descrição, preço, estoque, imagem e status de ativação. Os pedidos armazenam informações de pagamento e dados necessários ao processamento da compra.

---

#  Executando o Projeto

## Desenvolvimento

```bash
npm run dev
```

## Produção

```bash
npm start
```

O `package.json` atualmente utiliza `nodemon` no script de desenvolvimento e `node server.js` no script de produção.

Servidor:

```text
http://localhost:3000
```

---

# 📡 Documentação da API

## Autenticação

### Criar usuário

```http
POST /auth/register
```

Exemplo:

```json
{
  "name": "Usuário Teste",
  "email": "usuario@email.com",
  "password": "Senha123"
}
```

---

### Login

```http
POST /auth/login
```

Exemplo:

```json
{
  "email": "usuario@email.com",
  "password": "Senha123"
}
```

---

### Logout

```http
POST /auth/logout
```

---

# 📦 Produtos

| Método | Endpoint        | Descrição        |
| ------ | --------------- | ---------------- |
| GET    | `/produtos`     | Lista produtos   |
| GET    | `/produtos/:id` | Consulta produto |
| POST   | `/produtos`     | Cria produto     |
| PUT    | `/produtos/:id` | Atualiza produto |
| DELETE | `/produtos/:id` | Desativa produto |

Essas rotas estão implementadas em `produtosRoutes.js`.

---

# 🧾 Pedidos e Pagamentos

| Método | Endpoint                   | Descrição                        |
| ------ | -------------------------- | -------------------------------- |
| POST   | `/pedidos`                 | Cria pedido                      |
| POST   | `/preferencia`             | Cria preferência do Mercado Pago |
| POST   | `/webhook`                 | Recebe notificações de pagamento |
| GET    | `/pagamento/:id`           | Consulta pagamento               |
| GET    | `/pedido/:pedidoId/status` | Consulta status do pedido        |
| GET    | `/pedidos`                 | Lista pedidos                    |

Os endpoints estão centralizados na rota de integração com o Mercado Pago.

---

#  Segurança

O projeto utiliza diferentes mecanismos para reduzir riscos comuns em aplicações web:

* Hash de senhas utilizando **bcrypt**
* Autenticação baseada em sessão
* Regeneração da sessão durante o login
* Validação de dados utilizando `express-validator`
* Sanitização de entradas
* Proteção HTTP através do Helmet
* Rate limiting
* CORS
* Variáveis de ambiente para credenciais
* Separação entre frontend e backend
* Consultas parametrizadas no PostgreSQL
* Exclusão lógica de produtos
* Proteção das credenciais do Mercado Pago

A aplicação utiliza bibliotecas como Helmet, `express-rate-limit`, `express-validator`, `sanitize-html` e `xss`, além do bcrypt para proteção das credenciais.

> **Observação:** segurança de software é um processo contínuo. A presença desses mecanismos não significa que uma aplicação seja automaticamente invulnerável.

---

#  Privacidade e Proteção de Dados

Por se tratar de um **projeto desenvolvido para um cliente**, o tratamento de dados deve ser considerado dentro do contexto da operação comercial para a qual a aplicação foi desenvolvida.

O banco possui campos que podem representar dados pessoais fornecidos durante cadastro e checkout, incluindo:

* Nome
* E-mail
* Telefone
* CPF/CNPJ
* Data de nascimento
* CEP
* Estado
* Cidade
* Bairro
* Rua
* Número
* Complemento
* Ponto de referência

Esses campos fazem parte da estrutura de pedidos existente no banco de dados.

### Sobre este repositório

Este repositório público **não deve conter dados reais de clientes**.

Não devem ser publicados:

* Senhas;
* Tokens;
* Access Tokens do Mercado Pago;
* Chaves secretas;
* Dados reais de compradores;
* Dados reais de pedidos;
* Informações financeiras;
* Credenciais de banco de dados;
* Dados internos ou confidenciais do cliente.

### Política de Privacidade

A política de privacidade apresentada aos usuários finais deve pertencer ao **e-commerce/cliente responsável pela operação da loja**, informando, entre outros pontos:

* quais dados são coletados;
* finalidade do tratamento;
* utilização dos dados para processamento de pedidos;
* compartilhamento necessário com prestadores de serviço;
* utilização de serviços de pagamento;
* período de retenção;
* direitos dos titulares;
* canal de contato;
* utilização de cookies, quando aplicável.

> **Importante:** este README não constitui uma Política de Privacidade, Aviso de Cookies, Termos de Uso ou documento jurídico. Esses documentos devem ser definidos de acordo com a operação real do cliente e, quando necessário, revisados por profissional jurídico especializado.

---

# 🧪 Testes

Para executar os testes, caso estejam configurados no projeto:

```bash
npm test
```

> No estado atual do repositório, não há um script `test` definido no `package.json`.

---

#  Melhorias Futuras

* [ ] Implementar suíte de testes automatizados
* [ ] Documentar a API utilizando OpenAPI/Swagger
* [ ] Melhorar cobertura de testes de integração
* [ ] Implementar recuperação de senha
* [ ] Implementar confirmação de e-mail
* [ ] Evoluir o controle de permissões administrativas
* [ ] Melhorar auditoria de pedidos
* [ ] Implementar logs estruturados
* [ ] Implementar monitoramento da aplicação
* [ ] Melhorar documentação de deploy
* [ ] Implementar paginação no catálogo
* [ ] Implementar filtros avançados de produtos
* [ ] Evoluir o gerenciamento de categorias
* [ ] Melhorar o fluxo de atualização de estoque
* [ ] Implementar notificações de pedidos
* [ ] Melhorar documentação de webhooks
* [ ] Implementar CI/CD

---

#  Considerações sobre o Projeto Freelancer

Este projeto foi desenvolvido como **trabalho freelancer sob demanda**.

Diferentemente de um projeto pessoal ou acadêmico, algumas decisões técnicas foram tomadas considerando requisitos específicos do cliente, prazo, escopo contratado e necessidades reais do negócio.

Por esse motivo:

* determinadas funcionalidades podem ter sido desenvolvidas especificamente para o cenário do cliente;
* informações comerciais e internas podem ter sido omitidas;
* credenciais e configurações de produção não são disponibilizadas;
* dados reais de usuários e pedidos não fazem parte deste repositório público;
* alterações futuras podem depender do escopo de manutenção contratado.

### Propriedade e código-fonte

A disponibilização deste código no GitHub não deve ser interpretada automaticamente como autorização para reutilização comercial, cópia da solução ou utilização de dados, marcas e conteúdos pertencentes ao cliente.

O uso do código deve respeitar os termos de contratação, direitos do cliente, dependências utilizadas e licença definida neste repositório.

---

#  Como Contribuir

Por se tratar de um projeto desenvolvido sob demanda para um cliente, este repositório **não funciona como um projeto open source tradicional**.

Pull Requests e alterações externas podem não ser aceitos.

Caso exista interesse em discutir melhorias técnicas, correções ou reutilização de componentes, entre em contato com o autor.

---

#  Licença

Este projeto está atualmente identificado com a licença **ISC** no `package.json`.

Consulte o arquivo `package.json` e, caso necessário, adicione um arquivo `LICENSE` ao repositório para deixar os termos de utilização explícitos.

> **Importante:** como este é um trabalho freelancer, a licença pública do repositório deve ser compatível com o contrato firmado com o cliente e com os direitos sobre o código desenvolvido.

---

#  Autor

**Rikael Ribeiro de Araújo Moraes**

Desenvolvedor Full Stack

* GitHub: https://github.com/rikael7
* LinkedIn: https://linkedin.com/in/rikaeldev

---

## Sobre este projeto

Projeto desenvolvido profissionalmente sob demanda, demonstrando experiência prática com:

* Desenvolvimento Full Stack
* Node.js
* Express
* PostgreSQL
* APIs REST
* Autenticação
* Gerenciamento de sessões
* Integração com APIs externas
* Mercado Pago
* Webhooks
* Segurança de aplicações
* Desenvolvimento de e-commerce
* Modelagem de banco de dados
* Desenvolvimento orientado a requisitos de negócio

> Este repositório faz parte do meu portfólio profissional e apresenta uma implementação real desenvolvida em contexto de prestação de serviço.
