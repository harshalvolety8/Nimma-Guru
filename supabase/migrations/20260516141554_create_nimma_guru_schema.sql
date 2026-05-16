/*
  # Nimma-Guru Community Mentorship Platform Schema

  ## Overview
  This migration creates the full schema for the Nimma-Guru app — a non-commercial
  platform connecting retired professionals (Gurus) with students for free tutoring.

  ## New Tables

  ### 1. `profiles`
  - Stores base user info linked to Supabase auth
  - Columns: id, full_name, photo_url, village, street, phone, role (guru/student), languages, created_at

  ### 2. `gurus`
  - Extended profile for mentors
  - Columns: id (FK to profiles), skills, experience, available_hours (JSONB), preferred_location,
    rating, appreciation_count, total_students_taught, hours_contributed

  ### 3. `students`
  - Extended profile for learners
  - Columns: id (FK to profiles), favorite_gurus, appreciation_sent

  ### 4. `sessions`
  - Scheduled classes at community centers
  - Columns: id, guru_id, subject, date, start_time, end_time, location, attendees, max_capacity

  ### 5. `appreciations`
  - Thank-you notes from students to gurus
  - Columns: id, student_id, guru_id, message, photo_url, timestamp

  ## Security
  - RLS enabled on all tables
  - Profiles: users read all, update own
  - Gurus/Students: read all, update own
  - Sessions: read all, gurus insert/update own
  - Appreciations: read all, students insert own
*/

-- Profiles (base user table)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  photo_url text DEFAULT '',
  village text DEFAULT '',
  street text DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('guru', 'student')),
  languages text[] DEFAULT ARRAY['English'],
  age int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Gurus extended table
CREATE TABLE IF NOT EXISTS gurus (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  skills text[] DEFAULT ARRAY[]::text[],
  experience text DEFAULT '',
  available_hours jsonb DEFAULT '{}'::jsonb,
  preferred_location text DEFAULT 'Community Center',
  rating numeric(3,2) DEFAULT 0,
  appreciation_count int DEFAULT 0,
  total_students_taught int DEFAULT 0,
  hours_contributed int DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gurus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gurus"
  ON gurus FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gurus can insert own record"
  ON gurus FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Gurus can update own record"
  ON gurus FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Students extended table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  favorite_gurus uuid[] DEFAULT ARRAY[]::uuid[],
  appreciation_sent int DEFAULT 0,
  enrolled_sessions uuid[] DEFAULT ARRAY[]::uuid[],
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view students"
  ON students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can insert own record"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can update own record"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guru_name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  session_date date NOT NULL,
  start_time text NOT NULL DEFAULT '',
  end_time text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  attendees uuid[] DEFAULT ARRAY[]::uuid[],
  max_capacity int DEFAULT 20,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gurus can insert sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = guru_id);

CREATE POLICY "Gurus can update own sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = guru_id)
  WITH CHECK (auth.uid() = guru_id);

-- Appreciations table
CREATE TABLE IF NOT EXISTS appreciations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_name text NOT NULL DEFAULT '',
  guru_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL DEFAULT '',
  photo_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appreciations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view appreciations"
  ON appreciations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can insert appreciations"
  ON appreciations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gurus_skills ON gurus USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_gurus_rating ON gurus(rating DESC);
CREATE INDEX IF NOT EXISTS idx_gurus_active ON gurus(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_guru ON sessions(guru_id);
CREATE INDEX IF NOT EXISTS idx_appreciations_guru ON appreciations(guru_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_village ON profiles(village);
