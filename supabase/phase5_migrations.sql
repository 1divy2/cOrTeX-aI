-- Phase 5 Migrations

-- 1. AI Memories Table
CREATE TABLE IF NOT EXISTS ai_memories (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'goal', 'project', 'topic', 'preference', 'fact'
    content TEXT NOT NULL,
    importance INTEGER DEFAULT 1, -- 1 to 5
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- Enable RLS
ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;

-- Policies for ai_memories
CREATE POLICY "Users can view their own memories"
    ON ai_memories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memories"
    ON ai_memories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
    ON ai_memories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories"
    ON ai_memories FOR DELETE
    USING (auth.uid() = user_id);


-- 2. AI Reports Table
CREATE TABLE IF NOT EXISTS ai_reports (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
    date TEXT NOT NULL, -- e.g., '2026-06-04'
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

-- Enable RLS
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;

-- Policies for ai_reports
CREATE POLICY "Users can view their own reports"
    ON ai_reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
    ON ai_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
    ON ai_reports FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
    ON ai_reports FOR DELETE
    USING (auth.uid() = user_id);
