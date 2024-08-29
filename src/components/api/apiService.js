import Cookies from 'js-cookie';
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all users
export const fetchUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// Register a new user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response.json();
};

// Login a user
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return await response.json();
};

// Update user by ID
export const updateUser = async (id, userData, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  return await response.json();
};

// Delete user by ID
export const deleteUser = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

export const getUserByToken = async (token) => {
  try {
    const response = await fetch('/api/user_by_token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};


export const getLoggedInUser = async () => {
  const token = Cookies.get('token');
  const config = {
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
  };
  try {
      const response = await fetch(`${API_BASE_URL}/get_auth_user`, config);
      if (response.status === 403 || response.status===401) {
          console.log('User is not logged in');
          return null
      }
      return await response.json()
  } catch (error) {
      
  }
}

