-- ============================================================
-- Ghostshield Dashboard - Analytics Tables Migration
-- ============================================================

-- 1. PAYMENTS TABLE
-- Tracks all payment attempts and completions for revenue analytics
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method text, -- 'pix', 'credit_card', 'boleto', etc.
  gateway_transaction_id text,
  gateway_response jsonb,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON public.payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON public.payments FOR UPDATE
  TO authenticated
  USING (true);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_completed_at ON public.payments(completed_at);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);

-- 2. EVENTS TABLE (Funnel Tracking)
-- Tracks user journey through the sales funnel
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text, -- to group events from same user session
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN (
    'code_generated',    -- user generated checkout code
    'checkout_started',  -- user started checkout
    'payment_attempt',   -- user tried to pay
    'payment_completed', -- payment successful
    'upsell_offered',    -- upsell was shown
    'upsell_accepted',   -- upsell was accepted
    'upsell_declined',   -- upsell was declined
    'checkout_completed' -- entire checkout flow completed
  )),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  funnel_step text, -- 'step1', 'step2', 'upsell', 'checkout'
  metadata jsonb, -- additional event data
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes for funnel analytics
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON public.events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_customer_id ON public.events(customer_id);
CREATE INDEX IF NOT EXISTS idx_events_funnel_step ON public.events(funnel_step);

-- 3. Improve ORDERS table with additional fields if they don't exist
-- (checked with IF NOT EXISTS pattern via DO block)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_id') THEN
    ALTER TABLE public.orders ADD COLUMN payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='items') THEN
    ALTER TABLE public.orders ADD COLUMN items jsonb; -- array of {product_id, quantity, price}
  END IF;
END $$;

-- 4. Function to get revenue analytics (aggregated by period)
CREATE OR REPLACE FUNCTION public.get_revenue_analytics(
  period text DEFAULT 'daily', -- 'daily', 'weekly', 'monthly'
  start_date date DEFAULT (now() - interval '30 days')::date,
  end_date date DEFAULT now()::date
)
RETURNS TABLE(
  period_label text,
  period_start date,
  revenue numeric,
  count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF period = 'daily' THEN
    RETURN QUERY
    SELECT
      to_char(date_trunc('day', p.completed_at), 'YYYY-MM-DD') as period_label,
      date_trunc('day', p.completed_at)::date as period_start,
      COALESCE(SUM(p.amount), 0) as revenue,
      COUNT(*) as count
    FROM public.payments p
    WHERE p.status = 'completed'
      AND p.completed_at::date BETWEEN start_date AND end_date
    GROUP BY date_trunc('day', p.completed_at)
    ORDER BY period_start;
  ELSIF period = 'weekly' THEN
    RETURN QUERY
    SELECT
      'Semana ' || to_char(date_trunc('week', p.completed_at), 'YYYY-MM-DD') as period_label,
      date_trunc('week', p.completed_at)::date as period_start,
      COALESCE(SUM(p.amount), 0) as revenue,
      COUNT(*) as count
    FROM public.payments p
    WHERE p.status = 'completed'
      AND p.completed_at::date BETWEEN start_date AND end_date
    GROUP BY date_trunc('week', p.completed_at)
    ORDER BY period_start;
  ELSE -- monthly
    RETURN QUERY
    SELECT
      to_char(date_trunc('month', p.completed_at), 'YYYY-MM') as period_label,
      date_trunc('month', p.completed_at)::date as period_start,
      COALESCE(SUM(p.amount), 0) as revenue,
      COUNT(*) as count
    FROM public.payments p
    WHERE p.status = 'completed'
      AND p.completed_at::date BETWEEN start_date AND end_date
    GROUP BY date_trunc('month', p.completed_at)
    ORDER BY period_start;
  END IF;
END;
$$;

-- 5. Function to get conversion analytics
CREATE OR REPLACE FUNCTION public.get_conversion_analytics(
  start_date date DEFAULT (now() - interval '30 days')::date,
  end_date date DEFAULT now()::date
)
RETURNS TABLE(
  code_generated bigint,
  payments_completed bigint,
  conversion_rate numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_generated bigint;
  v_completed bigint;
BEGIN
  SELECT COUNT(DISTINCT session_id)
  INTO v_generated
  FROM public.events
  WHERE event_type = 'code_generated'
    AND created_at::date BETWEEN start_date AND end_date;

  SELECT COUNT(DISTINCT session_id)
  INTO v_completed
  FROM public.events
  WHERE event_type = 'payment_completed'
    AND created_at::date BETWEEN start_date AND end_date;

  RETURN QUERY
  SELECT
    v_generated as code_generated,
    v_completed as payments_completed,
    CASE
      WHEN v_generated > 0 THEN ROUND((v_completed::numeric / v_generated::numeric) * 100, 2)
      ELSE 0
    END as conversion_rate;
END;
$$;

-- 6. Function to get funnel analytics (abandonment)
CREATE OR REPLACE FUNCTION public.get_funnel_analytics(
  start_date date DEFAULT (now() - interval '30 days')::date,
  end_date date DEFAULT now()::date
)
RETURNS TABLE(
  funnel_step text,
  event_count bigint,
  abandonment_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_started bigint;
  v_completed bigint;
BEGIN
  SELECT COUNT(DISTINCT session_id)
  INTO v_started
  FROM public.events
  WHERE event_type IN ('code_generated', 'checkout_started')
    AND created_at::date BETWEEN start_date AND end_date;

  SELECT COUNT(DISTINCT session_id)
  INTO v_completed
  FROM public.events
  WHERE event_type = 'checkout_completed'
    AND created_at::date BETWEEN start_date AND end_date;

  RETURN QUERY
  SELECT 'started' as funnel_step, v_started as event_count,
    (v_started - COALESCE(v_completed, 0)) as abandonment_count
  UNION ALL
  SELECT 'completed' as funnel_step, v_completed as event_count,
    0::bigint as abandonment_count;
END;
$$;

-- 7. Function to get top products
CREATE OR REPLACE FUNCTION public.get_top_products(
  limit_count int DEFAULT 10,
  start_date date DEFAULT (now() - interval '30 days')::date,
  end_date date DEFAULT now()::date
)
RETURNS TABLE(
  product_id uuid,
  product_name text,
  quantity_sold bigint,
  revenue numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as product_id,
    p.name as product_name,
    COALESCE(SUM((item->>'quantity')::int), 0)::bigint as quantity_sold,
    COALESCE(SUM((item->>'quantity')::int * (item->>'price')::numeric), 0) as revenue
  FROM public.orders o
  JOIN public.payments pm ON pm.order_id = o.id
  CROSS JOIN LATERAL jsonb_array_elements(o.items) as item
  JOIN public.products p ON p.id = (item->>'product_id')::uuid
  WHERE pm.status = 'completed'
    AND o.created_at::date BETWEEN start_date AND end_date
  GROUP BY p.id, p.name
  ORDER BY quantity_sold DESC
  LIMIT limit_count;
EXCEPTION
  WHEN OTHERS THEN
    -- If items column doesn't exist or is null, fallback to products.sales_count
    RETURN QUERY
    SELECT
      p.id as product_id,
      p.name as product_name,
      p.sales_count::bigint as quantity_sold,
      0::numeric as revenue
    FROM public.products p
    WHERE p.sales_count > 0
    ORDER BY p.sales_count DESC
    LIMIT limit_count;
END;
$$;

-- 8. Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT SELECT, INSERT ON public.events TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_revenue_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_conversion_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_funnel_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_products TO authenticated;
