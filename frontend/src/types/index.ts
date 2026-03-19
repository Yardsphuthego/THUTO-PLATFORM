export interface User {
  id: number;
  email: string;
  student_id?: string | null;
  full_name: string;
  role?: string;
  university_id?: number | null;
  profile_picture?: string | null;
  is_active: boolean;
  is_voter: boolean;
  created_at: string;
  updated_at: string;
}

export interface Election {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  start_date: string;
  end_date: string;
  university_id?: number | null;
  is_active: boolean;
  created_by?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: number;
  election_id: number;
  user_id?: number | null;
  candidate_name: string;
  party_name?: string | null;
  candidate_photo?: string | null;
  party_logo?: string | null;
  position: string;
  manifesto: string;
  biography?: string | null;
  votes_count: number;
  created_at: string;
}

export interface Vote {
  id: number;
  election_id: number;
  voter_id: number;
  candidate_id: number;
  cast_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user?: User;
}
