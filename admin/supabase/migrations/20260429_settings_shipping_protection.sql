-- Add shipping_rates and protection_product to settings
-- Date: 2026-04-29

ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS shipping_rates JSONB DEFAULT '[]';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS protection_product JSONB DEFAULT '{
  "enabled": true,
  "title": "Proteção Total com Seguro",
  "price": 26.14,
  "original_price": 382.00,
  "image_url": "https://imgur.com/p8wx3bjk2d.webp"
}';

-- Seed initial shipping rates if empty
UPDATE public.settings 
SET shipping_rates = '[
  {"id": "pac", "name": "PAC (Econômico)", "price": 15.90, "deadline": "5-8 dias úteis"},
  {"id": "sedex", "name": "SEDEX (Expresso)", "price": 25.50, "deadline": "2-3 dias úteis"}
]'
WHERE shipping_rates = '[]' OR shipping_rates IS NULL;
