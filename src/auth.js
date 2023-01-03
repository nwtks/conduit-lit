import { server_url } from "./config";

const KEY = "conduit-auth";

export const getAuth = () => JSON.parse(localStorage.getItem(KEY));

export const setAuth = (user) =>
  localStorage.setItem(KEY, JSON.stringify(user));

export const clearAuth = () => localStorage.removeItem(KEY);

export const authenticate = (email, password) =>
  new Promise((resolve, reject) =>
    fetch(server_url + "users/login", {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        user: {
          email,
          password,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.user) {
          setAuth(res.user);
          resolve(res.user);
        } else {
          reject(res.errors);
        }
      })
  );
