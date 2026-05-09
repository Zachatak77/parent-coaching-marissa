-- Add coach_id to discovery_calls for scoped assignment
ALTER TABLE public.discovery_calls
  ADD COLUMN IF NOT EXISTS coach_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Backfill existing leads to Marissa
UPDATE public.discovery_calls
SET coach_id = (
  SELECT id FROM public.profiles
  WHERE email = 'parentcoachingwithmarissa@gmail.com'
  LIMIT 1
)
WHERE coach_id IS NULL;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "discovery_select_coach" ON public.discovery_calls;
DROP POLICY IF EXISTS "discovery_update_coach" ON public.discovery_calls;

-- Coaches see only their own leads; admins see all
CREATE POLICY "discovery_select_scoped" ON public.discovery_calls
  FOR SELECT USING (
    coach_id = auth.uid()
    OR get_user_role() = 'admin'
  );

-- Coaches update only their own leads; admins update all
CREATE POLICY "discovery_update_scoped" ON public.discovery_calls
  FOR UPDATE USING (
    coach_id = auth.uid()
    OR get_user_role() = 'admin'
  );
