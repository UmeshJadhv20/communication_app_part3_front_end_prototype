// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getUserByToken } from '../api/apiService';

export const UserContext = createContext();

export const GetUser = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); // or get the token from cookies
      if (token) {
        const userData = await getUserByToken(token);
        if (userData) {
          setUser(userData);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
