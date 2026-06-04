-- Phase 4: Knowledge Engine & Second Brain Database Schema

-- 1. Collections Table (Workspaces / Note Groups)
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for collections
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own collections"
    ON collections FOR ALL
    USING (auth.uid() = user_id);

-- Add collection_id to existing notes (Nullable)
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES collections(id) ON DELETE SET NULL;

-- 2. Note Links Table (Bidirectional connections)
CREATE TABLE IF NOT EXISTS note_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    target_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate links
    UNIQUE(source_id, target_id)
);

-- Enable RLS for note_links
ALTER TABLE note_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own note links"
    ON note_links FOR ALL
    USING (auth.uid() = user_id);


-- 3. Note Versions Table (Version History)
CREATE TABLE IF NOT EXISTS note_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    plain_text TEXT,
    version_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for note_versions
ALTER TABLE note_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own note versions"
    ON note_versions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own note versions"
    ON note_versions FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- 4. Knowledge Metrics Table (Health Score and Timeline)
CREATE TABLE IF NOT EXISTS knowledge_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    analytics_date DATE NOT NULL,
    total_notes INTEGER DEFAULT 0,
    new_connections INTEGER DEFAULT 0,
    health_score INTEGER DEFAULT 0,
    learning_velocity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, analytics_date)
);

-- Enable RLS for knowledge_metrics
ALTER TABLE knowledge_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their knowledge metrics"
    ON knowledge_metrics FOR ALL
    USING (auth.uid() = user_id);
