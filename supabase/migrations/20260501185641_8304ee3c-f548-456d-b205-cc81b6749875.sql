
-- 1. Fix privilege escalation: plans policy used profiles.is_admin instead of has_role
DROP POLICY IF EXISTS "Admins can manage plans" ON public.plans;
CREATE POLICY "Admins can manage plans"
ON public.plans
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Drop dead/conflicting newsletter_subscriptions policies
DROP POLICY IF EXISTS "insert_policy" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "select_policy" ON public.newsletter_subscriptions;

-- 3. Tighten blog-images bucket: only admins may upload; drop duplicate read policy
DROP POLICY IF EXISTS "Anyone can upload an image" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;

CREATE POLICY "Admins can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- 4. Validate donations on insert
CREATE OR REPLACE FUNCTION public.validate_donation()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.amount IS NULL OR NEW.amount <= 0 THEN
    RAISE EXCEPTION 'Donation amount must be greater than 0';
  END IF;
  IF NEW.currency NOT IN ('SSP', 'USD', 'EUR') THEN
    RAISE EXCEPTION 'Unsupported currency: %', NEW.currency;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_donation_trigger ON public.donations;
CREATE TRIGGER validate_donation_trigger
BEFORE INSERT OR UPDATE ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.validate_donation();

-- 5. Drop empty stub functions
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.increment_view_count();

-- 6. Add search_path to update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
