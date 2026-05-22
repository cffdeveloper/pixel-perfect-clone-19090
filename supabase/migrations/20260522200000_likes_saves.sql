-- User likes and saved properties (requires Supabase Auth sign-up)

CREATE TABLE public.property_likes (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, property_id)
);

CREATE TABLE public.property_saves (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, property_id)
);

ALTER TABLE public.property_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own likes"
  ON public.property_likes FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own saves"
  ON public.property_saves FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public read like counts"
  ON public.property_likes FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Users read own saves only"
  ON public.property_saves FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_property_likes_property ON public.property_likes(property_id);
CREATE INDEX idx_property_saves_user ON public.property_saves(user_id);
