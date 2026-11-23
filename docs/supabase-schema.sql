-- =====================================================
-- BECO FILOSOFAL BURGUER — Schema do Supabase
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Tabela de pedidos de mesa
CREATE TABLE IF NOT EXISTS mesas (
  id          TEXT PRIMARY KEY,          -- código do pedido ex: #BF-1234
  mesa        TEXT NOT NULL,             -- número da mesa
  itens       JSONB NOT NULL DEFAULT '[]',  -- [{ name, qty, price }]
  total       NUMERIC(10,2) NOT NULL,
  obs         TEXT DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'pendente',  -- pendente | preparando | pronto | entregue
  ts          BIGINT NOT NULL            -- timestamp em ms (Date.now())
);

-- Índice para buscar pedidos por mesa rapidamente
CREATE INDEX IF NOT EXISTS idx_mesas_mesa ON mesas(mesa);
CREATE INDEX IF NOT EXISTS idx_mesas_status ON mesas(status);
CREATE INDEX IF NOT EXISTS idx_mesas_ts ON mesas(ts DESC);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================
ALTER TABLE mesas ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode inserir pedidos (clientes nas mesas)
CREATE POLICY "clientes podem inserir pedidos"
  ON mesas FOR INSERT
  WITH CHECK (true);

-- Qualquer pessoa pode ler pedidos (garçom e cliente veem status)
CREATE POLICY "todos podem ler pedidos"
  ON mesas FOR SELECT
  USING (true);

-- Qualquer pessoa pode atualizar o status (garçom marca como entregue)
-- Em produção, restrinja isso com Supabase Auth se quiser mais segurança
CREATE POLICY "garcom pode atualizar status"
  ON mesas FOR UPDATE
  USING (true);

-- =====================================================
-- Tabela de pagamentos (fechar conta — garçom)
-- =====================================================
CREATE TABLE IF NOT EXISTS pagamentos (
  id          TEXT PRIMARY KEY,
  mesa        TEXT NOT NULL,
  total       NUMERIC(10,2),
  forma       TEXT NOT NULL,          -- pix | dinheiro | cartao
  responsavel TEXT DEFAULT 'garçom',
  ts          BIGINT NOT NULL,
  ts_brasilia TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pag_mesa ON pagamentos(mesa);
CREATE INDEX IF NOT EXISTS idx_pag_ts   ON pagamentos(ts DESC);

ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "garcom pode inserir pagamentos"
  ON pagamentos FOR INSERT WITH CHECK (true);
CREATE POLICY "garcom pode ler pagamentos"
  ON pagamentos FOR SELECT USING (true);

-- Execute também no SQL Editor:
GRANT SELECT, INSERT ON public.pagamentos TO anon;
GRANT SELECT, INSERT ON public.pagamentos TO authenticated;

-- =====================================================
-- NOTAS DE SEGURANÇA
-- =====================================================
-- As políticas acima são permissivas para facilitar o início.
-- Para maior segurança em produção, considere:
--   1. Adicionar Supabase Auth para o painel do garçom
--   2. Restringir UPDATE apenas para usuários autenticados
--   3. Adicionar expiração automática de pedidos antigos:
--
-- CREATE OR REPLACE FUNCTION limpar_pedidos_antigos()
-- RETURNS void LANGUAGE sql AS $$
--   DELETE FROM mesas WHERE ts < (EXTRACT(EPOCH FROM NOW() - INTERVAL '24 hours') * 1000)::BIGINT;
-- $$;
