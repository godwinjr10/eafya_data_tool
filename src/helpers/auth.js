export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'public';
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};