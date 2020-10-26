import fetch from "node-fetch";
import parseString from "set-cookie-parser";
import { defaultHeaders } from "./Config.js";

function request(url, referer, method = "GET") {
  return fetch(url, {
    headers: {
      ...defaultHeaders,
      referer,
    },
    method,
  })
    .then((res) => {
      const authenticated = parseString(res.headers.raw()["set-cookie"])?.find(
        (el) => el.name === "authenticated"
      )?.value;
      let out = {};
      if (authenticated === 0 || authenticated === "0") {
        out.status = 1;
        out.message = "User is not authenticated";
        return out;
      }
      if (res.status !== 200) {
        out.status = 2;
        out.message = `Request didn't succeed, status code is ${res.status}`;
        return out;
      }
      out.status = 0;
      out.message = "OK";
      out.res = res;
      return out;
    })
    .catch((err) => {
      return {
        status: 3,
        message: "Some error happened",
        error: err,
      };
    });
}

export default request;
