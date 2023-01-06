import { server_url } from "./config.js";
import { getAuth } from "./auth.js";

const fetchWithHeaders = async (reqAuth, fetch) => {
  const headers = {
    Accept: "application/json, */*",
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

export const fetchGet = (path, params, reqAuth) => {
  const url = new URL(path, server_url);
  url.search = new URLSearchParams(params);
  return fetchWithHeaders(reqAuth, (headers) => fetch(url, { headers }));
};

export const fetchPost = (path, body, reqAuth) => {
  const url = new URL(path, server_url);
  return fetchWithHeaders(reqAuth, (headers) =>
    fetch(url, { headers, method: "POST", body: JSON.stringify(body) })
  );
};

export const fetchPut = (path, body, reqAuth) => {
  const url = new URL(path, server_url);
  return fetchWithHeaders(reqAuth, (headers) =>
    fetch(url, { headers, method: "PUT", body: JSON.stringify(body) })
  );
};

export const fetchDelete = (path, body, reqAuth) => {
  const url = new URL(path, server_url);
  return fetchWithHeaders(reqAuth, (headers) =>
    fetch(url, { headers, method: "DELETE", body: JSON.stringify(body) })
  );
};
