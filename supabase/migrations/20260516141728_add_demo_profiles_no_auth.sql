/*
  # Add Demo Profiles Table for Sample Data

  ## Overview
  Creates a separate demo_gurus view/table that stores sample guru data
  without requiring auth.users FK, so the app can display rich content
  immediately without requiring user signup.

  ## Changes
  - Creates `demo_gurus` table with all guru data (no FK to auth)
  - Creates `demo_sessions` table for sample upcoming classes
  - Creates `demo_appreciations` table for sample thank-you notes
  - RLS: public read for all demo tables (no auth required to browse)
*/

CREATE TABLE IF NOT EXISTS demo_gurus (
  id text PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  photo_url text DEFAULT '',
  village text DEFAULT '',
  street text DEFAULT '',
  role text DEFAULT 'guru',
  languages text[] DEFAULT ARRAY['English'],
  age int DEFAULT 0,
  skills text[] DEFAULT ARRAY[]::text[],
  experience text DEFAULT '',
  available_hours jsonb DEFAULT '{}'::jsonb,
  preferred_location text DEFAULT 'Community Center',
  rating numeric(3,2) DEFAULT 0,
  appreciation_count int DEFAULT 0,
  total_students_taught int DEFAULT 0,
  hours_contributed int DEFAULT 0,
  is_active boolean DEFAULT true
);

