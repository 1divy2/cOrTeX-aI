-- Phase 6 Migrations: Life OS & Execution Engine

-- 1. Domains
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at BIGINT NOT NULL
);
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own domains" ON domains FOR ALL USING (auth.uid() = user_id);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- active, completed, stalled, archived
    health_score INTEGER DEFAULT 100,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- 3. Habits
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'daily',
    streak INTEGER DEFAULT 0,
    created_at BIGINT NOT NULL
);
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own habits" ON habits FOR ALL USING (auth.uid() = user_id);

-- 4. Habit Logs (for daily tracking)
CREATE TABLE IF NOT EXISTS habit_logs (
    id UUID PRIMARY KEY,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- YYYY-MM-DD
    completed BOOLEAN DEFAULT true,
    created_at BIGINT NOT NULL
);
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own habit logs" ON habit_logs FOR ALL USING (auth.uid() = user_id);

-- 5. Time Blocks (Calendar)
CREATE TABLE IF NOT EXISTS time_blocks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- focus, work, study, planning, break
    start_time BIGINT NOT NULL,
    end_time BIGINT NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    linked_task_id TEXT, -- Can be linked to a specific task
    linked_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    completed BOOLEAN DEFAULT false,
    created_at BIGINT NOT NULL
);
ALTER TABLE time_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own time blocks" ON time_blocks FOR ALL USING (auth.uid() = user_id);

-- Add project_id to Tasks table (assuming tasks table exists, need to use an ALTER)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'project_id') THEN
        ALTER TABLE tasks ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
    END IF;
END $$;
