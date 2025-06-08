// src/utils/auth.js
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };
  
  export const getCurrentRole = () => {
    return localStorage.getItem('role');
  };
  
  export const hasRole = (requiredRoles) => {
    if (!requiredRoles) return true;
    const userRole = getCurrentRole();
    return requiredRoles.includes(userRole);
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };