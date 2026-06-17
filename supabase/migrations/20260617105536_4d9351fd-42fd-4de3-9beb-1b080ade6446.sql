-- 1) Remove dead function flagged by search_path linter
DROP FUNCTION IF EXISTS public.increment_view_count(uuid, text);

-- 2) Restrict has_role EXECUTE (SECURITY DEFINER) to signed-in users only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3) Tighten permissive WITH CHECK (true) policies with input sanity constraints

-- contact_submissions
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND position('@' in email) > 1
  AND length(email) <= 320
  AND length(btrim(message)) BETWEEN 1 AND 5000
);

-- newsletter_subscriptions
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  position('@' in email) > 1
  AND length(email) <= 320
);

-- donations
DROP POLICY IF EXISTS "Anyone can create donations" ON public.donations;
CREATE POLICY "Anyone can create donations"
ON public.donations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  amount > 0
  AND currency IN ('SSP', 'USD', 'EUR')
  AND length(btrim(reference)) BETWEEN 1 AND 200
);

-- visitor_analytics: only backend (service role) inserts
DROP POLICY IF EXISTS "Service role can insert visitor analytics" ON public.visitor_analytics;
CREATE POLICY "Service role can insert visitor analytics"
ON public.visitor_analytics
FOR INSERT
TO service_role
WITH CHECK (true);

-- visitor_insights: only backend (service role) inserts
DROP POLICY IF EXISTS "Service role can insert visitor insights" ON public.visitor_insights;
CREATE POLICY "Service role can insert visitor insights"
ON public.visitor_insights
FOR INSERT
TO service_role
WITH CHECK (true);