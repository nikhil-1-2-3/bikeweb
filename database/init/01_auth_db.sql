-- Auth Database Initialization
CREATE DATABASE auth_db;

\c auth_db;

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  full_name   VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  UNIQUE NOT NULL,
  phone       VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role        VARCHAR(20)   DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- Seed admin user  (password: Admin@123)
INSERT INTO users (full_name, email, phone, password_hash, role)
VALUES (
  'Admin User',
  'admin@motorhouse.com',
  '+1-000-000-0000',
  '$2b$10$03nscaeeM187VmYnOqFJ.eSqvx72MGXdh0EGm6RlmC2a/LWZ145JG', -- Admin@123
  'admin'
) ON CONFLICT (email) DO NOTHING;
