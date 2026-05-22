-- Configurable OAuth admin allowlist (email from Google/GitHub/etc. on auth.users)

CREATE TABLE public.oauth_admin_emails (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT oauth_admin_emails_email_lowercase CHECK (email = lower(email))
);

ALTER TABLE public.oauth_admin_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage oauth admin emails"
  ON public.oauth_admin_emails
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.oauth_admin_emails (email)
VALUES ('binfred.ke@gmail.com')
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_oauth_admin_email(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.oauth_admin_emails
    WHERE email = lower(trim(_email))
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_oauth_admin_email(text) FROM anon, authenticated, public;

CREATE OR REPLACE FUNCTION public.grant_admin_role_for_oauth_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NOT NULL AND public.is_oauth_admin_email(NEW.email) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.grant_admin_role_for_oauth_email() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
DROP FUNCTION IF EXISTS public.handle_admin_email_signup();

CREATE TRIGGER on_auth_user_oauth_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_admin_role_for_oauth_email();

-- Promote existing OAuth users already registered with an allowlisted email
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE u.email IS NOT NULL
  AND public.is_oauth_admin_email(u.email)
ON CONFLICT (user_id, role) DO NOTHING;
