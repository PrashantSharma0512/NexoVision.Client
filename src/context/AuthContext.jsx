import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const rollno = localStorage.getItem('rollno');

    if (token && role) {
      setUser({ token, role, name, rollno });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (userData.token) localStorage.setItem('token', userData.token);
    if (userData.role) localStorage.setItem('role', userData.role);
    if (userData.name) localStorage.setItem('name', userData.name);
    if (userData.rollno) localStorage.setItem('rollno', userData.rollno);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('rollno');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create and export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};