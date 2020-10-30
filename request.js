import fetch from "node-fetch";
import parseString from "set-cookie-parser";
import { defaultHeaders } from "./Config.js";

function request(url, params) {
  const method = params.method || "GET";
  const body = params.body || null;
  const additionalHeaders = params.additionalHeaders || null;
  return fetch(url, {
    method,
    headers: {
      ...defaultHeaders,
      ...additionalHeaders,
    },
    body,
  }).then((res) => {
    const authenticated = parseString(res.headers.raw()["set-cookie"])?.find(
      (el) => el.name === "authenticated"
    )?.value;
    if (authenticated === 0 || authenticated === "0") {
      throw new Error("User is not authenticated");
    }
    if (res.status !== 200) {
      throw new Error(`Request didn't succeed, status code is ${res.status}`);
    }
    return res;
  });
}

export default request;
