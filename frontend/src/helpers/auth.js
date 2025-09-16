export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role || "user";
};

export const isAdmin = () => {
  return getUserRole() === "admin";
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user") || "{}");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
