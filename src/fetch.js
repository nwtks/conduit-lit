import { server_url } from "./config.js";
import { getAuth } from "./auth.js";

const fetchWithHeaders = (reqAuth, fetch) => {
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  };

  if (reqAuth) {
    const auth = getAuth();
    if (auth) {
      headers["Authorization"] = "Token " + auth.token;
    } else {
      location.hash = "#/login";
      return new Promise((resolve, reject) => reject());
    }
  }

  return fetch(headers).then((response) => {
    if (response.status === 401) {
      location.hash = "#/login";
    }
    return response.json();
  });
};

export const fetchGet = (path, reqAuth) =>
  fetchWithHeaders(reqAuth, (headers) =>
    fetch(server_url + path, {
      headers: headers,
    })
  );

export const fetchPost = (path, body, reqAuth) =>
  fetchWithHeaders(reqAuth, (headers) =>
    fetch(server_url + path, {
      headers: headers,
      method: "POST",
      body: body,
    })
  );

export const fetchPut = (path, body, reqAuth) =>
  fetchWithHeaders(reqAuth, (headers) =>
    fetch(server_url + path, {
      headers: headers,
      method: "PUT",
      body: body,
    })
  );

export const fetchDelete = (path, reqAuth) =>
  fetchWithHeaders(reqAuth, (headers) =>
    fetch(server_url + path, {
      headers: headers,
      method: "DELETE",
    })
  );
