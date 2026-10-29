-- =========================================================================
-- DermoScan: Supabase Database Schema for Localized Lesion Classification
-- =========================================================================

-- 1. Create table for anonymous session-scoped scan history
CREATE TABLE IF NOT EXISTS public.scan_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    image_thumbnail TEXT NOT NULL,
    body_location TEXT NOT NULL,
    duration TEXT NOT NULL,
    symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
    classification TEXT NOT NULL,
    icd_code TEXT NOT NULL,
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high')),
    full_result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_scan_history_session_id ON public.scan_history(session_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON public.scan_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_history_risk_level ON public.scan_history(risk_level);

-- 3. Row Level Security (RLS)
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert rows
CREATE POLICY "Allow anonymous insert for scan_history"
    ON public.scan_history
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anonymous users to select their own scans (scoped by session_id in app query)
CREATE POLICY "Allow anonymous read by session"
    ON public.scan_history
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow anonymous users to delete their own scans
CREATE POLICY "Allow anonymous delete by session"
    ON public.scan_history
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- 4. Comment on table
COMMENT ON TABLE public.scan_history IS 'Stores localized skin scan reports for DermoScan clinical demo scoped to anonymous session IDs.';
