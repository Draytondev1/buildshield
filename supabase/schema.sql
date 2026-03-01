-- BuildShield Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  credits_remaining INTEGER DEFAULT 3,
  total_reports_generated INTEGER DEFAULT 0,
  role TEXT DEFAULT 'assessor', -- 'assessor' or 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(user_id),
  property_address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  roof_type TEXT NOT NULL,
  roof_age INTEGER NOT NULL,
  building_use TEXT NOT NULL,
  weather_metrics JSONB NOT NULL,
  ai_report TEXT,
  pdf_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather cache table
CREATE TABLE weather_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_key TEXT UNIQUE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  metrics JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit transactions table (for audit trail)
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(user_id),
  amount INTEGER NOT NULL, -- positive for purchases, negative for usage
  type TEXT NOT NULL, -- 'purchase', 'usage', 'bonus', 'refund'
  description TEXT,
  report_id UUID REFERENCES reports(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(user_id),
  date DATE NOT NULL,
  request_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_weather_cache_location ON weather_cache(location_key);
CREATE INDEX idx_weather_cache_expires ON weather_cache(expires_at);
CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_rate_limits_user_date ON rate_limits(user_id, date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY users_read_own ON users
  FOR SELECT USING (auth.uid()::text = user_id);

-- Users can only read their own reports
CREATE POLICY reports_read_own ON reports
  FOR SELECT USING (auth.uid()::text = user_id);

-- Users can only read their own credit transactions
CREATE POLICY credit_transactions_read_own ON credit_transactions
  FOR SELECT USING (auth.uid()::text = user_id);

-- Allow service role to access all data (for API routes)
CREATE POLICY service_all ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY service_all_reports ON reports
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY service_all_transactions ON credit_transactions
  FOR ALL USING (true) WITH CHECK (true);
