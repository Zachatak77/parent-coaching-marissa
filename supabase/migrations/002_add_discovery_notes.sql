-- Add notes column to discovery_calls for internal coach notes
ALTER TABLE public.discovery_calls ADD COLUMN IF NOT EXISTS notes text;
