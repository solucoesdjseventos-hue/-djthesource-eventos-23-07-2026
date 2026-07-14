-- Supabase table definitions for DJ The Source

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  rateLabel text NOT NULL,
  unitLabel text NOT NULL,
  basePrice numeric NOT NULL,
  values jsonb NOT NULL,
  editable boolean NOT NULL DEFAULT true,
  hourly boolean NOT NULL DEFAULT false,
  options jsonb,
  created_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id text PRIMARY KEY,
  clientName text,
  clientEmail text,
  clientPhone text,
  organizerEmail text,
  quoteText jsonb,
  createdAt timestamptz,
  created_at timestamptz DEFAULT now()
);
