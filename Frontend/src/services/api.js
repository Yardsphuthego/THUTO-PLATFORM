const API_BASE_URL = 'http://localhost:5000/api';

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
