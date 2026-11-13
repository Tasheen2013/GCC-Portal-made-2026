import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;
if (!config.databaseUrl) {
  console.warn('DATABASE_URL is not set. PostgreSQL features will not work until .env is configured.');
}

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseUrl ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

export async function initPostgres() {
  if (!config.databaseUrl) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id BIGSERIAL PRIMARY KEY,
      theme_key VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      created_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id BIGSERIAL PRIMARY KEY,
      article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      kind VARCHAR(20) NOT NULL CHECK(kind IN ('document','image')),
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      mime_type TEXT,
      size_bytes BIGINT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_articles_theme_year ON articles(theme_key, year);
    CREATE INDEX IF NOT EXISTS idx_attachments_article ON attachments(article_id);
  `);
}
