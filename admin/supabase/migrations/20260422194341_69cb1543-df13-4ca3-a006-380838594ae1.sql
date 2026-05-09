CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  discount_percent INTEGER,
  image_url TEXT,
  badge TEXT,
  sales_count INTEGER NOT NULL DEFAULT 0,
  free_shipping BOOLEAN NOT NULL DEFAULT true,
  category TEXT,
  section TEXT NOT NULL DEFAULT 'top',
  position INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_products_section_position ON public.products(section, position);

INSERT INTO public.products (name, price, original_price, discount_percent, badge, sales_count, free_shipping, section, position) VALUES
('Scooter Elétrica TUI 1000W | 2 Lugares', 87.90, 897.00, 90, 'TOP 1', 5012, true, 'top', 1),
('Mesa Dobrável Tipo Maleta 180x60cm', 87.74, 199.90, 56, 'TOP 2', 4473, true, 'top', 2),
('Caixa de Som JBL Boombox 4 Bluetooth', 90.04, 3199.00, 97, 'TOP 3', 1890, true, 'top', 3),
('Conjunto Panelas SMILE 29 Peças', 68.90, 499.90, 89, 'TOP 4', 10342, true, 'top', 4),
('Smart TV 50" 4K UHD', 1299.00, 2499.00, 48, NULL, 230, true, 'recommended', 1),
('Fone Bluetooth Premium', 49.90, 199.00, 75, NULL, 8721, true, 'recommended', 2);