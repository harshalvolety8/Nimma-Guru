export interface DemoGuru {
  id: string;
  full_name: string;
  photo_url: string;
  village: string;
  street: string;
  role: string;
  languages: string[];
  age: number;
  skills: string[];
  experience: string;
  available_hours: Record<string, string[]>;
  preferred_location: string;
  rating: number;
  appreciation_count: number;
  total_students_taught: number;
  hours_contributed: number;
  is_active: boolean;
}

export interface DemoSession {
  id: string;
  guru_id: string;
  guru_name: string;
  subject: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_capacity: number;
  attendee_count: number;
  created_at: string;
}

export interface DemoAppreciation {
  id: string;
  student_name: string;
  guru_id: string;
  message: string;
  created_at: string;
}
