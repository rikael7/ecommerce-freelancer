-- =========================================================
-- E-COMMERCE FREELANCER
-- PostgreSQL Database Schema
--
-- Compatível com:
-- Node.js
-- Express
-- PostgreSQL
-- express-session
-- connect-pg-simple
-- Mercado Pago
--
-- =========================================================


-- =========================================================
-- EXTENSÕES
-- =========================================================

-- Não é obrigatória atualmente,
-- mas pode ser utilizada futuramente para UUIDs.
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =========================================================
-- FUNÇÃO GENÉRICA PARA updated_at
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =========================================================
-- USUÁRIOS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    email VARCHAR(254) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    bio TEXT,

    phone VARCHAR(30),

    avatar_url TEXT,

    -- Controle de administrador.
    -- Utilizado pelo middleware admin.
    adm BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_name
ON users(name);

CREATE INDEX IF NOT EXISTS idx_users_adm
ON users(adm);


-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- =========================================================
-- SESSÕES
-- =========================================================
--
-- O server.js utiliza:
--
-- connect-pg-simple
-- tableName: 'sessions'
--
-- Portanto a tabela correta é "sessions".
-- =========================================================

CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR NOT NULL,

    sess JSON NOT NULL,

    expire TIMESTAMP(6) NOT NULL,

    CONSTRAINT sessions_pkey
        PRIMARY KEY (sid)
);

CREATE INDEX IF NOT EXISTS idx_sessions_expire
ON sessions(expire);


-- =========================================================
-- PRODUTOS
-- =========================================================
--
-- Campos utilizados atualmente pelos controllers:
--
-- id
-- nome
-- descricao
-- ficha_tecnica
-- oferta_parcelado
-- preco
-- preco_antigo
-- desconto_percentual
-- estoque
-- imagem_url
-- ativo
-- criado_em
-- =========================================================

CREATE TABLE IF NOT EXISTS produtos (

    id SERIAL PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    descricao TEXT,

    ficha_tecnica TEXT,

    oferta_parcelado TEXT,

    preco NUMERIC(10,2) NOT NULL
        CHECK (preco >= 0),

    preco_antigo NUMERIC(10,2),

    desconto_percentual NUMERIC(5,2)
        CHECK (
            desconto_percentual IS NULL
            OR desconto_percentual >= 0
        ),

    estoque INTEGER NOT NULL DEFAULT 0
        CHECK (estoque >= 0),

    imagem_url TEXT,

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT produtos_preco_antigo_check
        CHECK (
            preco_antigo IS NULL
            OR preco_antigo > preco
        )
);


-- Índices
CREATE INDEX IF NOT EXISTS idx_produtos_nome
ON produtos(nome);

CREATE INDEX IF NOT EXISTS idx_produtos_ativo
ON produtos(ativo);

CREATE INDEX IF NOT EXISTS idx_produtos_estoque
ON produtos(estoque);


-- Trigger de atualização
DROP TRIGGER IF EXISTS trg_produtos_updated_at ON produtos;

CREATE TRIGGER trg_produtos_updated_at
BEFORE UPDATE ON produtos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- =========================================================
-- PEDIDOS
-- =========================================================
--
-- O pedido é criado antes da criação da preferência
-- do Mercado Pago.
--
-- Depois:
--
-- pedido
--   ↓
-- pedido_itens
--   ↓
-- Mercado Pago Preference
--   ↓
-- payment
-- =========================================================

