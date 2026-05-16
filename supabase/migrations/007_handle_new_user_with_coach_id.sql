-- Update handle_new_user to set coach_id from user metadata.
-- Coaches pass coach_id when creating client accounts via the admin API;
-- self-signup leaves it absent, so the cast produces NULL (acceptable — nullable column).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, coach_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent'),
    (NEW.raw_user_meta_data->>'coach_id')::uuid
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
