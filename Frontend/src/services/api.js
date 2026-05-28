import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = window.localStorage.getItem('access_token');

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// User API calls
export const userAPI = {
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },

  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Document API calls
export const documentAPI = {
  createDocument: async (docData) => {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData)
    });
    return response.json();
  },

  getDocuments: async () => {
    const response = await fetch(`${API_BASE_URL}/documents`);
    return response.json();
  },

  getDocumentById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`);
    return response.json();
  },

  updateDocument: async (id, docData) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData)
    });
    return response.json();
  },

  deleteDocument: async (id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  addCollaborator: async (docId, userId) => {
    const response = await fetch(`${API_BASE_URL}/documents/${docId}/collaborators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return response.json();
  }
};

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (email, password, studentId, fullName) =>
    apiClient.post('/auth/register', {
      email,
      password,
      student_id: studentId,
      full_name: fullName,
    }),
  verifyToken: (token) => apiClient.post('/auth/verify-token', { token }),
};

export const electionService = {
  listElections: () =>
    apiClient.get('/elections', {
      headers: getAuthHeaders(),
    }),
  createElection: (payload) =>
    apiClient.post('/elections', payload, {
      headers: getAuthHeaders(),
    }),
};

export const candidateService = {
  listCandidates: () =>
    apiClient.get('/candidates', {
      headers: getAuthHeaders(),
    }),
  createCandidate: (payload) =>
    apiClient.post('/candidates', payload, {
      headers: getAuthHeaders(),
    }),
  deleteCandidate: (candidateId) =>
    apiClient.delete(`/candidates/${candidateId}`, {
      headers: getAuthHeaders(),
    }),
};

export const superAdminService = {
  listUniversities: () =>
    apiClient.get('/admin/universities', {
      headers: getAuthHeaders(),
    }),
  createUniversity: (payload) =>
    apiClient.post('/admin/universities/create', payload, {
      headers: getAuthHeaders(),
    }),
  deleteUniversity: (universityId) =>
    apiClient.delete(`/admin/universities/${universityId}`, {
      headers: getAuthHeaders(),
    }),
  listAdmins: () =>
    apiClient.get('/admin/admins', {
      headers: getAuthHeaders(),
    }),
  createAdmin: (payload) =>
    apiClient.post('/admin/admins/create', payload, {
      headers: getAuthHeaders(),
    }),
  deleteAdmin: (adminId) =>
    apiClient.delete(`/admin/admins/${adminId}`, {
      headers: getAuthHeaders(),
    }),
};

export const userService = {
  updateUser: (userId, payload) =>
    apiClient.put(`/users/${userId}`, payload, {
      headers: getAuthHeaders(),
    }),
};

export { apiClient };
