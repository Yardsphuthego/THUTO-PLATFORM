import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired/invalid sessions globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? '';
      const isAuthRequest =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/verify-token');

      if (!isAuthRequest) {
        const currentUserRaw = localStorage.getItem('user');
        let currentUserRole: string | undefined;
        if (currentUserRaw && currentUserRaw !== 'null') {
          try {
            currentUserRole = JSON.parse(currentUserRaw)?.role;
          } catch {
            currentUserRole = undefined;
          }
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const onAuthPage = currentPath === '/login' || currentPath === '/admin-login';
          if (!onAuthPage) {
            const isAdminSession = currentUserRole === 'admin' || currentUserRole === 'super_admin';
            const fallbackAuthPath = isAdminSession ? '/admin-login' : '/login';
            window.location.href = `${fallbackAuthPath}?reason=session-expired`;
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (email: string, password: string, studentId: string, fullName: string) =>
    apiClient.post('/auth/register', { email, password, student_id: studentId, full_name: fullName }),
  
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  verifyToken: (token: string) =>
    apiClient.post('/auth/verify-token', { token }),
};

// User services
export const userService = {
  getUser: (userId: number) =>
    apiClient.get(`/users/${userId}`),
  
  updateUser: (userId: number, data: any) =>
    apiClient.put(`/users/${userId}`, data),
  
  listVoters: () =>
    apiClient.get('/users/'),
};

// Election services
export const electionService = {
  createElection: (data: any) =>
    apiClient.post('/elections/', data),
  
  getElection: (electionId: number) =>
    apiClient.get(`/elections/${electionId}`),
  
  listElections: () =>
    apiClient.get('/elections/'),
  
  updateElection: (electionId: number, data: any) =>
    apiClient.put(`/elections/${electionId}`, data),
  
  getResults: (electionId: number) =>
    apiClient.get(`/elections/${electionId}/results`),
};

// Candidate services
export const candidateService = {
  createCandidate: (data: any) =>
    apiClient.post('/candidates/', data),

  listCandidates: () =>
    apiClient.get('/candidates/'),

  getElectionCandidates: (electionId: number) =>
    apiClient.get(`/candidates/election/${electionId}`),

  deleteCandidate: (candidateId: number) =>
    apiClient.delete(`/candidates/${candidateId}`),
};

// Vote services
export const voteService = {
  castVote: (electionId: number, candidateId: number, voterId: number) =>
    apiClient.post('/votes/', { election_id: electionId, candidate_id: candidateId }, {
      params: { voter_id: voterId },
    }),
  
  getVoterStatus: (electionId: number, voterId: number) =>
    apiClient.get(`/votes/${electionId}/voter-status/${voterId}`),
  
  getElectionVotes: (electionId: number) =>
    apiClient.get(`/votes/${electionId}`),
};

// Super admin services
export const superAdminService = {
  listUniversities: (skip = 0, limit = 100) =>
    apiClient.get('/admin/universities', { params: { skip, limit } }),

  createUniversity: (data: {
    name: string;
    code: string;
    abbreviation: string;
    description?: string;
    location?: string;
    website?: string;
    contact_email?: string;
  }) =>
    apiClient.post('/admin/universities/create', null, { params: data }),

  deleteUniversity: (universityId: number) =>
    apiClient.delete(`/admin/universities/${universityId}`),

  listAdmins: (skip = 0, limit = 100) =>
    apiClient.get('/admin/admins', { params: { skip, limit } }),

  createAdmin: (data: {
    email: string;
    full_name: string;
    password: string;
    university_id?: number;
  }) =>
    apiClient.post('/admin/admins/create', null, { params: data }),

  deleteAdmin: (adminId: number) =>
    apiClient.delete(`/admin/admins/${adminId}`),
};
