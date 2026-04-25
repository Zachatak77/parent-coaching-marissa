-- Allow coaches to read profile rows for clients they own.
-- The existing "profiles_select" policy only covers self-read and admin,
-- which prevents coaches from seeing client names/emails in joined queries.
CREATE POLICY "profiles_select_coach_clients" ON public.profiles
  FOR SELECT USING (
    get_user_role() IN ('coach', 'admin')
    AND EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.profile_id = profiles.id
        AND clients.coach_id = auth.uid()
    )
  );