CREATE TABLE IF NOT EXISTS pedidos (

    id SERIAL PRIMARY KEY,

    -- Pode ser NULL porque atualmente o controller
    -- não associa obrigatoriamente o pedido à sessão.
    cliente_id INTEGER,

    valor_total NUMERIC(10,2) NOT NULL
        CHECK (valor_total >= 0),

    status_pagamento VARCHAR(30) NOT NULL
        DEFAULT 'pendente',

    preference_id VARCHAR(100),

    payment_id VARCHAR(100),

    -- Dados do comprador
    nome_completo VARCHAR(150) NOT NULL,

    email VARCHAR(254) NOT NULL,

    cpf_cnpj VARCHAR(20) NOT NULL,

    telefone VARCHAR(30) NOT NULL,

    data_nascimento DATE,

    -- Endereço
    cep VARCHAR(9) NOT NULL,

    pais VARCHAR(60) NOT NULL
        DEFAULT 'Brasil',

    estado CHAR(2) NOT NULL,

    cidade VARCHAR(100) NOT NULL,

    bairro VARCHAR(100) NOT NULL,

    rua VARCHAR(150) NOT NULL,

    numero VARCHAR(15) NOT NULL,

    complemento VARCHAR(100),

    ponto_referencia VARCHAR(150),

    -- Destinatário
    nome_destinatario VARCHAR(150) NOT NULL,

    telefone_entrega VARCHAR(30) NOT NULL,

    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT pedidos_cliente_fk
        FOREIGN KEY (cliente_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- Índices
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id
ON pedidos(cliente_id);

CREATE INDEX IF NOT EXISTS idx_pedidos_preference_id
ON pedidos(preference_id);

CREATE INDEX IF NOT EXISTS idx_pedidos_payment_id
ON pedidos(payment_id);

CREATE INDEX IF NOT EXISTS idx_pedidos_status_pagamento
ON pedidos(status_pagamento);

CREATE INDEX IF NOT EXISTS idx_pedidos_criado_em
ON pedidos(criado_em);

CREATE INDEX IF NOT EXISTS idx_pedidos_email
ON pedidos(email);


-- Trigger atualizado_em
CREATE OR REPLACE FUNCTION set_pedido_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trg_pedidos_atualizado_em ON pedidos;

CREATE TRIGGER trg_pedidos_atualizado_em
BEFORE UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION set_pedido_atualizado_em();


-- =========================================================
-- ITENS DOS PEDIDOS
-- =========================================================
--
-- Cada pedido pode possuir vários produtos.
--
-- Exemplo:
--
-- Pedido 10
--   ├── Produto A x2
--   ├── Produto B x1
--   └── Produto C x3
--
-- O preço é copiado para esta tabela no momento
-- da criação do pedido.
--
-- Isso é importante porque o preço do produto pode
-- mudar posteriormente.
-- =========================================================

CREATE TABLE IF NOT EXISTS pedido_itens (

    id SERIAL PRIMARY KEY,

    pedido_id INTEGER NOT NULL,

    produto_id INTEGER NOT NULL,

    -- Snapshot do nome no momento da compra.
    titulo VARCHAR(150) NOT NULL,

    quantidade INTEGER NOT NULL
        CHECK (quantidade > 0),

    -- Snapshot do preço no momento da compra.
    preco NUMERIC(10,2) NOT NULL
        CHECK (preco >= 0),

    CONSTRAINT pedido_itens_pedido_fk
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
        ON DELETE CASCADE,

    CONSTRAINT pedido_itens_produto_fk
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE RESTRICT
);


CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido_id
ON pedido_itens(pedido_id);

CREATE INDEX IF NOT EXISTS idx_pedido_itens_produto_id
ON pedido_itens(produto_id);


-- =========================================================
-- PAGAMENTOS
-- =========================================================
--
-- Histórico/registro dos pagamentos recebidos do
-- Mercado Pago.
--
-- Um mesmo payment_id não pode aparecer duas vezes.
--
-- O webhook utiliza:
--
-- ON CONFLICT (payment_id)
-- DO UPDATE
-- =========================================================

CREATE TABLE IF NOT EXISTS pagamentos (

    id SERIAL PRIMARY KEY,

    pedido_id INTEGER NOT NULL,

    payment_id VARCHAR(100) NOT NULL UNIQUE,

    status VARCHAR(30) NOT NULL,

    valor NUMERIC(10,2),

    metodo VARCHAR(50),

    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT pagamentos_pedido_fk
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
        ON DELETE CASCADE
);


CREATE INDEX IF NOT EXISTS idx_pagamentos_pedido_id
ON pagamentos(pedido_id);

CREATE INDEX IF NOT EXISTS idx_pagamentos_status
ON pagamentos(status);


-- =========================================================
-- VÍDEOS
-- =========================================================
--
-- Existe código no userModel.js que utiliza esta tabela
-- através da função uploadVideo().
--
-- Atualmente essa funcionalidade não está conectada
-- às rotas principais do server.js, mas a tabela é mantida
-- para que o controller não dependa de uma tabela inexistente.
-- =========================================================

CREATE TABLE IF NOT EXISTS videos (

    id SERIAL PRIMARY KEY,

    titulo VARCHAR(150) NOT NULL,

    descricao TEXT,

    nome_arquivo VARCHAR(255) NOT NULL,

    tipo_arquivo VARCHAR(100) NOT NULL,

    tamanho BIGINT NOT NULL
        CHECK (tamanho >= 0),

    usuario_id INTEGER,

    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT videos_usuario_fk
        FOREIGN KEY (usuario_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


CREATE INDEX IF NOT EXISTS idx_videos_usuario_id
ON videos(usuario_id);


-- =========================================================
-- VIEWS AUXILIARES
-- =========================================================
--
-- Não são obrigatórias para o funcionamento atual.
-- Facilitam consultas administrativas.
-- =========================================================

CREATE OR REPLACE VIEW vw_pedidos_resumo AS
SELECT
    p.id,
    p.nome_completo,
    p.email,
    p.valor_total,
    p.status_pagamento,
    p.preference_id,
    p.payment_id,
    p.criado_em,
    COUNT(pi.id) AS quantidade_itens
FROM pedidos p
LEFT JOIN pedido_itens pi
    ON pi.pedido_id = p.id
GROUP BY
    p.id;


-- =========================================================
-- VERIFICAÇÃO FINAL DO SCHEMA
-- =========================================================

-- Usuários
-- SELECT * FROM users;

-- Produtos
-- SELECT * FROM produtos;

-- Pedidos
-- SELECT * FROM pedidos;

-- Itens
-- SELECT * FROM pedido_itens;

-- Pagamentos
-- SELECT * FROM pagamentos;

-- Sessões
-- SELECT * FROM sessions;

-- Vídeos
-- SELECT * FROM videos;