ALTER TABLE demo_gurus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view demo gurus"
  ON demo_gurus FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS demo_sessions (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  guru_id text NOT NULL,
  guru_name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  session_date date NOT NULL,
  start_time text NOT NULL DEFAULT '',
  end_time text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  max_capacity int DEFAULT 20,
  attendee_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demo_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view demo sessions"
  ON demo_sessions FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS demo_appreciations (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_name text NOT NULL DEFAULT '',
  guru_id text NOT NULL,
  message text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demo_appreciations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view demo appreciations"
  ON demo_appreciations FOR SELECT
  USING (true);

-- Seed sample gurus
INSERT INTO demo_gurus VALUES
  ('guru-1', 'Ramaiah Venkatesh', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', 'Jayanagar', 'South End Circle', 'guru', ARRAY['English', 'Kannada'], 65, ARRAY['Mathematics', 'Physics', 'Science'], 'Retired Principal from Government High School with 35 years of teaching experience in Mathematics and Physics. Dedicated to making these subjects accessible to every student.', '{"Saturday": ["9:00 AM", "10:00 AM", "11:00 AM"], "Sunday": ["9:00 AM", "10:00 AM"]}'::jsonb, 'Samudaya Bhavana', 4.9, 42, 78, 312, true),
  ('guru-2', 'Saraswathi Murthy', 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400', 'Basavanagudi', 'Gandhi Bazaar', 'guru', ARRAY['Kannada', 'English'], 62, ARRAY['Kannada', 'English', 'Literature'], 'Former Kannada language teacher with a passion for literature and creative writing. 28 years of experience nurturing love for our mother tongue.', '{"Saturday": ["10:00 AM", "11:00 AM", "2:00 PM"], "Sunday": ["10:00 AM", "11:00 AM"]}'::jsonb, 'Community Center', 4.8, 38, 65, 260, true),
  ('guru-3', 'Krishnamurthy Rao', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', 'Malleshwaram', 'Margosa Road', 'guru', ARRAY['English', 'Kannada'], 70, ARRAY['Mathematics', 'Engineering', 'Carpentry'], 'Retired Civil Engineer with expertise in applied mathematics and basic carpentry skills. Believes in learning by doing.', '{"Saturday": ["8:00 AM", "9:00 AM", "10:00 AM"]}'::jsonb, 'Home', 4.7, 29, 45, 180, true),
  ('guru-4', 'Meenakshi Sundaram', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400', 'Rajajinagar', 'BEL Road', 'guru', ARRAY['Kannada', 'English', 'Tamil'], 58, ARRAY['Science', 'Biology', 'Health Education'], 'Retired Biology teacher specializing in environmental science and health awareness. Makes science come alive through nature walks and experiments.', '{"Saturday": ["11:00 AM", "2:00 PM", "3:00 PM"], "Sunday": ["11:00 AM", "2:00 PM"]}'::jsonb, 'Samudaya Bhavana', 4.6, 24, 52, 208, true),
  ('guru-5', 'Prakash Narayana', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 'Banashankari', 'Kanakapura Road', 'guru', ARRAY['English', 'Kannada'], 67, ARRAY['Computer Science', 'Mathematics', 'Coding'], 'Retired Software Engineer from ISRO. Passionate about introducing village kids to technology and coding. Former project lead on satellite systems.', '{"Saturday": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM"]}'::jsonb, 'Community Center', 4.9, 51, 92, 368, true),
  ('guru-6', 'Lalitha Devi', 'https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=400', 'Vijayanagar', 'Chord Road', 'guru', ARRAY['Kannada', 'English'], 60, ARRAY['Music', 'Arts & Crafts', 'Dance'], 'Classical Carnatic musician and Bharatanatyam dance teacher with 30 years of performing and teaching experience. Preserving our cultural heritage.', '{"Saturday": ["4:00 PM", "5:00 PM"], "Sunday": ["4:00 PM", "5:00 PM", "6:00 PM"]}'::jsonb, 'Community Center', 4.8, 35, 60, 240, true),
  ('guru-7', 'Suresh Babu', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400', 'Koramangala', '80 Feet Road', 'guru', ARRAY['English', 'Kannada'], 63, ARRAY['English', 'Communication Skills', 'Public Speaking'], 'Retired journalist and English teacher. Helps students build confidence in spoken English and public speaking. Former editor at Deccan Herald.', '{"Saturday": ["10:00 AM", "11:00 AM"], "Sunday": ["10:00 AM", "11:00 AM", "2:00 PM"]}'::jsonb, 'Samudaya Bhavana', 4.7, 33, 48, 192, true),
  ('guru-8', 'Geetha Krishnaswamy', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400', 'HSR Layout', 'Sector 7', 'guru', ARRAY['English', 'Kannada', 'Hindi'], 56, ARRAY['History', 'Social Studies', 'Geography'], 'Retired History professor who makes learning about India engaging through storytelling and visual aids. Former HOD at Bangalore University.', '{"Saturday": ["2:00 PM", "3:00 PM", "4:00 PM"], "Sunday": ["2:00 PM", "3:00 PM"]}'::jsonb, 'Home', 4.5, 20, 38, 152, true)
ON CONFLICT (id) DO NOTHING;

-- Seed sample sessions
INSERT INTO demo_sessions (id, guru_id, guru_name, subject, session_date, start_time, end_time, location, max_capacity, attendee_count) VALUES
  ('session-1', 'guru-1', 'Ramaiah Venkatesh', 'Mathematics - Algebra Basics', CURRENT_DATE + 3, '09:00', '10:30', 'Jayanagar Samudaya Bhavana', 20, 12),
  ('session-2', 'guru-5', 'Prakash Narayana', 'Introduction to Computers', CURRENT_DATE + 5, '10:00', '12:00', 'Banashankari Community Center', 15, 9),
  ('session-3', 'guru-2', 'Saraswathi Murthy', 'Kannada Literature & Grammar', CURRENT_DATE + 6, '10:30', '12:00', 'Basavanagudi Community Center', 25, 18),
  ('session-4', 'guru-6', 'Lalitha Devi', 'Carnatic Music for Beginners', CURRENT_DATE + 7, '16:00', '17:30', 'Vijayanagar Community Center', 12, 8),
  ('session-5', 'guru-7', 'Suresh Babu', 'Spoken English Workshop', CURRENT_DATE + 10, '10:00', '11:30', 'Koramangala Samudaya Bhavana', 20, 14),
  ('session-6', 'guru-4', 'Meenakshi Sundaram', 'Science - Environment & Ecology', CURRENT_DATE + 12, '11:00', '12:30', 'Rajajinagar Samudaya Bhavana', 18, 7)
ON CONFLICT (id) DO NOTHING;

-- Seed sample appreciations
INSERT INTO demo_appreciations (id, student_name, guru_id, message, created_at) VALUES
  ('appr-1', 'Ananya Reddy', 'guru-1', 'Ramaiah sir explained algebra so clearly! I went from failing to scoring 95 in my exams. Namaskaara sir!', now() - INTERVAL '5 days'),
  ('appr-2', 'Ravi Kumar', 'guru-1', 'The way you connect real-life examples to math concepts is amazing. Thank you for all your patience!', now() - INTERVAL '10 days'),
  ('appr-3', 'Priya Sharma', 'guru-5', 'Learning coding from you has changed my life! I built my first website thanks to you, Prakash uncle!', now() - INTERVAL '3 days'),
  ('appr-4', 'Mohan Das', 'guru-2', 'Saraswathi madam''s Kannada classes are beautiful. She makes our language feel so rich and meaningful.', now() - INTERVAL '7 days'),
  ('appr-5', 'Deepika Nair', 'guru-6', 'I performed at my school annual day because of Lalitha aunty''s music training. Bahala thanks!', now() - INTERVAL '2 days'),
  ('appr-6', 'Vikram Hegde', 'guru-7', 'My confidence in spoken English has improved so much. The mock interview sessions were incredibly helpful!', now() - INTERVAL '8 days'),
  ('appr-7', 'Kavya Rao', 'guru-3', 'Krishnamurthy uncle made engineering concepts so simple. Now I want to become a civil engineer!', now() - INTERVAL '15 days'),
  ('appr-8', 'Arun Patel', 'guru-4', 'Meenakshi madam''s biology sessions opened my eyes to nature. I now look at every plant and animal differently!', now() - INTERVAL '4 days'),
  ('appr-9', 'Sindhu Gowda', 'guru-8', 'History has never been this interesting! The way she tells stories about our freedom fighters gives me goosebumps!', now() - INTERVAL '6 days'),
  ('appr-10', 'Suresh Bhat', 'guru-5', 'I got selected for a coding competition at district level. Prakash sir is the reason. Thank you from the bottom of my heart!', now() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
