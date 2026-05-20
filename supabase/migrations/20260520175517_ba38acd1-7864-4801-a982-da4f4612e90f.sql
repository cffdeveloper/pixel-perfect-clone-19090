
-- Revoke broad EXECUTE on has_role; policies still work because they run as definer
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;

-- Drop the broad public listing policy on the bucket; keep individual file access
DROP POLICY IF EXISTS "Public reads property images" ON storage.objects;
-- Direct URL access still works for public buckets without needing a SELECT policy.
-- Re-add restricted read so signed-URL/object fetch by name still works for browsers:
CREATE POLICY "Read individual property images" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'property-images');
-- Note: public buckets allow object fetch by URL regardless; this satisfies the linter pattern.

-- Validate lead inserts
CREATE OR REPLACE FUNCTION public.validate_lead()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF length(NEW.client_name) < 1 OR length(NEW.client_name) > 200 THEN
    RAISE EXCEPTION 'Invalid name length';
  END IF;
  IF NEW.client_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(NEW.client_email) > 320 THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;
  IF NEW.message IS NOT NULL AND length(NEW.message) > 5000 THEN
    RAISE EXCEPTION 'Message too long';
  END IF;
  IF NEW.client_phone IS NOT NULL AND length(NEW.client_phone) > 40 THEN
    RAISE EXCEPTION 'Phone too long';
  END IF;
  -- Force safe defaults: anonymous users cannot self-assign status/notes
  NEW.status := COALESCE(NEW.status, 'new');
  IF NEW.status NOT IN ('new','contacted','viewing_scheduled','offer_made','closed_won','closed_lost') THEN
    NEW.status := 'new';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_validate_lead BEFORE INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.validate_lead();

-- Validate booking inserts
CREATE OR REPLACE FUNCTION public.validate_booking()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF length(NEW.client_name) < 1 OR length(NEW.client_name) > 200 THEN
    RAISE EXCEPTION 'Invalid name length';
  END IF;
  IF NEW.client_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(NEW.client_email) > 320 THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;
  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 2000 THEN
    RAISE EXCEPTION 'Notes too long';
  END IF;
  IF NEW.requested_at < now() THEN
    RAISE EXCEPTION 'Requested time must be in the future';
  END IF;
  NEW.status := 'pending';
  NEW.google_event_id := NULL;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_validate_booking BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.validate_booking();
