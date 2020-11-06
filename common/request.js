import fetch from "node-fetch";
import parseString from "set-cookie-parser";

const defaultHeaders = {
  "Accept-Language": "en,en-US;q=0.8,ru-RU;q=0.5,ru;q=0.3",
  Cookie: `csrftoken=${process.env.CSRF_TOKEN}; sessionid=${process.env.SESSION_ID}; authenticated=1; authenticated_user=${process.env.AUTHENTICATED_USER}`,
  "X-CSRFToken": process.env.CSRF_TOKEN,
};

/**
 * Wrapper of `fetch` function, add required headers and cookies, handle some errors
 * @param {string}              url
 * @param {string}              params Parameters of fetch()
 * @returns {Promise<Response>}
 */
async function request(url, params) {
  const { headers, ...others } = params;

  const res = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...others,
  });
  const authenticated = parseString(res.headers.raw()["set-cookie"])?.find(
    (el) => el.name === "authenticated"
  )?.value;
  if (authenticated === 0 || authenticated === "0") {
    throw new Error("User is not authenticated");
  }
  if (!res.ok) {
    if (res.status < 400 && res.status >= 300) return res;
    if (res.status === 403) {
      throw new Error(`User is not authenticated`);
    }
    throw new Error(`Request didn't succeed, status code is ${res.status}`);
  }
  return res;
}

export default request;
