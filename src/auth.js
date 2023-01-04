const KEY = "conduit-auth";

export const getAuth = () => JSON.parse(localStorage.getItem(KEY));

export const setAuth = (user) =>
  localStorage.setItem(KEY, JSON.stringify(user));

export const clearAuth = () => localStorage.removeItem(KEY);
