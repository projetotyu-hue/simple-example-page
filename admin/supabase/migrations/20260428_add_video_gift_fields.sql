-- Migration: add video, gift and bonus fields to products table
-- Date: 2026-04-28

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS gift_title TEXT,
  ADD COLUMN IF NOT EXISTS gift_description TEXT,
  ADD COLUMN IF NOT EXISTS gift_image_url TEXT,
  ADD COLUMN IF NOT EXISTS bonus_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bonus_title TEXT,
  ADD COLUMN IF NOT EXISTS bonus_description TEXT,
  ADD COLUMN IF NOT EXISTS bonus_highlight TEXT,
  ADD COLUMN IF NOT EXISTS bonus_warning TEXT,
  ADD COLUMN IF NOT EXISTS info_images TEXT[];

-- Add comments to describe the fields
COMMENT ON COLUMN products.video_url IS 'Link do vídeo (YouTube ou outro) exibido na página do produto';
COMMENT ON COLUMN products.gift_title IS 'Título do brinde exclusivo (ex: 1 Capacete GRÁTIS!)';
COMMENT ON COLUMN products.gift_description IS 'Descrição do brinde (ex: Comprando hoje, você recebe...)';
COMMENT ON COLUMN products.gift_image_url IS 'URL da imagem do brinde (primeira imagem da lista)';
COMMENT ON COLUMN products.bonus_enabled IS 'Indica se o bloco de bônus está ativo';
COMMENT ON COLUMN products.bonus_title IS 'Título do bloco de bônus';
COMMENT ON COLUMN products.bonus_description IS 'Descrição curta da oferta de bônus';
COMMENT ON COLUMN products.bonus_highlight IS 'Texto em destaque no bônus';
COMMENT ON COLUMN products.bonus_warning IS 'Aviso de validade ou urgência';
COMMENT ON COLUMN products.info_images IS 'Imagens adicionais exibidas sequencialmente antes das avaliações';
