import { server_url } from "./config.js";
import { getAuth } from "./auth.js";

const fetchWithHeaders = async (reqAuth, fetch) => {
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  };
  if (reqAuth) {
    const auth = getAuth();
    if (auth) {
      headers["Authorization"] = "Token " + auth.token;
    }
  }

  const res = await fetch(headers);
  if (res.status === 401) {
    location.hash = "#/login";
    return {};
  }
  if (res.status === 204) {
    return {};
  }
  return await res.json();
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
      body: JSON.stringify(body),
    })
  );

export const fetchPut = (path, body, reqAuth) =>
  fetchWithHeaders(reqAuth, (headers) =>
    fetch(server_url + path, {
      headers: headers,
      method: "PUT",
      body: JSON.stringify(body),
    })
  );

export const fetchDelete = (path, reqAuth) =>
  fetchWithHeaders(reqAuth, (headers) =>
    fetch(server_url + path, {
      headers: headers,
      method: "DELETE",
    })
  );
