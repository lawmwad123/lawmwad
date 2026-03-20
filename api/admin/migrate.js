const { getDb } = require('./_lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Protect with a secret
  const secret = req.headers['x-migrate-secret'] || req.body?.secret;
  if (secret !== process.env.ADMIN_SEED_SECRET) {
    return res.status(403).json({ error: 'Invalid secret' });
  }

  const sql = getDb();
  const results = [];

  try {
    // Users & Sessions
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member'
          CHECK (role IN ('admin','director','lead','member','viewer')),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        password_reset_token TEXT,
        password_reset_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('users');

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('sessions');

    // Team Members
    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        photo_url TEXT,
        division TEXT NOT NULL
          CHECK (division IN ('software','robotics','mechanics','electronics')),
        role TEXT NOT NULL,
        title TEXT,
        bio TEXT,
        skills TEXT[],
        join_date DATE,
        status TEXT DEFAULT 'active'
          CHECK (status IN ('active','on_leave','alumni')),
        linkedin_url TEXT,
        github_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('team_members');

    // Projects
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        division TEXT NOT NULL
          CHECK (division IN ('software','robotics','mechanics','electronics','cross-division')),
        status TEXT DEFAULT 'planning'
          CHECK (status IN ('planning','active','paused','completed','archived')),
        priority TEXT DEFAULT 'medium'
          CHECK (priority IN ('low','medium','high','critical')),
        start_date DATE,
        target_end_date DATE,
        actual_end_date DATE,
        budget_allocated NUMERIC(12,2) DEFAULT 0,
        budget_spent NUMERIC(12,2) DEFAULT 0,
        lead_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
        image_url TEXT,
        repository_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('projects');

    await sql`
      CREATE TABLE IF NOT EXISTS project_members (
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
        role TEXT DEFAULT 'contributor',
        assigned_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (project_id, member_id)
      )
    `;
    results.push('project_members');

    await sql`
      CREATE TABLE IF NOT EXISTS milestones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE,
        completed_at TIMESTAMP,
        status TEXT DEFAULT 'pending'
          CHECK (status IN ('pending','in_progress','completed','overdue')),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('milestones');

    // Equipment
    await sql`
      CREATE TABLE IF NOT EXISTS equipment (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        category TEXT NOT NULL
          CHECK (category IN ('drone','3d_printer','sdr','sensor','tool','computer','other')),
        description TEXT,
        serial_number TEXT,
        location TEXT,
        status TEXT DEFAULT 'available'
          CHECK (status IN ('available','in_use','maintenance','retired','lost')),
        condition TEXT DEFAULT 'good'
          CHECK (condition IN ('new','good','fair','poor','broken')),
        purchase_date DATE,
        purchase_cost NUMERIC(10,2),
        photo_url TEXT,
        assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('equipment');

    await sql`
      CREATE TABLE IF NOT EXISTS equipment_bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
        booked_by UUID REFERENCES team_members(id) ON DELETE CASCADE,
        project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        purpose TEXT,
        status TEXT DEFAULT 'confirmed'
          CHECK (status IN ('pending','confirmed','cancelled','completed')),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('equipment_bookings');

    await sql`
      CREATE TABLE IF NOT EXISTS maintenance_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
        performed_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
        maintenance_type TEXT NOT NULL
          CHECK (maintenance_type IN ('routine','repair','calibration','upgrade')),
        description TEXT NOT NULL,
        cost NUMERIC(10,2) DEFAULT 0,
        performed_at TIMESTAMP DEFAULT NOW(),
        next_maintenance DATE
      )
    `;
    results.push('maintenance_log');

    // Applications v2
    await sql`
      CREATE TABLE IF NOT EXISTS applications_v2 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        lab TEXT NOT NULL,
        level TEXT NOT NULL,
        about TEXT,
        resume_url TEXT,
        portfolio_url TEXT,
        status TEXT DEFAULT 'new'
          CHECK (status IN ('new','screening','interview','trial','accepted','rejected','withdrawn')),
        stage_notes JSONB DEFAULT '[]',
        reviewer_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        source TEXT DEFAULT 'website',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('applications_v2');

    // Publications
    await sql`
      CREATE TABLE IF NOT EXISTS publications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        abstract TEXT,
        authors TEXT[] NOT NULL,
        publication_type TEXT NOT NULL
          CHECK (publication_type IN ('paper','report','thesis','patent','blog','presentation')),
        venue TEXT,
        published_date DATE,
        doi TEXT,
        url TEXT,
        pdf_url TEXT,
        project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
        status TEXT DEFAULT 'draft'
          CHECK (status IN ('draft','submitted','in_review','published','rejected')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('publications');

    // Documents
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        file_url TEXT NOT NULL,
        file_type TEXT,
        file_size INT,
        category TEXT NOT NULL
          CHECK (category IN ('report','proposal','datasheet','sop','meeting_notes','policy','other')),
        project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
        uploaded_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
        is_public BOOLEAN DEFAULT false,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('documents');

    // Expenses
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
        category TEXT NOT NULL
          CHECK (category IN ('equipment','materials','software','travel','services','other')),
        description TEXT NOT NULL,
        amount NUMERIC(12,2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        receipt_url TEXT,
        incurred_date DATE NOT NULL,
        submitted_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
        approved_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
        status TEXT DEFAULT 'pending'
          CHECK (status IN ('pending','approved','rejected','reimbursed')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('expenses');

    // Audit Log
    await sql`
      CREATE TABLE IF NOT EXISTS audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id UUID,
        changes JSONB,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    results.push('audit_log');

    // Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_team_division ON team_members(division)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_apps_status ON applications_v2(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_expenses_project ON expenses(project_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_time ON equipment_bookings(start_time, end_time)`;
    results.push('indexes');

    return res.status(200).json({
      message: 'Migration completed successfully',
      tables: results,
    });
  } catch (err) {
    console.error('Migration error:', err);
    return res.status(500).json({ error: 'Migration failed', details: err.message });
  }
};
