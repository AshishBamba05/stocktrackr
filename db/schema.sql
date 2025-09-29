CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS symbols (
  symbol TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO symbols(symbol, name) VALUES
('AAPL','Apple Inc.'),
('MSFT','Microsoft'),
('GOOG','Alphabet')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS watchlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS watchlist_items (
  id SERIAL PRIMARY KEY,
  watchlist_id INTEGER NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL REFERENCES symbols(symbol) ON DELETE RESTRICT,
  UNIQUE(watchlist_id, symbol)
);

CREATE TABLE IF NOT EXISTS positions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL REFERENCES symbols(symbol),
  quantity NUMERIC NOT NULL,
  avg_cost NUMERIC NOT NULL,
  UNIQUE(user_id, symbol)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_dir') THEN
    CREATE TYPE alert_dir AS ENUM ('gte','lte');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL REFERENCES symbols(symbol),
  direction alert_dir NOT NULL,
  target NUMERIC NOT NULL,
  last_state TEXT,
  last_triggered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_alerts_symbol ON alerts(symbol);
