-- discovery_calls: add scheduling source tracking
ALTER TABLE public.discovery_calls
  ADD COLUMN IF NOT EXISTS scheduled_at  timestamptz,
  ADD COLUMN IF NOT EXISTS gcal_event_id text,
  ADD COLUMN IF NOT EXISTS source        text NOT NULL DEFAULT 'website';

CREATE UNIQUE INDEX IF NOT EXISTS discovery_calls_gcal_event_id_key
  ON public.discovery_calls (gcal_event_id)
  WHERE gcal_event_id IS NOT NULL;

-- profiles: store OAuth tokens per coach
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS google_refresh_token    text,
  ADD COLUMN IF NOT EXISTS google_access_token     text,
  ADD COLUMN IF NOT EXISTS google_token_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS google_calendar_email   text;

-- Per-coach Google Calendar watch channel state
CREATE TABLE IF NOT EXISTS public.gcal_watch_state (
  coach_id           uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  channel_id         text,
  resource_id        text,
  sync_token         text,
  channel_expires_at timestamptz,
  updated_at         timestamptz DEFAULT now()
);
